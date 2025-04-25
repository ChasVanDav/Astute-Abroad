import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

  const resetFeedback = () => {
    setStatus("idle")
    setFeedback("")
    setPronunciationScore(null)
    setContentScore(null)
    setSpokenText("")
  }

  return (
    <div className="mb-6 border border-gray-300 rounded-md bg-white p-4 shadow-sm">
      <button
        onClick={toggleExpand}
        className="w-full text-left text-lg font-semibold hover:bg-yellow-100 rounded-md p-2 transition-all duration-150"
      >
        {question.question_text}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {/* <div className="mt-4 space-y-4"> */}
            <LiveTranscription
              onTranscriptUpdate={handleTranscriptUpdate}
              onStatusChange={setStatus}
            />

            {/* Status and Feedback */}
            {status === "listening" && (
              <p className="text-blue-500">
                🎤 Listening... Start speaking when ready!
              </p>
            )}

            {status === "processing" && (
              <p className="text-sm text-gray-600">
                ⏳ Analyzing your response...
              </p>
            )}

            {status === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-300 rounded-md p-4 space-y-3"
              >
                <div>
                  <h3 className="text-md font-semibold">🗣️ Transcript</h3>
                  <p className="text-gray-800 ml-2">{spokenText}</p>
                </div>
                {/* pronunciation score displayed */}
                <div className="flex items-center space-x-6">
                  {typeof pronunciationScore === "number" && (
                    <div>
                      <h3 className="text-md font-semibold">
                        🔊 Pronunciation Score
                      </h3>
                      <p>
                        <strong>Pronunciation Score:</strong>{" "}
                        {Math.round(pronunciationScore * 100)}%
                      </p>
                    </div>
                  )}
                  {/* content score displayed */}
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
              </motion.div>
            )}

            {status === "error" && (
              <div className="text-red-600">
                ❌ Something went wrong. Please try again.
                <div>
                  <button
                    onClick={resetFeedback}
                    className="mt-2 underline text-blue-600 hover:text-blue-800"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuestionDetail
