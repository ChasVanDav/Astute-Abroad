import { signUp, signIn, logOut } from "./authService.js"
import { vi } from "vitest"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth"

// Mock Firebase functions
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(() => ({
    /* mock the auth object if needed */
  })),
}))

describe("Authentication Functions", () => {
  // Test for signUp function
  test("signUp calls createUserWithEmailAndPassword and returns user", async () => {
    const mockUser = { uid: "12345", email: "test@example.com" }

    // Mock the createUserWithEmailAndPassword function to resolve with a user
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser,
    })

    const result = await signUp("test@example.com", "password123")

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    )
    expect(result).toEqual(mockUser)
  })

  test("signUp throws error if createUserWithEmailAndPassword fails", async () => {
    const error = new Error("Signup failed")
    createUserWithEmailAndPassword.mockRejectedValueOnce(error)

    await expect(signUp("test@example.com", "password123")).rejects.toThrow(
      error
    )
  })

  // Test for signIn function
  test("signIn calls signInWithEmailAndPassword and returns user", async () => {
    const mockUser = { uid: "12345", email: "test@example.com" }

    // Mock the signInWithEmailAndPassword function to resolve with a user
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: mockUser,
    })

    const result = await signIn("test@example.com", "password123")

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123"
    )
    expect(result).toEqual(mockUser)
  })

  test("signIn throws error if signInWithEmailAndPassword fails", async () => {
    const error = new Error("Sign in failed")
    signInWithEmailAndPassword.mockRejectedValueOnce(error)

    await expect(signIn("test@example.com", "password123")).rejects.toThrow(
      error
    )
  })

  // Test for logOut function
  test("logOut calls signOut and resolves", async () => {
    // Mock the signOut function to resolve
    signOut.mockResolvedValueOnce(undefined)

    await logOut()

    expect(signOut).toHaveBeenCalledWith(expect.anything())
  })

  test("logOut calls signOut and catches errors", async () => {
    const error = new Error("Sign out failed")
    signOut.mockRejectedValueOnce(error)

    await expect(logOut()).rejects.toThrow(error)
  })
})
