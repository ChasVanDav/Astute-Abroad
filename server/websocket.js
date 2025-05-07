import { WebSocketServer } from "ws"
import speech from "@google-cloud/speech"

const credentials = JSON.parse(process.env.GOOGLE_STT_API_KEY)
const client = new speech.SpeechClient({ credentials })

export function setupWebSocket(server) {
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
          recognizeStream?.destroy()
          recognizeStream = null
        })
        .on("data", (data) => {
          const isFinal = data.results?.[0]?.isFinal
          const transcript = data.results?.[0]?.alternatives?.[0].transcript
          const confidence = data.results?.[0]?.alternatives?.[0].confidence
          if (isFinal) {
            ws.send(JSON.stringify({ transcript, isFinal, confidence }))
          }
        })
    }

    ws.on("message", (msg) => {
      if (!recognizeStream) startRecognitionStream()
      if (recognizeStream?.writable) recognizeStream.write(msg)
    })

    ws.on("close", () => {
      recognizeStream?.end()
      recognizeStream = null
    })
  })
}
