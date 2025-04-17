import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import questionsRoute from "./routes/questions.js"
import logger from "./logger.js"
import http from "http"
import { WebSocketServer } from "ws"
import speech from "@google-cloud/speech"
import { fileURLToPath } from "url"
import { join, dirname } from "path"
import OpenAI from "openai"
import db from "./db.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

app.use("/questions", questionsRoute)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Google Speech client
const client = new speech.SpeechClient({
  keyFilename: join(__dirname, "languageproject-0525-9e51cc60157d.json"),
})

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
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
        console.log("Raw Google STT Response:", JSON.stringify(data, null, 2))

        const transcript =
          data.results?.[0]?.alternatives?.[0]?.transcript || ""
        const isFinal = data.results?.[0]?.isFinal
        ws.send(JSON.stringify({ transcript, isFinal }))
      })
  }

  ws.on("message", (msg) => {
    // console.log("📦 Received audio chunk:", msg.length)
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

async function quickTest() {
  const [result] = await client.getProjectId()
  console.log("✅ Auth successful for project:", result)
}

quickTest().catch(console.error)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

app.post("/practice_attempts", async (req, res) => {
  const { questionId, spokenText, transcriptionConfidence } = req.body
  const userId = 1 // placeholder user

  if (!questionId || !spokenText) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  try {
    // 🧠 1. Get question text from DB
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
    ---
    Transcript: "<insert the transcript>"
    1. Answered the question: <Yes or No> + (short explanation)
    2. Mispronunciations: <details or "None">
    3. Pronunciation Score: <0–10>
    4. Content Score: <0–10>
    5. Relevant: Yes/No
    ---
    `
    // 🧠 3. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const feedback = completion.choices[0].message.content

    // 🎯 4. Extract content score
    const contentMatch = feedback.match(/score.*?(\d{1,2})/i)
    const contentScore = contentMatch ? parseInt(contentMatch[1]) : null

    // 🔍 5. Extract relevance
    const relevanceMatch = feedback.match(/relevant:\s*(yes|no)/i)
    const isRelevant = relevanceMatch
      ? relevanceMatch[1].toLowerCase() === "yes"
      : null

    // 💾 6. Save in DB
    const insertQuery = `
      INSERT INTO practice_attempts (
        user_id, question_id, spoken_text, transcription_confidence,
        ai_feedback, content_score, pronunciation_score, is_relevant
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `

    let pronunciationScore = Math.round(transcriptionConfidence * 10)

    if (pronunciationScore < 3) {
      pronunciationScore = 0 // For very low confidence, set pronunciation score to 0
    }

    const values = [
      userId,
      questionId,
      spokenText,
      transcriptionConfidence,
      feedback,
      contentScore,
      pronunciationScore, // using STT confidence for pronunciation
      isRelevant,
    ]

    console.log(`${values}`)
    console.log(
      "Pronunciation Score (raw):",
      pronunciationScore,
      transcriptionConfidence
    )

    const { rows } = await db.query(insertQuery, values)

    res.json({ success: true, attempt: rows[0] })
  } catch (err) {
    console.error("❌ Error processing practice attempt:", err)
    res.status(500).json({ error: "Failed to process response" })
  }
})

server.listen(5000, () => {
  logger.info("Server running on http://localhost:5000")
})
