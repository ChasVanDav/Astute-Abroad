import { useState } from "react"

function QuestionList({ questions, savedQuestions }) {
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const savedIds = new Set(savedQuestions.map((q) => q.id))

  const filteredQuestions = questions.filter((q) => {
    return (
      (category ? q.category === category : true) &&
      (difficulty ? q.difficulty === difficulty : true) &&
      (showFavoritesOnly ? savedIds.has(q.id) : true)
    )
  })

  return (
    <div className="space-y-4">
      {/* Filter form - Always visible */}
      <form className="mb-6 p-4 bg-sky-400 rounded-lg shadow-md border border-black space-y-4">
        <label className="block text-medium font-light text-black">
          Category:{" "}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 p-2 w-full border bg-white border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">View All</option>
            <option value="greeting">Greeting</option>
            <option value="introduction">Introduction</option>
            <option value="travel">Travel</option>
            <option value="weather">Weather</option>
            <option value="shopping">Shopping</option>
            <option value="datetime">Date/Time</option>
          </select>
        </label>

        <label className="block text-medium font-light text-black">
          Difficulty:{" "}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-2 p-2 w-full bg-white border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">View All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

        {/* Favorite Filter Button */}
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`text-2xl ${
              showFavoritesOnly ? "text-yellow-400" : "text-white"
            } hover:text-yellow-300`}
          >
            ★
          </button>
          <span className="text-black">Show Favorites Only</span>
        </div>
      </form>

      {/* Question List */}
      {filteredQuestions.length === 0 ? (
        <p className="text-center text-gray-500">No questions available.</p>
      ) : (
        filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="p-4 bg-white border border-black rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-black flex items-center gap-2">
                {savedIds.has(q.id) && (
                  <span className="text-yellow-400">★</span>
                )}
                {q.question_text}
              </h3>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {q.category}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    q.difficulty === "beginner"
                      ? "bg-green-100 text-green-700"
                      : q.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {q.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default QuestionList
