import React, { useState } from "react"
import LiveTranscription from "./LiveTranscription"

function QuestionDetail({ question, user }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState("idle") // idle | listening | processing | done
  const [feedback, setFeedback] = useState("")
  const [pronunciationScore, setPronunciationScore] = useState(null)
  const [contentScore, setContentScore] = useState(null)
  const [spokenText, setSpokenText] = useState("")

  if (!user) {
    return <p className="text-red-500">Please log in to practice questions</p>
  }

  const toggleExpand = () => setExpanded(!expanded)

  const handleTranscriptUpdate = async (transcript, confidence) => {
    if (!user || !user.uid) {
      console.error("User not authenticated.")
      return
    }

    setStatus("processing")

    try {
      const res = await fetch("http://localhost:5000/practice_attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          questionId: question.id,
          spokenText: transcript,
          transcriptionConfidence: confidence,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.attempt) {
        throw new Error(data.error || "Unexpected response format.")
      }

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
    <div className="mb-6 border border-gray-300 rounded-md bg-white p-4 shadow-sm">
      <button
        onClick={toggleExpand}
        className="w-full text-left text-lg font-semibold hover:bg-yellow-100 rounded-md p-2 transition-all duration-150"
      >
        {question.question_text}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <LiveTranscription
            onTranscriptUpdate={handleTranscriptUpdate}
            onStatusChange={setStatus}
          />

          {/* Status and Feedback */}
          {status === "processing" && (
            <p className="text-sm text-gray-600">
              ⏳ Analyzing your response...
            </p>
          )}

          {status === "done" && (
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4 space-y-3">
              <div>
                <h3 className="text-md font-semibold">🗣️ Transcript</h3>
                <p className="text-gray-800 ml-2">{spokenText}</p>
              </div>

              <div className="flex items-center space-x-6">
                <div>
                  <h3 className="text-md font-semibold">
                    🔊 Pronunciation Score
                  </h3>
                  <p>
                    <strong>Pronunciation Score:</strong>{" "}
                    {Math.round(pronunciationScore * 100)}%
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-semibold">🧠 Content Score</h3>
                  <p className="text-green-700 ml-2">{contentScore}/10</p>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold">💬 Feedback</h3>
                <p className="text-gray-700 whitespace-pre-line ml-2">
                  {feedback}
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <p className="text-red-600">
              ❌ Something went wrong. Please try again.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionDetail
