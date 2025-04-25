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
  const [showSavedModal, setShowSavedModal] = useState(false)

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

  const allComplete = completedQuestions.size === questions.length
  const question = questions[currentIndex]

  return (
    <div className="space-y-10">
      {/* title */}
      <h2 className="text-2xl font-bold text-black">Your Practice Dashboard</h2>
      {/* progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{
            width:
              questions.length > 0
                ? `${(completedQuestions.size / questions.length) * 100}%`
                : "0%",
          }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {" "}
        ✅ You’ve completed {completedQuestions.size} of {questions.length}{" "}
        questions
      </p>

      {!user ? (
        <p className="text-red-600">Please log in to view your dashboard.</p>
      ) : loading ? (
        <p className="text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : allComplete ? (
        <div className="text-green-600 font-semibold text-lg">
          🎉 Great job! You've completed all {questions.length} questions.
        </div>
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
          <div className="flex gap-4 mt-4">
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

            {savedQuestions.length > 0 && (
              <button
                onClick={() => setShowSavedModal(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                ⭐ View Saved Questions
              </button>
            )}
          </div>
        </>
      )}

      {/* Modal for Favorite Questions */}
      {showSavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">⭐ Saved Questions</h3>
              <button
                onClick={() => setShowSavedModal(false)}
                className="text-red-500 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {savedQuestions.map((q) => (
              <div key={q.id} className="mb-4 border-t pt-4">
                <QuestionDetail question={q} user={user} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
