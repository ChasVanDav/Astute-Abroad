import request from "supertest"
import express from "express"
import faveQuestionsRoutes from "../../routes/faveQuestions.js"
import db from "../../db.js"

jest.mock("../../db.js", () => ({
  query: jest.fn(),
  end: jest.fn(),
}))

const app = express()
app.use(express.json())
app.use("/faveQuestions", faveQuestionsRoutes)

describe("Fave Questions Routes", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /faveQuestions/:userId", () => {
    it("should favorite a question", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 42 }] }) // user lookup
        .mockResolvedValueOnce({ rows: [{ user_id: 1, question_id: 99 }] }) // insert

      const res = await request(app)
        .post("/faveQuestions/fake-uid")
        .send({ question_id: 99 })

      expect(res.statusCode).toBe(201)
      expect(db.query).toHaveBeenCalledTimes(2)
      expect(res.body).toEqual({ user_id: 1, question_id: 99 })
    })

    it("should return 404 if user not found", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 })

      const res = await request(app)
        .post("/faveQuestions/unknown-uid")
        .send({ question_id: 88 })

      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty("error", "User not found.")
    })
  })

  describe("GET /faveQuestions/:userId", () => {
    it("should return list of favorite questions", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // user lookup
        .mockResolvedValueOnce({
          rows: [{ question_id: 101, question_text: "Sample Q" }],
        })

      const res = await request(app).get("/faveQuestions/fake-uid")

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([
        { question_id: 101, question_text: "Sample Q" },
      ])
    })

    it("should return 404 if user not found", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 })

      const res = await request(app).get("/faveQuestions/bad-uid")

      expect(res.statusCode).toBe(404)
      expect(res.body).toHaveProperty("error", "User not found.")
    })
  })

  describe("DELETE /faveQuestions/:userId/:questionId", () => {
    it("should unfavorite a question", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // user lookup
        .mockResolvedValueOnce({ rowCount: 1 }) // delete

      const res = await request(app).delete("/faveQuestions/fake-uid/101")

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ message: "Question has been unfavorited." })
    })

    it("should return 404 if question not found", async () => {
      db.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] }) // user lookup
        .mockResolvedValueOnce({ rowCount: 0 }) // delete

      const res = await request(app).delete("/faveQuestions/fake-uid/101")

      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual({ message: "Question not found in favorites." })
    })

    it("should return 404 if user not found", async () => {
      db.query.mockResolvedValueOnce({ rowCount: 0 })

      const res = await request(app).delete("/faveQuestions/missing-uid/55")

      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual({ error: "User not found." })
    })
  })
})
