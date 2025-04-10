import express from "express"
import puppeteerScraper from "../scraper/puppeteerScraper.js"
import pool from "../db.js"
import logger from "../logger.js"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const scrapedData = await puppeteerScraper()

    let successCount = 0
    let skipCount = 0
    let failCount = 0

    for (const { text, url } of scrapedData) {
      try {
        const result = await pool.query(
          `INSERT INTO questions (question_text, category, difficulty, source_url)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (question_text) DO NOTHING`,
          [text, "greeting", "beginner", url]
        )

        if (result.rowCount === 1) successCount++
        else skipCount++
      } catch (dbErr) {
        failCount++
        logger.error(
          `DB insert failed for "${text}" from ${url}: ${dbErr.message}`
        )
      }
    }

    logger.info(
      `Insert summary - succeeded: ${successCount}, skipped: ${skipCount}, failed: ${failCount}`
    )

    res.json({
      scraped: scrapedData,
      summary: { successCount },
    })
  } catch (err) {
    logger.error(`Scraping route failed: ${err.message}`)
    res.status(500).json({ error: "Scraping failed" })
  }
})

export default router
