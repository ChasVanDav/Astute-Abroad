import { useEffect, useState } from "react"

function QuestionList({ userId, savedQuestions }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const limit = 5

  const savedIds = new Set(savedQuestions.map((q) => q.id))

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const query = new URLSearchParams()
        query.append("page", page)
        query.append("limit", limit)
        if (category) query.append("category", category)
        if (difficulty) query.append("difficulty", difficulty)

        const res = await fetch(
          `http://localhost:5000/questions?${query.toString()}`
        )
        if (!res.ok) throw new Error("Failed to fetch questions")
        const data = await res.json()

        setQuestions(data)
        setHasMore(data.length === limit)
      } catch (err) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [page, category, difficulty])

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (hasMore) setPage((prev) => prev + 1)
  }

  const filtered = showFavoritesOnly
    ? questions.filter((q) => savedIds.has(q.id))
    : questions

  return (
    <div className="space-y-4">
      {/* Filter UI */}
      <form className="mb-6 p-4 bg-orange-300 rounded-lg shadow-md border border-black space-y-4">
        <label className="block text-medium font-light text-black">
          Category:{" "}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value)
              setPage(1)
            }}
            className="mt-2 p-2 w-full border bg-white border-black rounded-md"
          >
            <option value="">View All</option>
            <option value="greeting">Greeting</option>
            <option value="introduction">Introduction</option>
            <option value="calendar">Calendar</option>
            <option value="weather">Weather</option>
            <option value="shopping">Shopping</option>
            <option value="directions">Directions</option>
          </select>
        </label>

        <label className="block text-medium font-light text-black">
          Difficulty:{" "}
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value)
              setPage(1)
            }}
            className="mt-2 p-2 w-full bg-white border border-black rounded-md"
          >
            <option value="">View All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>

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

      {/* Pagination Controls */}
      <div className="flex justify-between mb-4 text-med text-gray-600">
        <button onClick={handlePrev} disabled={page === 1}>
          ◀ Prev
        </button>
        <span>Page {page}</span>
        <button onClick={handleNext} disabled={!hasMore}>
          Next ▶
        </button>
      </div>

      {/* Error/Loading/Results */}
      {loading ? (
        <p className="text-center text-blue-500">Loading questions...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No questions available.</p>
      ) : (
        filtered.map((q) => (
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
