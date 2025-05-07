import { useEffect, useState } from "react"
import CompletedQuestionDetail from "./CompletedQuestionDetail"

function CompletedQuestionsList({ userId }) {
  const [completedQuestions, setCompletedQuestions] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const limit = 5

  useEffect(() => {
    if (!userId) return

    const fetchCompleted = async () => {
      setLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams()
        query.append("page", page)
        query.append("limit", limit)

        const res = await fetch(
          `http://astute-abroad.onrender.com/completedQuestions/${userId}?${query.toString()}`
        )

        if (!res.ok) throw new Error("Failed to fetch completed questions")

        const data = await res.json()
        setCompletedQuestions(data)
        setHasMore(data.length === limit)
      } catch (err) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchCompleted()
  }, [userId, page])

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (hasMore) setPage((prev) => prev + 1)
  }

  if (loading) {
    return (
      <p className="text-center text-blue-500">
        Loading completed questions...
      </p>
    )
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>
  }

  if (!completedQuestions.length) {
    return (
      <p className="text-center text-gray-500">
        You have not completed any questions yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <button onClick={handlePrev} disabled={page === 1}>
          ◀ Prev
        </button>
        <span>Page {page}</span>
        <button onClick={handleNext} disabled={!hasMore}>
          Next ▶
        </button>
      </div>

      {completedQuestions.map((q) => (
        <CompletedQuestionDetail key={q.id} question={q} />
      ))}
    </div>
  )
}

export default CompletedQuestionsList
