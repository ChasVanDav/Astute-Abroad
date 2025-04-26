import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import QuestionDetail from "./QuestionDetail"

function Questions() {
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const limit = 10

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return // don't fetch questions if no user

    const fetchQuestions = async () => {
      setLoading(true)
      console.log("Fetching questions...")

      try {
        const query = new URLSearchParams()
        if (category) query.append("category", category)
        if (difficulty) query.append("difficulty", difficulty)
        query.append("page", page)
        query.append("limit", limit)

        const res = await fetch(
          `http://localhost:5000/questions?${query.toString()}`
        )
        if (!res.ok) throw new Error("Failed to fetch questions")
        const data = await res.json()
        console.log("Fetched data:", data)

        setQuestions(data)
        setHasMore(data.length === limit)
        setError(null)
      } catch (err) {
        console.error("Error fetching questions:", err.message)
        setError(err.message)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [category, difficulty, page, user])

  const handleFilter = (e) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Practice Questions
      </h1>

      {/* filter form */}
      <form
        onSubmit={handleFilter}
        className="mb-6 p-4 bg-sky-400 rounded-lg shadow-md border border-black"
      >
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
            {/* <option value=""></option> */}
          </select>
        </label>{" "}
        <br></br>
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
        </label>{" "}
        <br />
        {/* <button type="submit">Apply</button> */}
      </form>

      {/* Loading/Error/List */}
      {!user ? (
        <p className="text-center text-red-500">
          Please log in to view questions.
        </p>
      ) : loading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-gray-500"> No questions found.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionDetail key={q.id} question={q} user={user} />
          ))}
        </div>
      )}

      {/* pagination */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1 || loading}
          className="py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 disabled:bg-gray-300"
        >
          ◀ Prev
        </button>
        <span className="text-lg font-medium">Page {page}</span>
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={!hasMore || loading}
          className="py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 disabled:bg-gray-300"
        >
          Next ▶
        </button>
      </div>
    </div>
  )
}

export default Questions
