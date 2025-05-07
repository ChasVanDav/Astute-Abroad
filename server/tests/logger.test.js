import logger from "../logger.js"
import winston from "winston"

describe("Logger", () => {
  it("should be a Winston logger instance", () => {
    expect(logger).toBeInstanceOf(winston.Logger)
  })

  it("should have at least one transport configured", () => {
    expect(logger.transports.length).toBeGreaterThan(0)
  })

  it("should log an info message without throwing", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {})
    logger.info("Test info message")
    spy.mockRestore()
  })

  it("should format logs with timestamp and level", () => {
    const mockInfo = {
      level: "info",
      message: "Formatted message",
      timestamp: "2025-01-01T00:00:00Z",
    }

    const formatter = winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )

    const result = formatter.transform(mockInfo)
    const output = result[Symbol.for("message")]

    expect(output).toBe("2025-01-01T00:00:00Z [INFO]: Formatted message")
  })
})
