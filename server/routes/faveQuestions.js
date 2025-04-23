import { Router } from "express"
import pool from "../db.js"
import logger from "../logger.js"

const router = Router()

// favorite a question
router.post("/:userId", async (req, res) => {
  const { userId } = req.params
  const { question_id } = req.body

  const query = `
        INSERT INTO saved_questions(user_id, question_id)
        VALUES ($1, $2)
        RETURNING *
    `

  try {
    const result = await pool.query(query, [userId, question_id])
    res.status(201).json(result.rows[0])
  } catch (err) {
    logger.info(`[POST /faveQuestions/${userId}] ${err.message}`)
    res.status(500).json({ error: "Failed to save favorited question." })
  }
})

// fetch all favorited questions by user id
router.get("/:userId", async (req, res) => {
  const { userId } = req.params

  const query = `
    SELECT q.question_text
    FROM saved_questions sq
    JOIN questions q ON q.id = sq.question_id
    -- first value passed in req.params
    WHERE sq.user_id = $1 
    ORDER BY sq.saved_at DESC
    `
  try {
    const result = await pool.query(query, userId)
    res.json(result.rows)
  } catch (err) {
    logger.error(`[GET /faveQuestions/${userId}] ${err.message}`)
    res.status(500).json({ error: "Failed to fetch favorite questions." })
  }
})

// Unfavorite a question
router.delete("/:userId/:questionId", async (req, res) => {
  const { userId, questionId } = req.params

  const query = `
        DELETE FROM saved_questions
        WHERE user_id = $1 AND question_id = $2
        RETURNING *
    `

  try {
    const result = await pool.query(query, [userId, questionId])
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Question has been favorited!🌟" })
    } else {
      res.status(404).json({ message: "Question not found in favorites." })
    }
  } catch (err) {
    logger.error(
      `[DELETE /faveQuestions/${userId}/${questionId}] ${err.message}`
    )
    res.status(500).json({ error: "Failed to unfavorite question." })
  }
})

export default router
