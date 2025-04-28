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
    <div className="bg-white rounded-2xl p-6 shadow-md text-center space-y-4">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-black text-center leading-tight mt-8 mb-4">
        Now Boarding: Your Journey to Fluency!
        <br />
        <span className="text-xl font-medium text-gray-600">
          powered by ChatGPT
        </span>
      </h2>

      <section className="bg-white rounded-2xl p-2 shadow-md text-center space-y-8 mt-10">
        {/* Flex container for image and paragraph */}
        <div className="flex flex-col sm:flex-row items-center p-2 space-y-6 sm:space-y-0 sm:space-x-8">
          {/* Gif */}
          <img
            src="/airplanegif2.gif"
            alt="airplane flying through the clouds"
            className="w-70 h-auto rounded-xl max-w-xl sm:max-w-sm object-cover"
          />

          {/* Paragraph */}
          <p className="text-gray-700 max-w-xs text-med text-center sm:text-left">
            Do you feel nervous speaking in front of others? Do you wish to gain
            confidence to travel overseas & meet new friends? Start speaking
            Korean more fluently and improve your pronunciation! Register with
            Astute Abroad today and start practicing your speaking skills with
            real-time feedback powered by AI!
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-md text-center space-y-8 mt-10">
        {/* FLEX layout for Image + Header side-by-side */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Left side - Heading */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold text-black">
              A First Class Ticket to Success
            </h2>
            <p className="text-gray-600 text-lg">
              Your journey to fluency starts here. Real practice, real feedback,
              real growth.
            </p>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="/boarding_pass.jpeg"
              alt="image of a blank boarding pass"
              className="rounded-xl shadow-md w-full max-w-sm object-cover"
            />
          </div>
        </div>

        {/* GRID layout for 2 cards instead of 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <h3 className="text-xl font-semibold text-black">
              Learn & Speak Fluently
            </h3>
            <p className="text-gray-600 text-base">
              Practice smarter, not harder. Learn real-world Korean for everyday
              situations — travel, food, friends, and more.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center space-y-3 p-4">
            <h3 className="text-xl font-semibold text-black">
              Instant AI Feedback
            </h3>
            <p className="text-gray-600 text-base">
              Real-time pronunciation tips tailored to YOU. Boost your fluency
              faster with personalized insights powered by AI.
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-400 hover:bg-orange-400 text-white font-semibold py-2 px-8 rounded-full transition shadow-md mt-8"
        >
          Get Started
        </button>
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
        <footer className="mt-10 text-center py-6 text-gray-700 text-sm">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p>
              © {new Date().getFullYear()} Astute Abroad. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
