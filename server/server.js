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
import { scrapeAndInsert } from "./scraper/scrape.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()")
    res.json({
      message: "✅ Database connected!",
      time: result.rows[0].now,
    })
  } catch (error) {
    console.error("❌ DB test error:", error)
    res.status(500).json({ error: "Database connection failed" })
  }
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

    const prompt = `You’re evaluating a Korean language learner’s spoken response. You’ll receive two things:

the question they were asked: "${questionText}"

the speech-to-text transcript of what they said: "${spokenText}"

Your goal is to give warm, second-person feedback that encourages the learner and helps them improve. Only base your comments on what’s in the transcript — don’t guess what they meant to say. There is no single “correct” answer, so it's fine if the learner gives a negative, indirect, or alternate response, as long as it fits the question.

Start by commenting (in a kind and helpful tone) on how well their response answered the question. If the reply was incomplete, unclear, or only partially relevant, point that out in a constructive way. Be supportive and affirm the effort, even if there's room to grow.

Next, look at the pronunciation. If the transcript includes words that were likely misrecognized due to pronunciation issues, gently highlight those and suggest what the learner might have intended. If everything looks accurate and clear, give them credit for that.

Then, offer 1–2 example responses they could use in the future. These should include:

One basic or beginner-friendly version that’s clear and easy to say

One more advanced or detailed version that shows more fluency or nuance
Each should make sense as a response to the original question. These are for the learner to study and learn from — so aim to model good, usable Korean, not just short phrases.

Wrap everything up in a single friendly paragraph, talking directly to the learner (“you”), highlighting what they did well, what they can work on, and how they might respond even better next time. Keep the tone warm, human, and encouraging — like a thoughtful tutor giving feedback.`

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

    checkDatabaseAndScrape()
  } catch (err) {
    logger.error("❌ Init failed:", err)
  }
}

init().catch((err) => {
  console.error("Startup failure:", err)
})
