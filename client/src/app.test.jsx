import { render, fireEvent } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import { vi, beforeEach, describe, test, expect } from "vitest"

// Helper: re-renders App with Router wrapper
const renderWithRouter = (ui) => render(<Router>{ui}</Router>)

beforeEach(() => {
  // Reset all modules and mocks before each test to avoid cross-contamination
  vi.resetModules()
})

// Home page test
test("renders home page correctly", async () => {
  vi.doMock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null)
      return () => {}
    }),
  }))
  const { default: App } = await import("./App")
  const { getByText } = renderWithRouter(<App />)
  expect(
    getByText(/Now Boarding: Your Journey to Fluency!/)
  ).toBeInTheDocument()
})

// Get Started navigates to login
test("navigates to login on Get Started button click", async () => {
  vi.doMock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null)
      return () => {}
    }),
  }))
  const { default: App } = await import("./App")
  const { getByText } = renderWithRouter(<App />)
  fireEvent.click(getByText(/Get Started/))
  expect(getByText(/Log in \/ Register/)).toBeInTheDocument()
})

// User not logged in => login button shown
test("shows login button when user is not logged in", async () => {
  vi.doMock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null)
      return () => {}
    }),
  }))
  const { default: App } = await import("./App")
  const { getByText } = renderWithRouter(<App />)
  expect(getByText(/Log in \/ Register/)).toBeInTheDocument()
})

// Mobile menu toggles
test("mobile menu opens and closes correctly", async () => {
  vi.doMock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(null)
      return () => {}
    }),
  }))
  const { default: App } = await import("./App")
  const { getByLabelText, getByText, queryByText } = renderWithRouter(<App />)
  const menuButton = getByLabelText(/Toggle mobile menu/)
  fireEvent.click(menuButton)
  expect(getByText(/Home/)).toBeInTheDocument()
  fireEvent.click(menuButton)
  expect(queryByText(/Home/)).not.toBeInTheDocument()
})

// User is logged in => Logout button shown
test("shows logout button when user is logged in", async () => {
  vi.doMock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback({ uid: "12345" })
      return () => {}
    }),
  }))
  const { default: App } = await import("./App")
  const { getByText } = renderWithRouter(<App />)
  expect(getByText(/Logout/)).toBeInTheDocument()
})

// Clicking logout calls signOut
test("user can log out", async () => {
  const mockSignOut = vi.fn()
  vi.doMock("firebase/auth", () => ({
    getAuth: vi.fn(() => ({})),
    signOut: mockSignOut,
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback({ uid: "12345" })
      return () => {}
    }),
  }))
  const { default: App } = await import("./App")
  const { getByText } = renderWithRouter(<App />)
  const logoutButton = getByText(/Logout/)
  fireEvent.click(logoutButton)
  expect(mockSignOut).toHaveBeenCalled()
})
