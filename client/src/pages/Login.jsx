import React, { useState } from "react"
import { auth } from "../firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { FiEye, FiEyeOff } from "react-icons/fi"
import ReCAPTCHA from "react-google-recaptcha"

export default function Login() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [type, setType] = useState("password")
  const [recaptchaToken, setRecaptchaToken] = useState(null)

  const handleToggle = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"))
  }

  const handleCaptchaChange = (token) => {
    console.log("reCAPTCHA token acquired!🪙")
    setRecaptchaToken(token)
  }

  // user registration
  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!recaptchaToken) {
      alert("Please verify you're not a robot")
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const idToken = await userCredential.user.getIdToken()
      console.log("Registration ID Token retrieved 🪙")

      await sendUserToBackend(idToken)

      console.log("Registration successful! Welcome to Astute Abroad! 👋🏽")
      alert("Registration successful! Welcome to Astute Abroad! 👋🏽")
      navigate("/dashboard")
    } catch (error) {
      console.error("Registration error:", error.message)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    if (!recaptchaToken) {
      alert("Please verify you're not a robot")
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const idToken = await userCredential.user.getIdToken()
      console.log("Login ID Token retrieved 🪙")

      await sendUserToBackend(idToken)

      console.log("Login successful! Welcome back! 😎")
      alert("Login successful! Welcome back! 😎")
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error: ", error.message)
    }
  }

  // send firebase ID token to backend for authentication and save in database
  const sendUserToBackend = async (token) => {
    console.log("Sending token to backend 🪙")

    // Get user details from Firebase
    const user = auth.currentUser
    const firebase_uid = user.uid // Firebase UID
    const email = user.email // User email

    try {
      const response = await fetch("http://localhost:5000/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebase_uid, // Send firebase_uid
          email, // Send email
        }),
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

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-black rounded-md text-black bg-white"
            aria-label="Email address"
          />
          <div className="relative">
            <input
              type={type}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-black rounded-md text-black bg-white"
              aria-label="Password"
            />
            <span
              onClick={handleToggle}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              aria-label={
                type === "password" ? "Show password" : "Hide password"
              }
            >
              {type === "password" ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </span>
          </div>

          <ReCAPTCHA
            sitekey={siteKey}
            onChange={handleCaptchaChange}
            aria-label="Please complete the CAPTCHA to verify you're not a robot"
          />

          <button
            onClick={handleSignIn}
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
            aria-label="Log in"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
            aria-label="Register for an account"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
