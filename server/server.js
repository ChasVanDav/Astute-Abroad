import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import questionsRoute from "./routes/questions.js"
import logger from "./logger.js"
import http from "http"
import { WebSocketServer } from "ws"
import speech from "@google-cloud/speech"
import OpenAI from "openai"
import db from "./db.js"
import authRoute from "./routes/authRoutes.js"
import faveQuestionsRoute from "./routes/faveQuestions.js"
import completedQuestionsRoute from "./routes/completedQuestions.js"
import scrapeRouter, { scrapeAndInsert } from "./scraper/scrape.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

// user registration and login
app.use("/api", authRoute)
// display all questions, with filter options
app.use("/questions", questionsRoute)
// display, add, delete favorite questions
app.use("/favequestions", faveQuestionsRoute)
app.use("/completedQuestions", completedQuestionsRoute)

// import credentials from dotenv file
const credentials = JSON.parse(process.env.GOOGLE_STT_API_KEY)

// Google Speech client
const client = new speech.SpeechClient({ credentials })

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  logger.info("🔗 WebSocket client connected")

  let recognizeStream = null

  const request = {
    config: {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 16000,
      languageCode: "ko-KR",
      maxAlternatives: 5,
    },
    interimResults: true,
  }

  function startRecognitionStream() {
    recognizeStream = client
      .streamingRecognize(request)
      .on("error", (err) => {
        console.error("Speech API error:", err)
        if (recognizeStream) {
          recognizeStream.destroy()
          recognizeStream = null
        }
      })
      .on("data", (data) => {
        logger.debug(
          "📝 Raw Google STT Response:",
          JSON.stringify(data, null, 2)
        )

        const isFinal = data.results?.[0]?.isFinal
        const transcript = data.results?.[0]?.alternatives?.[0].transcript
        const confidence = data.results?.[0]?.alternatives?.[0].confidence
        if (isFinal) {
          ws.send(JSON.stringify({ transcript, isFinal, confidence }))
        }
      })
  }

  ws.on("message", (msg) => {
    logger.debug(`📦 Received audio chunk of length: ${msg.length}`)
    if (!recognizeStream) startRecognitionStream()
    if (recognizeStream?.writable) {
      recognizeStream.write(msg)
    }
  })

  ws.on("close", () => {
    if (recognizeStream) {
      recognizeStream.end()
      recognizeStream = null
    }
  })
})

// confirm google stt credentials recognized and connected
async function quickTest() {
  const [result] = await client.getProjectId()
  console.log("✅ Auth successful for project:", result)
}

