import express from "express"
import cors from "cors"
import dotenv from "dotenv"
// import axios from "axios"
// import pool from "./db.js"
import scrapeRoute from "./routes/scrape.js"
import logger from "./logger.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

app.use(cors())
app.use("/scrape", scrapeRoute)

app.listen(5000, () => {
  logger.info("Server running on http://localhost:5000")
})

// app.get("/users", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM users")
//     res.json(result.rows)
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).send("Server error")
//   }
// })

// app.post("/api/chat", async (req, res) => {
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o",
//         messages: req.body.messages,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     )

//     res.json(response.data)
//   } catch (error) {
//     console.error(error.response?.data || error.message)
//     res.status(500).json({ error: "Something went wrong" })
//   }
// })
