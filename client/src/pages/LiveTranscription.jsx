import React, { useEffect, useRef, useState } from "react"

export default function LiveTranscription({
  onTranscriptUpdate, // Called with final transcript and confidence
  onStatusChange, // Tells parent what stage we're in
  duration = 30, // Max time allowed for recording (in seconds)
}) {
  const [transcript, setTranscript] = useState("")
  const [transcriptLines, setTranscriptLines] = useState([])
  const [timeLeft, setTimeLeft] = useState(duration)

  const socketRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const transcriptEndRef = useRef(null)
  const timerRef = useRef(null)
  const timeoutRef = useRef(null)
  const lastConfidenceRef = useRef(null)

  const startRecording = async () => {
    onStatusChange?.("listening")
    setTimeLeft(duration)
    setTranscript("")
    setTranscriptLines([])

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    socketRef.current = new WebSocket("ws://localhost:5000")

    socketRef.current.onmessage = (message) => {
      const {
        transcript: partial,
        isFinal,
        confidence,
      } = JSON.parse(message.data)

      if (isFinal && partial.trim()) {
        setTranscriptLines((prev) => [...prev, partial.trim()])
        setTranscript("")
        lastConfidenceRef.current = confidence || null
      } else {
        setTranscript(partial)
      }
    }

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 16000,
    })

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0 && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(e.data)
      }
    }

    mediaRecorderRef.current.start(250)

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Stop recording after the time limit
    timeoutRef.current = setTimeout(() => {
      stopRecording()
    }, duration * 1000)
  }

  const stopRecording = () => {
    onStatusChange?.("processing")
    mediaRecorderRef.current?.stop()
    socketRef.current?.close()
    clearInterval(timerRef.current)
    clearTimeout(timeoutRef.current)

    const fullTranscript = [...transcriptLines, transcript].join(" ").trim()
    const confidence = lastConfidenceRef.current || null

    onTranscriptUpdate?.(fullTranscript, confidence)
  }

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" })

    return () => {
      clearInterval(timerRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="p-4 text-black">
      <button
        onClick={startRecording}
        className="mr-4 bg-black text-white px-4 py-2 rounded"
      >
        🎙️ Start
      </button>
      <button
        onClick={stopRecording}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        ⏹ Stop
      </button>

      <p className="text-red-500 font-bold text-lg mt-2">
        ⏳ Time left: {timeLeft}s
      </p>

      <div className="mt-4 bg-white p-4 border border-black rounded">
        <h3 className="text-lg font-semibold mb-2">Live Transcript:</h3>
        <div className="space-y-1">
          {transcriptLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
          {transcript && <p className="italic text-gray-500">{transcript}</p>}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  )
}
