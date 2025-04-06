import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})
