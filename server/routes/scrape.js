import express from "express"
import puppeteerScraper from "../scraper/puppeteerScraper.js"
import pool from "../db.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const scrapedData = await puppeteerScraper()

    for (const { text, url } of scrapedData) {
      await pool.query(
        `INSERT INTO questions (question_text, category, difficulty, source_url)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (question_text) DO NOTHING`,
        [text, "greeting", "beginner", url]
      )
    }

    res.json({ scraped: scrapedData })
  } catch (err) {
    console.error("Scraping failed:", err)
    res.status(500).json({ error: "Scraping failed " })
  }
})

export default router
