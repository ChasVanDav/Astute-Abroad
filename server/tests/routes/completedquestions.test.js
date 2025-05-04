import request from "supertest"
import express from "express"
import completedQuestionsRoutes from "../../routes/completedQuestions.js"

jest.mock("../../db.js", () => ({
  query: jest.fn(),
  end: jest.fn(),
}))

import db from "../../db.js"

const app = express()
app.use(express.json())
app.use("/completedQuestions", completedQuestionsRoutes)

describe("GET /completedQuestions/:userId", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return 404 if user is not found", async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0, rows: [] })

    const res = await request(app).get("/completedQuestions/fake-user-id")

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty("error", "User not found.")
  })

  it("should return completed questions for valid user", async () => {
    // First query returns user id
    db.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: 42 }],
    })

    // Second query returns completed questions
    db.query.mockResolvedValueOnce({
      rows: [
        {
          question_id: 1,
          question_text: "What is your name?",
          spoken_text: "My name is John",
          content_score: 90,
          pronunciation_score: 85,
          ai_feedback: "Great job!",
          attempted_at: "2024-05-01T12:00:00Z",
        },
      ],
    })

    const res = await request(app).get("/completedQuestions/fake-user-id")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0]).toHaveProperty("question_id", 1)
    expect(db.query).toHaveBeenCalledTimes(2)
  })

  it("should return 500 on DB error", async () => {
    db.query.mockRejectedValueOnce(new Error("DB is down"))

    const res = await request(app).get("/completedQuestions/fake-user-id")

    expect(res.statusCode).toBe(500)
    expect(res.body).toHaveProperty(
      "error",
      "Failed to fetch completed questions."
    )
  })
})
