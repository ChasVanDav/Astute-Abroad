import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import questionsRoute from "./routes/questions.js"
import authRoute from "./routes/authRoutes.js"
import faveQuestionsRoute from "./routes/faveQuestions.js"
import completedQuestionsRoute from "./routes/completedQuestions.js"
import scrapeRouter from "./scraper/scrape.js"
import practiceAttemptsRoute from "./routes/practiceAttempts.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from the Astute Abroad's backend!")
})

app.use("/scrape", scrapeRouter)
app.use("/api", authRoute)
app.use("/questions", questionsRoute)
app.use("/favequestions", faveQuestionsRoute)
app.use("/completedQuestions", completedQuestionsRoute)
app.use("/practice_attempts", practiceAttemptsRoute)

export default app
