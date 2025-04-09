import puppeteer from "puppeteer"

const urls = [
  "https://www.learn-korean.net/exercise/qa/part1/questionandanswer",
  "https://www.learn-korean.net/exercise/qa/part2/questionandanswer",
  "https://www.learn-korean.net/exercise/qa/part3/questionandanswer",
]

const puppeteerScraper = async () => {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  const allResults = []

  for (const url of urls) {
    console.log(`Scraping: ${url}`)
    await page.goto(url, { waitUntil: "networkidle2" })

    await page.waitForSelector("td.questionStyle b")

    const data = await page.evaluate(() => {
      const elements = document.querySelectorAll("td.questionStyle b")
      return Array.from(elements).map((el) => el.textContent.trim())
    })

    allResults.push(...data)
  }

  await browser.close()
  return allResults
}

export default puppeteerScraper
