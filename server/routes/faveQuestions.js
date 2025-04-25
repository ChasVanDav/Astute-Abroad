import { Router } from "express"
import pool from "../db.js"
import logger from "../logger.js"

const router = Router()

// 🔖 Favorite a question
router.post("/:userId", async (req, res) => {
  const { userId: firebaseUid } = req.params
  const { question_id } = req.body

  try {
    const userQuery = `SELECT id FROM users WHERE firebase_uid = $1`
    const userResult = await pool.query(userQuery, [firebaseUid])

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found." })
    }
    const dbUserId = userResult.rows[0].id

    const insertQuery = `
      INSERT INTO saved_questions(user_id, question_id)
      VALUES ($1, $2)
      RETURNING *
    `

    const result = await pool.query(insertQuery, [dbUserId, question_id])
    res.status(201).json(result.rows[0])
  } catch (err) {
    logger.info(`[POST /faveQuestions/${firebaseUid}] ${err.message}`)
    res.status(500).json({ error: "Failed to favorite question." })
  }
})

// 📋 Fetch all favorited questions by Firebase UID
router.get("/:userId", async (req, res) => {
  const { userId: firebaseUid } = req.params

  try {
    const userQuery = `SELECT id FROM users WHERE firebase_uid = $1`
    const userResult = await pool.query(userQuery, [firebaseUid])

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found." })
    }
    const dbUserId = userResult.rows[0].id

    const query = `
      SELECT q.id AS question_id, q.question_text
      FROM saved_questions sq
      JOIN questions q ON q.id = sq.question_id
      WHERE sq.user_id = $1 
      ORDER BY sq.saved_at DESC
    `
    const result = await pool.query(query, [dbUserId])
    res.json(result.rows)
  } catch (err) {
    logger.error(`[GET /faveQuestions/${firebaseUid}] ${err.message}`)
    res.status(500).json({ error: "Failed to fetch favorite questions." })
  }
})

// ❌ Unfavorite a question
router.delete("/:userId/:questionId", async (req, res) => {
  const { userId: firebaseUid, questionId } = req.params

  try {
    const userQuery = `SELECT id FROM users WHERE firebase_uid = $1`
    const userResult = await pool.query(userQuery, [firebaseUid])

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found." })
    }
    const dbUserId = userResult.rows[0].id

    const query = `
      DELETE FROM saved_questions
      WHERE user_id = $1 AND question_id = $2
      RETURNING *
    `
    const result = await pool.query(query, [dbUserId, questionId])
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Question has been unfavorited." })
    } else {
      res.status(404).json({ message: "Question not found in favorites." })
    }
  } catch (err) {
    logger.error(
      `[DELETE /faveQuestions/${firebaseUid}/${questionId}] ${err.message}`
    )
    res.status(500).json({ error: "Failed to unfavorite question." })
  }
})

export default router
