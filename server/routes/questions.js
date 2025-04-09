import { Router } from "express"
import pool from "../db.js"
import logger from "../logger.js"

const router = Router()

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM questions")
    res.json(result.rows)
  } catch (err) {
    logger.error(`[GET /questions] ${err.message}`)
  }
})

export default router
