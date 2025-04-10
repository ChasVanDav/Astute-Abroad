import { Router } from "express"
import pool from "../db.js"
import logger from "../logger.js"

const router = Router()

router.get("/", async (req, res) => {
  const { category, difficulty, page = 1, limit = 5 } = req.query

  const conditions = []
  const values = []

  if (category) {
    values.push(category)
    conditions.push(`category = $${values.length}`)
  }

  if (difficulty) {
    values.push(difficulty)
    conditions.push(`difficulty = $${values.length}`)
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : ""

  const offset = (page - 1) * limit

  const query = `SELECT * FROM questions ${whereClause} LIMIT $${
    values.length + 1
  } OFFSET $${values.length + 2} `

  values.push(limit, offset)

  try {
    const result = await pool.query(query, values)
    res.json(result.rows)
  } catch (err) {
    logger.error(`[GET /questions] ${err.message}`)
    res.status(500).json({ error: "Failed to fetch questions" })
  }
})

export default router
