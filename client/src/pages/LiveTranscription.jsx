import React, { useEffect, useRef, useState } from "react"

export default function LiveTranscription() {
  const [transcript, setTranscript] = useState("")
  const [transcriptLines, setTranscriptLines] = useState([])
  const socketRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const transcriptEndRef = useRef(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    socketRef.current = new WebSocket("ws://localhost:5000")

    socketRef.current.onmessage = (message) => {
      const { transcript: partial, isFinal } = JSON.parse(message.data)
      if (isFinal && partial.trim()) {
        setTranscriptLines((prev) => [...prev, partial.trim()])
        setTranscript("")
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

    mediaRecorderRef.current.start(250) // Send audio chunks every 250ms
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    socketRef.current?.close()
  }

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [transcriptLines])

  return (
    <div className="p-4 text-black">
      <button
        onClick={startRecording}
        className="mr-4 bg-black text-white px-4 py-2 rounded"
      >
        Start
      </button>
      <button
        onClick={stopRecording}
        className="bg-gray-700 text-white px-4 py-2 rounded"
      >
        Stop
      </button>
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
