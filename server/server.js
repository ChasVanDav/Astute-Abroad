import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

app.post("/api/chat", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: req.body.messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    res.json(response.data)
  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ error: "Something went wrong" })
  }
})

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})
