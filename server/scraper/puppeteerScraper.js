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

    // Grab all <b> inside .questionStyle, return an array of strings
    const texts = await page.$$eval("td.questionStyle b", (els) =>
      els.map((el) => el.innerText.trim())
    )

    // remove duplicates within this page
    const uniqueTexts = Array.from(new Set(texts))

    // Map each string to an object with its source URL
    uniqueTexts.forEach((text) => {
      if (text) {
        allResults.push({ text, url })
      }
    })
  }

  await browser.close()
  return allResults
}

export default puppeteerScraper
