import pg from "pg"
import pool from "../db.js"

jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn().mockResolvedValue(),
    query: jest.fn(),
    end: jest.fn(),
  }

  return {
    Pool: jest.fn(() => mClient),
  }
})

describe("Database connection", () => {
  it("should create a pool instance with correct config", async () => {
    expect(pg.Pool).toHaveBeenCalledWith({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
    })
  })

  it("should connect without throwing", async () => {
    // force a call to .connect() to verify
    await expect(pool.connect()).resolves.not.toThrow()
  })
})
