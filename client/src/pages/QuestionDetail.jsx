import React, { useState } from "react"
import LiveTranscription from "./LiveTranscriptionv2"

function QuestionDetail({ question }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState("idle") // idle | listening | processing | done
  const [feedback, setFeedback] = useState("")
  const [pronunciationScore, setPronunciationScore] = useState(null)
  const [contentScore, setContentScore] = useState(null)
  const [spokenText, setSpokenText] = useState("")

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleTranscriptUpdate = async (transcript, confidence) => {
    setStatus("processing")

    try {
      const res = await fetch("http://localhost:5000/practice_attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          spokenText: transcript,
          transcriptionConfidence: confidence,
        }),
      })

      const data = await res.json()
      setFeedback(data.attempt.ai_feedback)
      setPronunciationScore(data.attempt.pronunciation_score)
      setContentScore(data.attempt.content_score)
      setSpokenText(data.attempt.spoken_text)
      setStatus("done")
    } catch (err) {
      console.error("Failed to submit response:", err)
      setStatus("error")
    }
  }

  return (
    <div className="mb-6 border border-black rounded-md bg-white p-4">
      <button
        onClick={toggleExpand}
        className="w-full text-left text-lg font-semibold hover:bg-yellow-100 rounded-md p-2"
      >
        {question.question_text}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <LiveTranscription
            onTranscriptUpdate={handleTranscriptUpdate}
            onStatusChange={setStatus}
          />

          {/* Status & Results */}
          {status === "processing" && <p>⏳ Analyzing your response...</p>}
          {status === "done" && (
            <div className="bg-gray-100 border border-black rounded p-4">
              <p>
                <strong>Transcript:</strong> {spokenText}
              </p>
              <p>
                <strong>Pronunciation Score:</strong>{" "}
                {Math.round(pronunciationScore * 100)}%
              </p>
              <p>
                <strong>Content Score:</strong> {contentScore}/10
              </p>
              <p>
                <strong>Feedback:</strong> {feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionDetail
