import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"
import QuestionDetail from "./QuestionDetail"
import QuestionList from "./QuestionList"
import CompletedQuestionsList from "./CompletedQuestionsList"

function Dashboard() {
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [completedQuestions, setCompletedQuestions] = useState(new Set())
  const [completedQuestionObjects, setCompletedQuestionObjects] = useState([])
  const [savedQuestions, setSavedQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("search")
  const [page, setPage] = useState(1)
  const limit = 30
  const [hasMore, setHasMore] = useState(true)

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
        const query = new URLSearchParams()
        query.append("page", page)
        query.append("limit", limit)

        const res = await fetch(
          `https://astute-abroad.onrender.com/questions?${query.toString()}`
        )
        if (!res.ok) throw new Error("Failed to fetch questions")
        const data = await res.json()
        setQuestions(data)
        setHasMore(data.length === limit)
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
          `https://astute-abroad.onrender.com/faveQuestions/${user.uid}`
        )
        if (!res.ok) {
          if (res.status === 404) {
            setSavedQuestions([])
          } else {
            throw new Error("Failed to fetch saved questions")
          }
        } else {
          const data = await res.json()
          const normalized = data.map((q) => ({
            id: q.question_id,
            question_text: q.question_text,
          }))
          setSavedQuestions(normalized)
        }
      } catch (err) {
        console.error("Error fetching saved questions:", err)
      }
    }

    const fetchCompletedQuestions = async () => {
      try {
        const res = await fetch(
          `https://astute-abroad.onrender.com/completedQuestions/${user.uid}`
        )
        if (!res.ok) {
          if (res.status === 404) {
            setCompletedQuestions(new Set())
            setCompletedQuestionObjects([])
          } else {
            throw new Error("Failed to fetch completed questions")
          }
        } else {
          const data = await res.json()
          setCompletedQuestions(new Set(data.map((q) => q.question_id)))
          setCompletedQuestionObjects(data)
        }
      } catch (err) {
        console.error("Error fetching completed questions")
        setError("Error fetching completed questions")
      }
    }

    fetchQuestions()
    fetchSavedQuestions()
    fetchCompletedQuestions()
  }, [user])

  const markQuestionComplete = (index) => {
    setCompletedQuestions((prev) => new Set(prev).add(index))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, questions.length))
  }

  const allComplete = completedQuestions.size === questions.length
  console.log("how many questions completed: ", completedQuestions.size)
  console.log("how many total questions: ", questions.length)
  console.log("are all questions completed? ", allComplete)

  const question = questions[currentIndex]

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-black">My Practice Dashboard</h2>

      <div
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax={questions.length}
        aria-valuenow={completedQuestions.size}
        aria-label="Practice completion progress"
      >
        <h3 className="text-gray-600 ">Progress Bar</h3>
        <div className="w-full bg-white border border-black rounded-full h-10 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{
              width:
                questions.length > 0
                  ? `${(completedQuestions.size / questions.length) * 100}%`
                  : "0%",
            }}
          >
            <p className="p-2 ml-4">
              {(completedQuestions.size / questions.length) * 100}% completed!
            </p>
          </div>
        </div>
      </div>

      {!user ? (
        <p className="text-red-600" role="alert">
          Please log in to view your dashboard.
        </p>
      ) : loading ? (
        <p className="text-blue-600" role="status">
          Loading...
        </p>
      ) : error ? (
        <p className="text-red-600" role="alert">
          Error: {error}
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-6">
            {allComplete ? (
              <div
                className="text-green-600 font-semibold text-lg"
                role="status"
                aria-live="polite"
              >
                🎉 Great job! You've completed all {questions.length} questions.
              </div>
            ) : !question ? (
              <p>No questions found.</p>
            ) : (
              <>
                <p className="text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <>
                  <strong>How it works:</strong>
                  <br />
                  🖱️ Click a question to open it
                  <br />
                  🎙️ Click <strong>Start Microphone</strong> when you're ready
                  <br />
                  🗣️ Speak your answer clearly
                  <br />
                  📝 Wait for your transcript to appear
                  <br />
                  🟥 Click the red <strong>Stop</strong> button when finished
                  <br />
                  🤖 Read your AI feedback
                  <br />
                  ⏭️ The next question will load automatically
                  <br />
                  📋 Review past feedback anytime in the panel on the right
                </>

                <QuestionDetail
                  question={question}
                  user={user}
                  onComplete={() => {
                    markQuestionComplete(currentIndex)
                    setTimeout(() => {
                      handleNext()
                    }, 10000)
                  }}
                />
              </>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-1/2 p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-center gap-4 mb-4" role="tablist">
              <button
                onClick={() => setActiveTab("search")}
                aria-label="Show all questions"
                role="tab"
                aria-selected={activeTab === "search"}
                className={`px-4 py-2 rounded ${
                  activeTab === "search"
                    ? "bg-sky-400 text-white"
                    : "bg-white border"
                }`}
              >
                Search All
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                aria-label="Show completed questions"
                role="tab"
                aria-selected={activeTab === "completed"}
                className={`px-4 py-2 rounded ${
                  activeTab === "completed"
                    ? "bg-sky-500 text-white"
                    : "bg-white border"
                }`}
              >
                View Completed
              </button>
            </div>

            <div role="tabpanel" aria-live="polite">
              {activeTab === "completed" ? (
                completedQuestionObjects.length === 0 ? (
                  <p>You haven't completed any questions yet.</p>
                ) : (
                  <CompletedQuestionsList userId={user.uid} />
                )
              ) : questions.length === 0 ? (
                <p>No questions found.</p>
              ) : (
                <QuestionList
                  userId={user.uid}
                  savedQuestions={savedQuestions}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
