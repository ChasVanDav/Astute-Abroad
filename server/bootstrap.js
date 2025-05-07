import pool from "./db.js"
import { scrapeAndInsert } from "./scraper/scrape.js"

export async function bootstrap() {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) FROM questions")
    const count = Number(rows[0].count)

    if (count === 0) {
      console.log("📥 No questions found — scraping now...")
      await scrapeAndInsert()
    } else {
      console.log(`✅ Questions exist: ${count} rows found. Skipping scrape.`)
    }
  } catch (err) {
    console.error("error message:", err)
  }
}
