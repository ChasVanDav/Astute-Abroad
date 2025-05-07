// tests/routes/practiceAttempts.test.js

// 1) Mock your DB module exactly as imported in practiceAttempts.js
jest.mock("../../db.js", () => ({
  query: jest.fn(),
  end: jest.fn(),
}))

// 2) Mock OpenAI so that chat.completions.create is a jest.fn() returning a valid choices array
jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Answered the question: Yes" } }],
        }),
      },
    },
  })),
}))

import request from "supertest"
import express from "express"
import db from "../../db.js" // ← mocked above
import OpenAI from "openai" // ← mocked above
import practiceAttemptsRouter from "../../routes/practiceAttempts.js"

describe("POST /practice_attempts", () => {
  let app
  let openaiClient

  beforeAll(() => {
    app = express()
    app.use(express.json())
    app.use("/practice_attempts", practiceAttemptsRouter)

    // Grab the OpenAI client instance the router created
    openaiClient = OpenAI.mock.instances[0]
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/practice_attempts")
      .send({ userId: "uid-only", questionId: 1 })

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: "Missing required fields." })
  })

  it("returns 404 when question not found", async () => {
    db.query.mockResolvedValueOnce({ rows: [] }) // question lookup

    const res = await request(app).post("/practice_attempts").send({
      userId: "u",
      questionId: 999,
      spokenText: "Hello",
      transcriptionConfidence: 0.5,
    })

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({ error: "Question not found." })
  })

  it("returns 404 when user not found", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ question_text: "Q?" }] }) // question found
      .mockResolvedValueOnce({ rows: [] }) // insert/SELECT user

    const res = await request(app).post("/practice_attempts").send({
      userId: "u",
      questionId: 1,
      spokenText: "Hello",
      transcriptionConfidence: 0.5,
    })

    expect(db.query).toHaveBeenCalledTimes(2)
    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({ error: "User not found." })
  })

  it("returns 200 and the inserted attempt on success", async () => {
    const fakeAttempt = {
      user_id: 42,
      question_id: 1,
      spoken_text: "My name is John.",
      transcription_confidence: 0.5,
      ai_feedback: "Answered the question: Yes",
      content_score: 8,
      pronunciation_score: 5,
      is_relevant: true,
    }

    db.query
      .mockResolvedValueOnce({ rows: [{ question_text: "Q?" }] }) // question lookup
      .mockResolvedValueOnce({ rows: [fakeAttempt] }) // insert/return

    const res = await request(app).post("/practice_attempts").send({
      userId: "u",
      questionId: 1,
      spokenText: "My name is John.",
      transcriptionConfidence: 0.5,
    })

    expect(db.query).toHaveBeenCalledTimes(2)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ success: true, attempt: fakeAttempt })
  })

  it("returns 500 on database error", async () => {
    db.query.mockRejectedValueOnce(new Error("DB failure"))

    const res = await request(app).post("/practice_attempts").send({
      userId: "u",
      questionId: 1,
      spokenText: "Hello",
      transcriptionConfidence: 0.5,
    })

    expect(db.query).toHaveBeenCalledTimes(1)
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: "Failed to process response" })
  })
})
