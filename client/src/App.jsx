import React, { useState } from "react"
import astuteAbroadLogo from "/favicon.png"
import axios from "axios"

function App() {
  const [count, setCount] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [response, setResponse] = useState("")

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:5000/api/chat", {
      messages: [{ role: "user", content: userInput }],
    })
    setResponse(res.data.choices[0].message.content)
  }

  return (
    <div className="bg-sky-200 min-h-screen flex items-center justify-center">
      <div className="bg-sky-300 w-[90%] border border-black rounded-xl flex flex-col shadow-lg">
        {/* header */}
        <header className="flex items-center justify-between p-4 border-b border-black">
          <h1 className="bg-white text-3xl font-light text-black py-3 p-4 rounded-2xl border border-black">
            Welcome to Astute Abroad!
          </h1>
          <a href="https://github.com/ChasVanDav/AstuteAbroad" target="_blank">
            <img
              src={astuteAbroadLogo}
              className="w-20 h-24 mr-4"
              alt="Astute Abroad logo - wise fox with top hat and monacle"
            />
          </a>
        </header>

        {/* body */}
        <div className="flex flex-1">
          {/* main content */}
          <main className="flex-1 p-6">
            <h2 className="text-2xl font-light text-black mb-4">Welcome!</h2>
            <p className="text-black mb-4">main content area</p>
          </main>

          {/* navigation bar - right side */}
          <aside className="w-1/3 border-l border-black p-4 flex flex-col gap-4 items-stretch bg-sky-300">
            <button className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200	 transition">
              About
            </button>
            <button className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition">
              Watch Demo
            </button>
            <button className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition">
              Register
            </button>
            <button className="bg-white text-black font-semihold py-3 rounded-2xl border border-black hover:bg-orange-200 transition">
              Log in
            </button>
          </aside>

          {/* <div className="bg-sky-400 text-black p-4 rounded">
            <button onClick={() => setCount(count + 1)}>
              count is {count}
            </button>
          </div>
          <div class="bg-sky-300 text-white p-4 rounded">
            Testing Tailwind: This is a sky blue background with white text.
          </div>

          <div className="bg-gray-200 text-blue p-3 rounded">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Ask ChatGPT</button>
            <p>{response}</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default App
