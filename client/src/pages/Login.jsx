import React, { useState } from "react"
import { auth } from "../firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignUp = async () => {
    try {
      const userCredential =
        await createUserWithEmailAndPassword.user.getIdToken()
      const idToken = await userCredential.user.getIdToken()
      await sendUserToBackend(idToken)
    } catch (error) {
      console.error(error.message)
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
    } catch (error) {
      console.error(error.message)
    }
  }

  const sendUserToBackend = async (token) => {
    await fetch("http://localhost:5000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-black">
        <h2 className="text-2xl font-semibold text-black mb-6 text-center">
          Log In
        </h2>
        <form className="space-y-4">
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
            onClick={handleSignIn}
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
          >
            Log In
          </button>
          <button
            onClick={handleSignUp}
            className="w-full py-2 px-4 bg-sky-400 text-white rounded-lg hover:bg-orange-300 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
