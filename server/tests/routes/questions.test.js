import request from "supertest"
import express from "express"
import questionsRouter from "../../routes/questions.js"

// Mock the db and logger
jest.mock("../../db.js", () => ({
  query: jest.fn(),
}))
jest.mock("../../logger.js", () => ({
  error: jest.fn(),
}))

import db from "../../db.js"
import logger from "../../logger.js"

const app = express()
app.use("/questions", questionsRouter)

describe("GET /questions", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return all questions without filters", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, question: "What is AI?" }],
    })

    const res = await request(app).get("/questions")

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual([{ id: 1, question: "What is AI?" }])
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM questions ", [])
  })

  it("should filter by category and difficulty", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 2, question: "What is ML?", category: "AI" }],
    })

    const res = await request(app).get("/questions?category=AI&difficulty=hard")

    expect(res.statusCode).toBe(200)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM questions WHERE category = $1 AND difficulty = $2",
      ["AI", "hard"]
    )
  })

  it("should apply pagination with page and limit", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 3, question: "What is JS?" }],
    })

    const res = await request(app).get("/questions?page=2&limit=5")

    expect(res.statusCode).toBe(200)
    expect(db.query).toHaveBeenCalledWith(
      "SELECT * FROM questions  LIMIT $1 OFFSET $2",
      ["5", 5]
    ) // offset = (2 - 1) * 5 = 5
  })

  it("should handle database errors", async () => {
    db.query.mockRejectedValueOnce(new Error("DB failure"))

    const res = await request(app).get("/questions")

    expect(res.statusCode).toBe(500)
    expect(res.body).toHaveProperty("error", "Failed to fetch questions")
    expect(logger.error).toHaveBeenCalledWith("[GET /questions] DB failure")
  })
})
