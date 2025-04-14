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
        const transcript =
          data.results?.[0]?.alternatives?.[0]?.transcript || ""
        const isFinal = data.results?.[0]?.isFinal
        ws.send(JSON.stringify({ transcript, isFinal }))
      })
  }

  ws.on("message", (msg) => {
    console.log("📦 Received audio chunk:", msg.length)
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

server.listen(5000, () => {
  logger.info("Server running on http://localhost:5000")
})
