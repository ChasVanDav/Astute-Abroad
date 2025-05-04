import express from "express"
import admin from "../firebaseAdmin.js"
import pool from "../db.js"

const router = express.Router()

// route to handle user authentication powered by Firebase
router.post("/auth", async (req, res) => {
  const { email, password, firebase_uid } = req.body

  if (!email || !password || !firebase_uid) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // from authorization header, grab bearer token
  const authHeader = req.headers.authorization || ""
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split("Bearer ")[1]
    : null

  // in the event of no token, send error message
  if (!idToken) {
    console.log("Unable to return token.")
    return res.status(401).send("No token found")
  }

  // extract firebase id and email from token
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    console.log("Decoded token: ", decodedToken)
    const { uid: firebase_uid, email } = decodedToken

    // error case 1 - no id
    if (!firebase_uid) {
      console.error("Missing UID in decoded token!", decodedToken)
      return res.status(400).json({ error: "UID missing from token." })
    }

    // error case 2 - no email
    if (!email) {
      console.error("Missing email in decoded token!", decodedToken)
      return res.status(400).json({ error: "Email missing from token." })
    }

    // store user information in database, handle case of existing firebase_id
    const result = await pool.query(
      `INSERT INTO users (firebase_uid, email) 
       VALUES ($1, $2) 
       ON CONFLICT (firebase_uid) 
       DO UPDATE SET email = EXCLUDED.email`,
      [firebase_uid, email]
    )

    // Log the result
    console.log("Query Result:", result)

    console.log("User " + firebase_uid, email + " has logged in!")
    res
      .status(200)
      .json({ message: "User authenticated and stored. Log in successful!" })
  } catch (error) {
    console.error("Auth error", error.message)
    res.status(401).json({ error: "Unauthorized", details: error.message })
  }
})

export default router
