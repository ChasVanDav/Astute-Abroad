import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import CompletedQuestionsList from "./CompletedQuestionsList"
import { vi } from "vitest"

// Mocking fetch globally
global.fetch = vi.fn()

describe("CompletedQuestionsList", () => {
  const userId = "user123"

  beforeEach(() => {
    fetch.mockClear()
  })

  test("renders loading state", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })

    render(<CompletedQuestionsList userId={userId} />)

    expect(
      screen.getByText(/Loading completed questions.../i)
    ).toBeInTheDocument()
  })

  test("renders error state when fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve([]),
    })

    render(<CompletedQuestionsList userId={userId} />)

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Failed to fetch completed questions/i)
      ).toBeInTheDocument()
    })
  })

  test("renders no completed questions message", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    })

    render(<CompletedQuestionsList userId={userId} />)

    await waitFor(() => {
      expect(
        screen.getByText(/You have not completed any questions yet./i)
      ).toBeInTheDocument()
    })
  })

  test("renders completed questions list", async () => {
    const mockData = [
      { id: "1", question_text: "Question 1" },
      { id: "2", question_text: "Question 2" },
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    render(<CompletedQuestionsList userId={userId} />)

    await waitFor(() => {
      expect(screen.getByText(/Question 1/)).toBeInTheDocument()
      expect(screen.getByText(/Question 2/)).toBeInTheDocument()
    })
  })
})
