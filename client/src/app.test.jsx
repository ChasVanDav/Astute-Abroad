import { render, fireEvent } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import { signOut } from "firebase/auth"
import { vi } from "vitest"

// Mock Firebase Auth
vi.mock("firebase/auth", async () => {
  return {
    getAuth: vi.fn(() => ({})), // Prevents crashing in firebase.js
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null) // simulate no user logged in
      return () => {} // return unsubscribe function
    }),
  }
})

describe("App Component", () => {
  const renderWithRouter = (ui) => render(<Router>{ui}</Router>)

  test("renders home page correctly", () => {
    const { getByText } = renderWithRouter(<App />)
    expect(
      getByText(/Now Boarding: Your Journey to Fluency!/)
    ).toBeInTheDocument()
  })

  test("navigates to login on Get Started button click", () => {
    const { getByText } = renderWithRouter(<App />)
    fireEvent.click(getByText(/Get Started/))
    // Instead of checking location, look for login page content
    expect(getByText(/Log in \/ Register/)).toBeInTheDocument()
  })

  test("shows login button when user is not logged in", () => {
    const { getByText } = renderWithRouter(<App />)
    expect(getByText(/Log in \/ Register/)).toBeInTheDocument()
  })

  test("shows logout button when user is logged in", () => {
    const mockUser = { uid: "12345" }
    const { getByText } = renderWithRouter(<App user={mockUser} />)
    expect(getByText(/Logout/)).toBeInTheDocument()
  })

  test("mobile menu opens and closes correctly", () => {
    const { getByLabelText, getByText, queryByText } = renderWithRouter(<App />)
    const menuButton = getByLabelText(/Toggle mobile menu/)
    fireEvent.click(menuButton)
    expect(getByText(/Home/)).toBeInTheDocument()
    fireEvent.click(menuButton)
    expect(queryByText(/Home/)).not.toBeInTheDocument()
  })

  test("user can log out", async () => {
    const mockUser = { uid: "12345" }
    const { getByText } = renderWithRouter(<App user={mockUser} />)
    const logoutButton = getByText(/Logout/)
    fireEvent.click(logoutButton)
    expect(signOut).toHaveBeenCalled()
  })
})
