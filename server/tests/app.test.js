import request from "supertest"
import app from "../app.js"

describe("GET /", () => {
  it("responds with a welcome message", async () => {
    const res = await request(app).get("/")
    expect(res.statusCode).toBe(200)
    expect(res.text).toBe("Hello from the Astute Abroad's backend!")
  })
})
