import { Router } from "express"
import pool from "../db.js"

const router = Router()

router.get("/completedQuestions/:userId", async (req, res) => {
  const { userId } = req.params

  try {
    const result = await pool.query(
      `SELECT DISTINCT question_id FROM practice_attemtps WHERE user_id = $1`,
      [userId]
    )
    const completedQuestionIds = result.rows.map((row) => row.question_id)
    res.json(completedQuestionIds) //array of question ids already completed by user
  } catch (err) {
    console.error("[GET /completedQuestions", err.message)
    res.status(500).json({ error: "Failed to fetch completed questions" })
  }
})

export default router
