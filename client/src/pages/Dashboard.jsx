import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import QuestionDetail from "./QuestionDetail"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [completedQuestions, setCompletedQuestions] = useState(new Set())
  const [savedQuestions, setSavedQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return

    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:5000/questions")
        if (!res.ok) throw new Error("Failed to fetch questions")
        const data = await res.json()
        setQuestions(data)
        setCurrentIndex(0)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchSavedQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/faveQuestions/${user.uid}`
        )
        if (!res.ok) throw new Error("Failed to fetch saved questions")
        const data = await res.json()

        const normalized = data.map((q) => ({
          id: q.question_id,
          question_text: q.question_text,
        }))
        setSavedQuestions(normalized)
      } catch (err) {
        console.error("Error fetching saved questions:", err)
      }
    }

    fetchQuestions()
    fetchSavedQuestions()
  }, [user])

  const markQuestionComplete = (index) => {
    setCompletedQuestions((prev) => new Set(prev).add(index))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, questions.length - 1)
    )
  }

  const question = questions[currentIndex]

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-black">Your Practice Dashboard</h2>

      {!user ? (
        <p className="text-red-600">Please log in to view your dashboard.</p>
      ) : loading ? (
        <p className="text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : !question ? (
        <p>No questions found.</p>
      ) : (
        <>
          <p className="text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </p>

          <QuestionDetail
            question={question}
            user={user}
            onComplete={() => markQuestionComplete(currentIndex)}
          />

          <button
            onClick={handleNext}
            disabled={
              currentIndex >= questions.length - 1 ||
              !completedQuestions.has(currentIndex)
            }
            className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500 disabled:bg-gray-300"
          >
            Next ▶
          </button>
        </>
      )}

      {savedQuestions.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-black mb-4">
            ⭐ Saved Questions
          </h3>
          <div className="space-y-4">
            {savedQuestions.map((q) => (
              <QuestionDetail key={q.id} question={q} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
