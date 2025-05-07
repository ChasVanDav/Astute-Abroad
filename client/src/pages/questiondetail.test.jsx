/**
 * @vitest-environment jsdom
 */

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import QuestionDetail from "./QuestionDetail"
import { vi } from "vitest"

// Mocking scrollIntoView to prevent errors
window.HTMLElement.prototype.scrollIntoView = vi.fn()

// Mock framer-motion to prevent actual animation
vi.mock("framer-motion", () => {
  const React = require("react")
  return {
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: { div: ({ children }) => <>{children}</> },
  }
})

// Dummy media setup to prevent errors during tests
class DummyMediaStream {}
global.MediaStream = DummyMediaStream
navigator.mediaDevices = {
  getUserMedia: vi.fn(() => Promise.resolve(new DummyMediaStream())),
}

window.WebSocket = vi.fn(() => ({
  send: () => {},
  close: () => {},
  readyState: WebSocket.OPEN,
  addEventListener: () => {},
}))
window.MediaRecorder = vi.fn(() => ({
  start: () => {},
  stop: () => {},
  addEventListener: () => {},
}))

// Mock data
const mockUser = { uid: "user123" }
const mockQuestion = { id: 1, question_text: "What is your name?" }

beforeEach(() => {
  global.fetch = vi.fn((url, opts) => {
    if (url.includes("/faveQuestions")) {
      if (opts?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(),
        })
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    }
    if (url.includes("/practice_attempts")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            attempt: {
              ai_feedback: "Good job!",
              pronunciation_score: 8,
              content_score: 7,
              spoken_text: "My name is John",
            },
          }),
      })
    }
    return Promise.reject(new Error("Unknown URL"))
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

test("renders question, expands, starts listening, and shows Listening state", async () => {
  render(
    <QuestionDetail
      question={mockQuestion}
      user={mockUser}
      onComplete={vi.fn()}
    />
  )

  fireEvent.click(screen.getByText(/What is your name\?/i))
  fireEvent.click(screen.getByText(/🎙️ Start/i))

  await waitFor(() =>
    expect(screen.getByText(/Listening\.\.\./i)).toBeInTheDocument()
  )
})

test("toggles favorite state when button clicked", async () => {
  render(
    <QuestionDetail
      question={mockQuestion}
      user={mockUser}
      onComplete={vi.fn()}
    />
  )

  const starButton = await screen.findByRole("button", {
    name: /add question to favorites/i,
  })
  expect(starButton).toHaveTextContent("☆")

  fireEvent.click(starButton)

  await waitFor(() =>
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/faveQuestions"),
      expect.objectContaining({ method: "POST" })
    )
  )
})

test("displays feedback and scores after receiving response", async () => {
  render(
    <QuestionDetail
      question={mockQuestion}
      user={mockUser}
      onComplete={vi.fn()}
    />
  )

  fireEvent.click(screen.getByText(/What is your name\?/i))
  fireEvent.click(screen.getByText(/🎙️ Start/i))
  fireEvent.click(screen.getByText(/⏹ Stop/i))

  // Wait for the status to change to "done" before checking feedback and scores
  await waitFor(() =>
    expect(screen.getByText(/Pronunciation/i)).toBeInTheDocument()
  )

  expect(screen.getByText(/Pronunciation/i)).toBeInTheDocument()
  expect(screen.getByText(/Content/i)).toBeInTheDocument()
  expect(screen.getByText(/Good job!/i)).toBeInTheDocument()
})
