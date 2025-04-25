import React, { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import astuteAbroadLogo from "/favicon.png"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "./firebase"

// import components
import About from "./pages/About"
import Login from "./pages/Login"
import Questions from "./pages/Questions"
// import WatchDemo from "./pages/WatchDemo"
// import Dashboard from "./pages/Dashboard"

// Homepage component
function Home() {
  return (
    <div className="flex flex-col space-y-10 px-8 items-stretch">
      <p className="bg-sky-100 text-black rounded-2xl border border-black p-4">
        Do you feel nervous speaking in front of others?
      </p>
      <p className="bg-sky-200 text-black rounded-2xl border border-black p-4">
        Do you wish to gain confidence to travel overseas & meet new friends?
      </p>
      <p className="bg-sky-300 text-black rounded-2xl border border-black p-4">
        Start speaking a foreign language more fluently and improve your
        pronunciation!
      </p>
      <p className="bg-sky-400 text-black rounded-2xl border border-black p-4">
        Register with Astute Abroad today and start practicing your speaking
        skills with real-time feedback powered by AI!
      </p>
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
      console.log("User signed out successfully ✌🏽")
    } catch (error) {
      console.error("Logout error: ", error.message)
    }
  }

  return (
    <div className="bg-sky-200 min-h-screen flex items-center justify-center">
      <div className="bg-sky-300 w-[90%] border border-black rounded-xl flex flex-col shadow-lg">
        {/* HEADER */}
        <header className="flex items-center justify-between p-4 border-b border-black">
          <div className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm sm:text-base text-gray-600 italic">
              speak fluently, travel fluidly
            </p>
            <h1 className="text-xl sm:text-2xl font-semibold text-black mt-2 sm:mt-0 text-center sm:text-right">
              Astute Abroad{" "}
              <span className="text-sm font-normal text-gray-600">
                /əˈsto͞ot əˈbrôd/
              </span>
            </h1>
          </div>
        </header>

        {/* BODY  */}
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/watch-demo" element={<WatchDemo />} /> */}
              <Route path="/questions" element={<Questions />} />
              {/* <Route path="/record" element={<LiveTranscription />} /> */}
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
              className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200	 transition"
            >
              About Astute Abroad
            </button>
            <button
              onClick={() => navigate("/watch-demo")}
              className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition"
            >
              Watch Demo
            </button>
            <button
              onClick={() => navigate("/questions")}
              className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition"
            >
              Practice Questions
            </button>

            {/* conditional rendering of login/logout */}
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition"
                >
                  Logout
                </button>
                <button onClick={() => navigate("/")}>Dashboard</button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition"
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
