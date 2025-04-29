import { jest } from "@jest/globals"

jest.mock("../../db.js", () => ({
  query: jest.fn(),
  end: jest.fn(),
}))

jest.mock("../../firebaseAdmin.js", () => ({
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: "fake-uid-123",
      email: "test@test.com",
    }),
  }),
}))

import request from "supertest"
import express from "express"
import authRoutes from "../../routes/authRoutes.js"
import db from "../../db.js"

const app = express()
app.use(express.json())
app.use("/api", authRoutes)

describe("Auth Routes", () => {
  afterAll(async () => {
    // Closing DB connection or pool after tests
    await db.end()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/auth", () => {
    it("should register a new user with valid data", async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: "test@test.com" }],
      })

      const res = await request(app)
        .post("/api/auth")
        .set("Authorization", "Bearer fake-id-token")
        .send({
          email: "test@test.com",
          password: "password123",
          firebase_uid: "fake-uid-123",
        })

      expect(res.statusCode).toBe(200)
      expect(db.query).toHaveBeenCalledTimes(1)
      expect(res.body).toHaveProperty(
        "message",
        "User authenticated and stored. Log in successful!"
      )
    })

    it("should return 400 if missing field", async () => {
      const res = await request(app)
        .post("/api/auth")
        .set("Authorization", "Bearer fake-id-token")
        .send({
          email: "test@test.com",
        })
      expect(res.statusCode).toBe(400)
      expect(res.body).toHaveProperty("error", "Missing required fields")
    })
  })
})
