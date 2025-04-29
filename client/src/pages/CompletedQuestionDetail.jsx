import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function CompletedQuestionDetail({ question }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mb-4 border border-gray-300 rounded-md bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-left text-lg font-semibold hover:bg-yellow-100 rounded-md p-2 transition-all duration-150 flex-1"
        >
          {question.question_text}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            <div>
              <h3 className="text-md font-semibold">🗣️ Transcript</h3>
              <p className="text-gray-800 ml-2">
                {question.spoken_text || "No transcript available"}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              {typeof question.pronunciation_score === "number" && (
                <div>
                  <h3 className="text-md font-semibold">
                    🔊 Pronunciation Score
                  </h3>
                  <p>{Math.round(question.pronunciation_score * 10)}%</p>
                </div>
              )}
              <div>
                <h3 className="text-md font-semibold">🧠 Content Score</h3>
                <p className="text-green-700 ml-2">
                  {question.content_score || "N/A"}/10
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold">💬 Feedback</h3>
              <p className="text-gray-700 whitespace-pre-line ml-2">
                {question.ai_feedback || "No feedback available."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CompletedQuestionDetail
