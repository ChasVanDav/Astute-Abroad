// src/components/CompletedQuestionDetail.test.jsx
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { vi } from "vitest"
import CompletedQuestionDetail from "./CompletedQuestionDetail"

// Mock framer-motion so it just renders children immediately
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }) => <>{children}</>,
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}))

describe("CompletedQuestionDetail", () => {
  const baseQuestion = {
    question_text: "What is your name?",
    spoken_text: "My name is John.",
    pronunciation_score: 0.85,
    content_score: 8,
    ai_feedback: "Well done!",
  }

  it("renders question_text button and is collapsed by default", () => {
    render(<CompletedQuestionDetail question={baseQuestion} />)
    expect(
      screen.getByRole("button", { name: /What is your name\?/i })
    ).toBeInTheDocument()
    expect(screen.queryByText(/Transcript/i)).toBeNull()
  })

  it("expands and shows all details when clicked", () => {
    render(<CompletedQuestionDetail question={baseQuestion} />)
    const toggle = screen.getByRole("button", { name: /What is your name\?/i })
    fireEvent.click(toggle)

    // Transcript
    expect(screen.getByText(/🗣️ Transcript/i)).toBeInTheDocument()
    expect(screen.getByText(baseQuestion.spoken_text)).toBeInTheDocument()

    // Pronunciation Score (0.85 * 10 rounded = 9%)
    expect(screen.getByText(/🔊 Pronunciation Score/i)).toBeInTheDocument()
    expect(screen.getByText("9%")).toBeInTheDocument()

    // Content Score
    expect(screen.getByText(/🧠 Content Score/i)).toBeInTheDocument()
    expect(screen.getByText("8/10")).toBeInTheDocument()

    // Feedback
    expect(screen.getByText(/💬 Feedback/i)).toBeInTheDocument()
    expect(screen.getByText(baseQuestion.ai_feedback)).toBeInTheDocument()
  })

  it("toggles closed when clicked again", () => {
    render(<CompletedQuestionDetail question={baseQuestion} />)
    const toggle = screen.getByRole("button", { name: /What is your name\?/i })
    fireEvent.click(toggle)
    expect(screen.getByText(/🗣️ Transcript/i)).toBeInTheDocument()
    fireEvent.click(toggle)
    expect(screen.queryByText(/🗣️ Transcript/i)).toBeNull()
  })

  it("handles missing spoken_text and ai_feedback gracefully", () => {
    const q = { ...baseQuestion, spoken_text: "", ai_feedback: "" }
    render(<CompletedQuestionDetail question={q} />)
    const toggle = screen.getByRole("button", { name: /What is your name\?/i })
    fireEvent.click(toggle)

    expect(screen.getByText(/No transcript available/i)).toBeInTheDocument()
    expect(screen.getByText(/No feedback available\./i)).toBeInTheDocument()
  })

  it("omits pronunciation section if score is not a number", () => {
    const q = { ...baseQuestion, pronunciation_score: null }
    render(<CompletedQuestionDetail question={q} />)
    const toggle = screen.getByRole("button", { name: /What is your name\?/i })
    fireEvent.click(toggle)

    expect(screen.queryByText(/🔊 Pronunciation Score/i)).toBeNull()
  })
})
