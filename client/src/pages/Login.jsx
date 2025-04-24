import React, { useState } from "react"
import { auth } from "../firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  // user registration
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const idToken = await userCredential.user.getIdToken()
      console.log("Registration ID Token retrieved 🪙", idToken)

      await sendUserToBackend(idToken)

      console.log("Registration successful! Welcome to Astute Abroad! 👋🏽")
      navigate("/questions")
    } catch (error) {
      console.error("Registration error:", error.message)
    }
  }

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const idToken = await userCredential.user.getIdToken()
      console.log("Login ID Token retrieved 🪙", idToken)

      await sendUserToBackend(idToken)

      console.log("Login successful! Welcome back! 😎")
      navigate("/questions")
    } catch (error) {
      console.error("Login error: ", error.message)
    }
  }

  // send firebase ID token to backend for authentication and save in database
  const sendUserToBackend = async (token) => {
    console.log("Sending token to backend 🪙")
    try {
      const response = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const responseText = await response.text()
      console.log("Backend response:", response.status, responseText)

      if (!response.ok) {
        throw new Error("Backend auth failed 😓")
      }
    } catch (err) {
      console.error("Failed to authenticate with backend:", err.message)
    }
  }
  // user log out function
  const handleLogout = async () => {
    try {
      await signOut(auth)
      console.log("User signed out successfully ✌🏽")
      navigate("/")
    } catch (error) {
      console.error("Logout error: ", error.message)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-black">
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">
          Log In
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-black rounded-md text-black bg-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-black rounded-md text-black bg-white"
          />
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
          >
            Register
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-400 text-white rounded-lg hover:bg-red-500 transition"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}
