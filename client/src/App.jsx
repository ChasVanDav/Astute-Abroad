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
    <div class="bg-sky-200 text-black p-4 rounded">
      <h1>Welcome to Astute Abroad</h1>
      <a href="https://github.com/ChasVanDav/AstuteAbroad" target="_blank">
        <img src={astuteAbroadLogo} className="logo" alt="Astute Abroad logo" />
      </a>
      <div className="bg-sky-400 text-black p-4 rounded">
        <button onClick={() => setCount(count + 1)}>count is {count}</button>
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
      </div>
    </div>
  )
}

export default App
