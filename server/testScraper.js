import "dotenv/config"
import puppeteerScraper from "./scraper/puppeteerScraper.js"

;(async () => {
  try {
    const data = await puppeteerScraper()
    console.log(JSON.stringify(data, null, 2))
  } catch (e) {
    console.error("Test scrape failed:", e)
  }
})()
