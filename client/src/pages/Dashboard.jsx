import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import QuestionDetail from "./QuestionDetail"
import QuestionList from "./QuestionList"

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
      {/* Title */}
      <h2 className="text-2xl font-bold text-black">My Practice Dashboard</h2>

      {/* Progress Bar */}
      <div className="w-full bg-white border border-black rounded-full h-4 overflow-hidden">
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

      {!user ? (
        <p className="text-red-600">Please log in to view your dashboard.</p>
      ) : loading ? (
        <p className="text-blue-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Side Panel - Question List */}
          <div className="w-full lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-center text-black">
              Search Questions
            </h3>
            <QuestionList
              questions={questions}
              savedQuestions={savedQuestions}
            />
          </div>
          {/* Main Practice Area */}
          <div className="flex-1 space-y-6">
            {allComplete ? (
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
                  onComplete={() => {
                    markQuestionComplete(currentIndex)
                    setTimeout(() => {
                      handleNext()
                    }, 7000)
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
