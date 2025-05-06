import { Router } from "express"
import pool from "../db.js"
// import logger from "../logger.js"

const router = Router()

router.get("/:userId", async (req, res) => {
  const { userId: firebaseUid } = req.params
  // console.log(`[GET completedQuestions] firebaseUid: ${firebaseUid}`)

  try {
    const userQuery = `SELECT id FROM users WHERE firebase_uid = $1`
    const userResult = await pool.query(userQuery, [firebaseUid])
    // console.log(userQuery, userResult)

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found." })
    }

    const dbUserId = userResult.rows[0].id

    const query = `
      SELECT 
      DISTINCT ON (p.question_id) 
      p.question_id,
      q.question_text,
      p.spoken_text,
      p.content_score,
      p.pronunciation_score,
      p.ai_feedback,
      p.attempted_at
      FROM practice_attempts p
      JOIN questions q ON q.id = p.question_id
     WHERE p.user_id = $1
     ORDER BY p.question_id, p.attempted_at DESC
    `

    const result = await pool.query(query, [dbUserId])
    // console.log("Completed Questions Result:", result.rows)

    res.json(result.rows)
  } catch (err) {
    console.error(`[GET /completedQuestions/${firebaseUid}] ${err.message}`)
    res.status(500).json({ error: "Failed to fetch completed questions." })
  }
})

export default router
