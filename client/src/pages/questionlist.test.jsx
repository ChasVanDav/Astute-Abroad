import { render, screen, waitFor } from "@testing-library/react"
import QuestionList from "./QuestionList"
import { vi } from "vitest"

// Define mock questions here
const mockQuestions = [
  {
    id: 1,
    question_text: "Question 1",
    category: "greeting",
    difficulty: "beginner",
  },
  {
    id: 2,
    question_text: "Question 2",
    category: "shopping",
    difficulty: "advanced",
  },
]

beforeEach(() => {
  // Mock fetch to return our mockQuestions
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockQuestions),
    })
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

test("renders questions from fetch", async () => {
  render(<QuestionList userId={1} savedQuestions={[]} />)

  // Wait for the questions to appear
  await waitFor(() => {
    expect(screen.getByText(/Question 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Question 2/i)).toBeInTheDocument()
  })
})
