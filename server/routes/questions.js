import { Router } from "express"
import pool from "../db.js"
import logger from "../logger.js"

const router = Router()

router.get("/", async (req, res) => {
  // query parameters from url, for filtering and pagination (if available)
  const { category, difficulty, page, limit } = req.query

  const conditions = []
  const values = []

  // if user selects a category, add it to the sql query where clause
  if (category) {
    values.push(category)
    conditions.push(`category = $${values.length}`) // first value = $1
  }
  // ditto for user selecting difficulty level
  if (difficulty) {
    values.push(difficulty)
    conditions.push(`difficulty = $${values.length}`) // second value = $2
  }
  // combine user conditions into where clause
  const whereClause = conditions.length // for example combined = [$1, $2]
    ? `WHERE ${conditions.join(" AND ")}`
    : ""

  let query = `SELECT * FROM questions ${whereClause}`

  //

  // const query = `SELECT * FROM questions ${whereClause} LIMIT $${
  //   values.length + 1
  // } OFFSET $${values.length + 2} ` //pagination values [$3, $4]

  if (page && limit) {
    const offset = (page - 1) * limit
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
    values.push(limit, offset)
  }

  try {
    const result = await pool.query(query, values)
    res.json(result.rows) // send rows - array of objects containing each line of questions
  } catch (err) {
    logger.error(`[GET /questions] ${err.message}`)
    res.status(500).json({ error: "Failed to fetch questions" }) // server error
  }
})

export default router
