import request from "supertest"
import app from "../server.js"
import db from "../db.js"

// Mock DB and OpenAI
jest.mock("../db.js", () => ({
  query: jest.fn(),
}))

jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: `
                1. Answered the question: Yes (clear and accurate)
                2. Mispronunciations: None
                3. Pronunciation Score: 9
                4. Content Score: 10
                5. Relevant: Yes
              `,
              },
            },
          ],
        }),
      },
    },
  }))
})

describe("Server Integration Tests", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("GET / should return welcome message", async () => {
    const res = await request(app).get("/")
    expect(res.statusCode).toBe(200)
    expect(res.text).toMatch(/Astute Abroad/)
  })

  it("POST /practice_attempts should return 400 for missing fields", async () => {
    const res = await request(app).post("/practice_attempts").send({
      questionId: 1,
      spokenText: "안녕하세요",
    })
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("error", "Missing required fields.")
  })

  it("POST /practice_attempts should return 200 for valid request", async () => {
    // First query: fetch question text
    db.query
      .mockResolvedValueOnce({
        rows: [{ question_text: "Where are you going?" }],
      })
      // Second query: insert into practice_attempts
      .mockResolvedValueOnce({
        rows: [{ id: 1, user_id: 1 }],
      })

    const res = await request(app).post("/practice_attempts").send({
      userId: "test-uid-123",
      questionId: 1,
      spokenText: "집에 가고 있어요",
      transcriptionConfidence: 0.92,
    })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("success", true)
    expect(res.body.attempt).toBeDefined()
  })
})
