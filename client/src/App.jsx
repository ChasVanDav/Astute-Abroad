// react libraries
import React, { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
// import logo
import astuteAbroadLogo from "/favicon.png"
// firebase imports
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "./firebase"
// import components
import About from "./pages/About.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import WatchDemo from "./pages/WatchDemo.jsx"

// Homepage component
function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-white border border-black rounded-2xl p-6 shadow-md text-center space-y-4">
      <h2 className="text-2xl font-bold text-black">
        Start Speaking Korean with Confidence
      </h2>
      <p className="text-gray-700">
        Do you feel nervous speaking in front of others? Do you wish to gain
        confidence to travel overseas & meet new friends? Start speaking a
        foreign language more fluently and improve your pronunciation! Register
        with Astute Abroad today and start practicing your speaking skills with
        real-time feedback powered by AI!
      </p>
      <button
        onClick={() => navigate("/login")}
        className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transition shadow-md"
      >
        Get Started
      </button>
      <section className="bg-white border border-black rounded-2xl p-6 shadow-md text-center space-y-8 mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          Why Choose Astute Abroad?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-6">
          {/* Card 1 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-5xl">🦊🎩</div>
            <h3 className="text-xl font-semibold text-black">Learn Smartly</h3>
            <p className="text-gray-600 text-sm">
              Practice smarter, not harder. Our wise fox helps you master
              conversations efficiently.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-5xl">🛫🇰🇷</div>
            <h3 className="text-xl font-semibold text-black">
              Travel Confidently
            </h3>
            <p className="text-gray-600 text-sm">
              Speak Korean naturally when you travel abroad — order food, meet
              locals, and explore freely!
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-5xl">🧠⚡</div>
            <h3 className="text-xl font-semibold text-black">
              AI-Powered Feedback
            </h3>
            <p className="text-gray-600 text-sm">
              Improve faster with real-time pronunciation tips and instant
              conversation coaching.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // check user auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)

      navigate("/")

      console.log("User signed out successfully ✌🏽")
    } catch (error) {
      console.error("Logout error: ", error.message)
    }
  }

  return (
    <div className="bg-sky-200 min-h-screen pt-10 flex flex-col items-center">
      <div className="bg-sky-300 w-[90%] border border-black rounded-xl flex flex-col shadow-lg">
        {/* HEADER */}
        <header className="flex items-center justify-between p-4 border-b border-black">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-3xl sm:text-4xl font-bold text-black">
                Astute Abroad
              </h1>
              <span className="text-base font-normal text-gray-600">
                /əˈsto͞ot əˈbrôd/
              </span>
            </div>
            <p className="mt-4 sm:mt-0 text-sm sm:text-base text-gray-700 italic">
              Speak fluently, travel fluidly
            </p>
          </div>
        </header>

        {/* BODY  */}
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watch-demo" element={<WatchDemo />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          {/* NAVIGATION SIDE BAR */}
          <aside className="w-1/4 border-l border-black p-4 flex flex-col gap-4 items-stretch bg-sky-300">
            {/* click logo to return to homepage */}
            <Link to="/" className="flex justify-center">
              <img
                src={astuteAbroadLogo}
                className="w-20 h-24 justify-center"
                alt="Astute Abroad logo - wise fox with top hat and monacle"
              />
            </Link>

            {/* buttons to page routes */}
            <button
              onClick={() => navigate("/about")}
              className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
            >
              About
            </button>
            <button
              onClick={() => navigate("/watch-demo")}
              className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
            >
              Watch Demo
            </button>

            {/* conditional rendering of login/logout */}
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
              >
                Log in / Register
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default App
