import React, { useState, useEffect, useRef } from "react"
import { Routes, Route, useNavigate, Link } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "./firebase"
import astuteAbroadLogo from "/favicon.png"

import About from "./pages/About.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"

function Home() {
  const navigate = useNavigate()

  return (
    <main className="bg-white rounded-2xl p-4 sm:p-6 shadow-md max-w-screen-lg w-full mx-auto">
      <header className="text-center mt-8 mb-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
          Now Boarding: Your Journey to Fluency!
        </h2>
        <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600 mt-2">
          powered by ChatGPT
        </p>
      </header>

      <section className="bg-white rounded-2xl p-4 sm:p-6 mt-10 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="/airplanegif2.gif"
              alt="Airplane flying through the clouds"
              className="w-full max-w-xs md:max-w-sm object-contain rounded-xl"
            />
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-gray-700 text-base sm:text-lg text-center md:text-left leading-relaxed">
              Do you feel nervous speaking in front of others? Do you wish to
              gain confidence to travel overseas & meet new friends? Start
              speaking Korean more fluently and improve your pronunciation!
              Register with Astute Abroad today and start practicing your
              speaking skills with real-time feedback powered by AI!
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-md text-center space-y-8 mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center sm:text-left space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-black">
              A First Class Ticket to Success
            </h2>
            <p className="text-gray-600 text-base">
              Your journey to fluency starts here. Real practice, real feedback,
              real growth.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/boarding_pass.jpeg"
              alt="Blank boarding pass"
              className="rounded-xl shadow-md w-full max-w-sm object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          <article className="flex flex-col items-center text-center space-y-3 p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-black">
              Learn & Speak Fluently
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Practice smarter, not harder. Learn real-world Korean for everyday
              situations — travel, food, friends, and more.
            </p>
          </article>

          <article className="flex flex-col items-center text-center space-y-3 p-4">
            <h3 className="text-lg sm:text-xl font-semibold text-black">
              Instant AI Feedback
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Real-time pronunciation tips tailored to YOU. Boost your fluency
              faster with personalized insights powered by AI.
            </p>
          </article>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-400 hover:bg-orange-400 text-white font-semibold py-2 px-8 rounded-full transition shadow-md mt-8"
          aria-label="Get Started - navigate to login"
        >
          Get Started
        </button>
      </section>
    </main>
  )
}

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate("/")
    } catch (error) {
      console.error("Logout error: ", error.message)
    }
  }

  const closeMenuAndNavigate = (path) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  return (
    <div className="bg-sky-200 min-h-screen pt-10 flex flex-col items-center">
      <div className="bg-sky-300 w-full border border-black rounded-xl flex flex-col shadow-lg">
        <header className="flex items-center justify-between p-4 border-b border-black">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Astute Abroad
              </h1>
              <span className="text-sm sm:text-base font-normal text-gray-600">
                /əˈsto͞ot əˈbrôd/
              </span>
            </div>
            <blockquote className="mt-4 sm:mt-0 text-sm sm:text-base text-gray-700 italic">
              Speak fluently, travel fluidly
            </blockquote>
          </div>

          <button
            className="block md:hidden"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        <div className="flex flex-1">
          <main className="flex-1 p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>

          {/* Desktop Sidebar */}
          <aside className="hidden md:flex md:w-1/4 border-l border-black p-4 flex-col gap-4 items-stretch bg-sky-300">
            <Link
              to="/"
              className="flex justify-center"
              aria-label="Go to Home"
            >
              <img
                src={astuteAbroadLogo}
                className="w-20 h-24"
                alt="Astute Abroad logo"
              />
            </Link>

            <button
              onClick={() => navigate("/about")}
              className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
              aria-label="Navigate to About page"
            >
              About
            </button>

            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
                  aria-label="Navigate to Dashboard"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black font-semibold py-3 rounded-2xl border border-black hover:bg-orange-300 transition shadow-sm"
                aria-label="Navigate to Login or Register"
              >
                Log in / Register
              </button>
            )}
          </aside>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex justify-end">
              <div
                ref={menuRef}
                className="w-2/3 max-w-xs h-full bg-white shadow-md flex flex-col items-center p-4 gap-4"
              >
                <button
                  onClick={() => closeMenuAndNavigate("/")}
                  className="text-black py-3"
                  aria-label="Go to Home"
                >
                  Home
                </button>
                <button
                  onClick={() => closeMenuAndNavigate("/about")}
                  className="text-black py-3"
                  aria-label="Navigate to About"
                >
                  About
                </button>

                {user ? (
                  <>
                    <button
                      onClick={() => closeMenuAndNavigate("/dashboard")}
                      className="text-black py-3"
                      aria-label="Dashboard"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="text-black py-3"
                      aria-label="Logout"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => closeMenuAndNavigate("/login")}
                    className="text-black py-3"
                    aria-label="Login or Register"
                  >
                    Log in / Register
                  </button>
                )}
              </div>
            </div>
          )}
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
