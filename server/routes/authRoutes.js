import express from "express"
import admin from "../firebaseAdmin.js"
import pool from "../db.js"

const router = express.Router()

router.post("/auth", async (req, res) => {
  const authHeader = req.headers.authorization || ""
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : null

  if (!idToken) {
    return res.status(401).send("No token provided")
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const { uid: firebase_uid, email } = decodedToken

    await pool.query(
      `INSERT INTO users (firebase_uid, email) VALUES ($1, $2) ON CONFLICT (firebase_uid) DO UPDATE SET email = EXCLUDED.email`,
      [firebase_uid, email]
    )
    console.log("User " + firebase_uid, email + " has logged in!")
    res.status(200).json({ message: "User authenticated and stored" })
  } catch (error) {
    console.error(error)
    res.status(401).send("Unauthorized")
  }
})

export default router
