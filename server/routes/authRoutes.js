import express from "express"
import admin from "../firebaseAdmin"
import pool from "../db"

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
  } catch (error) {
    console.error(error)
    res.status(401).send("Unauthorized")
  }
})

export default router
