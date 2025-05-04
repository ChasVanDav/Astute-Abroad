/**
 * @vitest-environment jsdom
 */

import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import QuestionDetail from "./QuestionDetail"
import { vi } from "vitest"

// Stub scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn()

// Mock framer-motion
vi.mock("framer-motion", () => {
  const React = require("react")
  return {
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: { div: ({ children }) => <>{children}</> },
  }
})

// Provide dummy MediaStream so getUserMedia resolves
class DummyMediaStream {}
global.MediaStream = DummyMediaStream
navigator.mediaDevices = {
  getUserMedia: vi.fn(() => Promise.resolve(new DummyMediaStream())),
}

// Dummy WebSocket & MediaRecorder to silence startRecording
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

const mockUser = { uid: "user123" }
const mockQuestion = { id: 1, question_text: "What is your name?" }

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes("/faveQuestions")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
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

  // Expand
  fireEvent.click(screen.getByText(/What is your name\?/i))

  // Click Start
  fireEvent.click(screen.getByText(/🎙️ Start/i))

  // Wait for the "Listening..." indicator
  await waitFor(() =>
    expect(screen.getByText(/Listening\.\.\./i)).toBeInTheDocument()
  )
})
