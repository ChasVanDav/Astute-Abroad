// src/pages/questions.test.jsx
import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import Questions from "./Questions"

// 1. Mock QuestionDetail to render question text
vi.mock("./QuestionDetail", () => ({
  __esModule: true,
  default: ({ question }) => <div data-testid="question">{question.text}</div>,
}))

// 2. Mock firebase/auth
import { onAuthStateChanged } from "firebase/auth"
vi.mock("firebase/auth", () => ({
  __esModule: true,
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

describe("Questions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // By default, no user
    onAuthStateChanged.mockImplementation((_, cb) => {
      cb(null)
      return () => {}
    })
    // Default fetch returns empty list
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
  })

  it("prompts to log in when no user", async () => {
    render(<Questions />)
    expect(
      await screen.findByText(/Please log in to view questions/i)
    ).toBeInTheDocument()
  })

  it('shows "No questions found." when user but empty list', async () => {
    // Simulate logged-in user
    onAuthStateChanged.mockImplementation((_, cb) => {
      cb({ uid: "u1", email: "a@b.com" })
      return () => {}
    })
    render(<Questions />)
    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument()
    expect(await screen.findByText(/No questions found\./i)).toBeInTheDocument()
  })

  it("renders list of questions when fetch returns data", async () => {
    onAuthStateChanged.mockImplementation((_, cb) => {
      cb({ uid: "u1", email: "a@b.com" })
      return () => {}
    })
    const sample = [
      { id: 1, text: "Q1?" },
      { id: 2, text: "Q2?" },
    ]
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sample),
    })
    render(<Questions />)
    const items = await screen.findAllByTestId("question")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("Q1?")
    expect(items[1]).toHaveTextContent("Q2?")
  })

  it("handles fetch error gracefully", async () => {
    onAuthStateChanged.mockImplementation((_, cb) => {
      cb({ uid: "u1", email: "a@b.com" })
      return () => {}
    })
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    render(<Questions />)
    expect(
      await screen.findByText(/Error: Failed to fetch questions/i)
    ).toBeInTheDocument()
  })
})
