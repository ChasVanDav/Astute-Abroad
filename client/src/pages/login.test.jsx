// src/pages/login.test.jsx
import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import * as firebaseAuth from "firebase/auth"
import Login from "./Login"

// 1. Mock ../firebase so that `auth.currentUser` exists
vi.mock("../firebase", () => ({
  auth: { currentUser: { uid: "uid123", email: "test@example.com" } },
}))

// 2. Mock firebase/auth methods (with __esModule so named exports work)
vi.mock("firebase/auth", () => ({
  __esModule: true,
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(() => ({
    currentUser: { uid: "uid123", email: "test@example.com" },
  })),
}))

// 3. Mock react-router-dom's useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}))

// 4. Mock ReCAPTCHA to immediately supply a token
vi.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: ({ onChange }) => {
    React.useEffect(() => onChange("dummy-token"), [onChange])
    return <div data-testid="recaptcha">[reCAPTCHA]</div>
  },
}))

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders email, password fields and buttons", () => {
    render(<Login />)
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument()
  })

  it("lets the user type email and password", () => {
    render(<Login />)
    const email = screen.getByPlaceholderText("Email")
    const pass = screen.getByPlaceholderText("Password")
    fireEvent.change(email, { target: { value: "foo@bar.com" } })
    fireEvent.change(pass, { target: { value: "s3cret!" } })
    expect(email.value).toBe("foo@bar.com")
    expect(pass.value).toBe("s3cret!")
  })

  it("calls signInWithEmailAndPassword on Log In click", async () => {
    // stub the imported spy
    firebaseAuth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { getIdToken: () => Promise.resolve("token") },
    })

    render(<Login />)
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "pass" },
    })
    fireEvent.click(screen.getByRole("button", { name: /log in/i }))

    await waitFor(() => {
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        "a@b.com",
        "pass"
      )
    })
  })

  it("calls createUserWithEmailAndPassword on Register click", async () => {
    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { getIdToken: () => Promise.resolve("token") },
    })

    render(<Login />)
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "x@y.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "word" },
    })
    fireEvent.click(screen.getByRole("button", { name: /register/i }))

    await waitFor(() => {
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        "x@y.com",
        "word"
      )
    })
  })
})
