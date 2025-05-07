import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import Dashboard from "./Dashboard"
import { vi } from "vitest"
import { act } from "react-dom/test-utils"

// --- MOCK firebase/auth ---
// We need to include all required exports so that firebase.js works correctly.
vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_, callback) => {
      // Simulate a logged-in user.
      callback({ uid: "test-user-id" })
      return () => {}
    }),
    signOut: vi.fn(),
  }
})

// --- MOCK global.fetch ---
// We'll intercept fetch calls and provide fake responses.
global.fetch = vi.fn()

describe("Dashboard", () => {
  beforeEach(() => {
    // Reset mocks between tests.
    fetch.mockReset()
  })

  test("shows login message when user is not authenticated", async () => {
    // Override onAuthStateChanged to simulate no user.
    const { onAuthStateChanged } = await import("firebase/auth")
    onAuthStateChanged.mockImplementationOnce((_, callback) => {
      callback(null)
      return () => {}
    })

    render(<Dashboard />)
    const alertEl = await screen.findByRole("alert")
    expect(alertEl).toHaveTextContent(/please log in to view your dashboard/i)
  })

  test("renders dashboard and switches tabs when data is loaded", async () => {
    // Set up fetch mocks for the three fetches in Dashboard:
    // 1. Questions fetch.
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, question_text: "Question A" },
          { id: 2, question_text: "Question B" },
        ],
      })
      // 2. Saved questions fetch.
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      // 3. Completed questions fetch.
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

    render(<Dashboard />)

    // Wait until the loading message is gone.
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    )

    // At this point the dashboard should be loaded.
    // First, confirm that the tablist is present.
    const tablist = await screen.findByRole("tablist")
    expect(tablist).toBeInTheDocument()

    // Find the "View Completed" tab using the correct aria-label.
    const viewCompletedTab = await screen.findByRole("tab", {
      name: /show completed questions/i,
    })
    expect(viewCompletedTab).toBeInTheDocument()

    // Click the "View Completed" tab.
    await act(async () => {
      fireEvent.click(viewCompletedTab)
    })

    // Verify that after clicking, the expected message is shown.
    const noCompletedMsg = await screen.findByText(
      /you haven't completed any questions yet/i
    )
    expect(noCompletedMsg).toBeInTheDocument()
  })
})

// 1. **Test if "Loading..." message is shown initially:**
test("shows loading message initially", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => [],
  })

  render(<Dashboard />)

  // Check if the "Loading..." message appears while data is being fetched.
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})

// 2. **Test if error message is shown when fetch fails:**
test("shows error message when data fetch fails", async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    statusText: "Failed to fetch questions",
  })

  render(<Dashboard />)

  // Check if the error message is displayed when the fetch fails.
  await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument())
})