quickTest().catch(console.error)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post("/practice_attempts", async (req, res) => {
  console.log("📩 Received POST /practice_attempts")
  const {
    userId: firebaseUid,
    questionId,
    spokenText,
    transcriptionConfidence,
  } = req.body

  if (!firebaseUid || !questionId || !spokenText) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  try {
    const questionRes = await db.query(
      "SELECT question_text FROM questions WHERE id = $1",
      [questionId]
    )
    const questionText = questionRes.rows[0]?.question_text

    if (!questionText) {
      return res.status(404).json({ error: "Question not found." })
    }

    const prompt = `
    You are evaluating a Korean language learner's spoken response. The only input you receive is:
    - The question asked: "${questionText}"
    - The learner's speech-to-text transcript: "${spokenText}"
    
    Guidelines:
    - The transcript reflects what was actually recognized by the speech-to-text engine — base your evaluation strictly on that, and do not assume or add words that aren't there.
    - There is no "expected" answer provided. Use your knowledge of Korean to assess whether the transcript is a valid, reasonable, and contextually accurate response to the question.
    - Accept **negative, neutral, or alternate forms** of responses if they make sense as an answer (e.g., "I’m not going anywhere" is a valid response to "Where are you going?").
    
    Evaluate the following:
    
    1. **Did the learner’s transcript directly answer the question?**
       - Be generous with phrasing variations, including negative forms.
       - Mark as a valid answer if it provides a reasonable and understandable response.
    
    2. **Pronunciation issues**
       - If any words in the transcript appear to be the result of **mispronunciation** (i.e., the learner meant something else but it got misrecognized), point them out with the likely intended word(s).
       - If the transcript looks accurate and natural, state "No mispronunciations detected."
    
    3. **Pronunciation Score** (0–10):
       - Score based on how well the spoken response was **recognized and transcribed**.
       - 10 = no obvious pronunciation issues; 0 = severely misrecognized or unintelligible.
    
    4. **Content Score** (0–10):
       - Score based on how completely and appropriately the transcript answers the question.
       - 10 = directly and clearly answers the question.
    
    5. **Relevance**:
       - Final flag: “Relevant: Yes” or “Relevant: No”
    
    Return your answer in the following format:

    1. Answered the question: <Yes or No> + (short explanation)
    2. Mispronunciations: <details or "None">
    3. Pronunciation Score: <0–10>
    4. Content Score: <0–10>
    5. Relevant: Yes/No
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const feedback = completion.choices[0].message.content

    const contentMatch = feedback.match(/score.*?(\d{1,2})/i)
    const contentScore = contentMatch ? parseInt(contentMatch[1]) : null

    const relevanceMatch = feedback.match(/relevant:\s*(yes|no)/i)
    const isRelevant = relevanceMatch
      ? relevanceMatch[1].toLowerCase() === "yes"
      : null

    const insertQuery = `
      INSERT INTO practice_attempts (
        user_id, question_id, spoken_text, transcription_confidence,
        ai_feedback, content_score, pronunciation_score, is_relevant
      )
      SELECT id, $2, $3, $4, $5, $6, $7, $8
      FROM users
      WHERE firebase_uid = $1
      RETURNING *;
    `

    let pronunciationScore = Math.round(transcriptionConfidence * 10)

    if (pronunciationScore < 3) {
      pronunciationScore = 0 // For very low confidence, set pronunciation score to 0
    }

    const values = [
      firebaseUid,
      questionId,
      spokenText,
      transcriptionConfidence,
      feedback,
      contentScore,
      pronunciationScore, // using STT confidence for pronunciation
      isRelevant,
    ]

    console.log(`${values}`)
    // console.log(
    //   "Pronunciation Score (raw):",
    //   pronunciationScore,
    //   transcriptionConfidence
    // )

    const { rows } = await db.query(insertQuery, values)
    if (!rows.length) {
      return res.status(404).json({ error: "User not found." })
    }

    res.json({ success: true, attempt: rows[0] })
  } catch (err) {
    console.error("❌ Error processing practice attempt:", err)
    res.status(500).json({ error: "Failed to process response" })
  }
})

// server.listen(5000, () => {
//   logger.info("Server running on http://localhost:5000")
// })

const PORT = process.env.PORT || 5000

// Check the database and scrape if needed
const checkDatabaseAndScrape = async () => {
  try {
    const { rows } = await db.query("SELECT COUNT(*) FROM questions")
    const count = Number(rows[0].count)
    logger.info(`🔍 Found ${count} questions in DB.`)

    if (count === 0) {
      logger.info("📥 No questions found — running scraper...")
      await scrapeAndInsert() // Run scraping here
      logger.info("✅ Scraping complete.")
    } else {
      logger.info("✅ Questions already exist. Skipping scrape.")
    }
  } catch (err) {
    logger.error("❌ Database check or scraping failed:", err)
  }
}

const startServer = () => {
  server.listen(process.env.PORT || 5000, () => {
    logger.info(
      `Server running on http://localhost:${process.env.PORT || 5000}`
    )
  })
}

const init = async () => {
  try {
    logger.info("⏳ Starting server...")
    startServer()

    // Run database check and scraping asynchronously without blocking the server startup
    checkDatabaseAndScrape()
  } catch (err) {
    logger.error("❌ Init failed:", err)
  }
}

init().catch((err) => {
  console.error("Startup failure:", err)
})

// app.use("/scrape", scrapeRouter)

// const bootstrap = async () => {
//   try {
//     const { rows } = await db.query("SELECT COUNT(*) FROM questions")
//     const count = Number(rows[0].count)
//     logger.info(`🔍 Found ${count} questions in DB.`)

//     if (count === 0) {
//       logger.info("📥 No questions found — running scraper...")
//       await scrapeAndInsert()
//       logger.info("✅ Scraping complete.")
//     } else {
//       logger.info("✅ Questions already exist. Skipping scrape.")
//     }
//   } catch (err) {
//     logger.error("❌ Bootstrap error:", err)
//     // You can optionally still start the server even if bootstrap fails
//   }
// }

// const startServer = () => {
//   server.listen(PORT, () => {
//     logger.info(`Server running on http://localhost:${PORT}`)
//   })
// }

// const init = async () => {
//   try {
//     logger.info("⏳ Starting bootstrap...")
//     await bootstrap()
//     logger.info("✅ Bootstrap complete. Starting server...")
//     startServer()
//   } catch (err) {
//     logger.error("❌ Init failed:", err)
//   }
// }

// init().catch((err) => {
//   console.error("Startup failure:", err)
// })
