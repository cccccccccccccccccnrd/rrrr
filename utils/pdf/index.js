const puppeteer = require('puppeteer')

let browser

async function screenshot (slug) {
  const url = `http://localhost:5050/pdfs/${ slug }`
  console.log(url)

  try {
    const page = await browser.newPage()

    page.setDefaultTimeout(20 * 1000)

    /* await page.setViewport({
      width: 1240, // 2480,
      height: 1754, // 3508,
      deviceScaleFactor: 2
    }) */

    await page.goto(url, { 'waitUntil': 'networkidle2' })
    await page.pdf({ 
      /* printBackground: true, */
      preferCSSPageSize: true,
      path: `exports/${ slug }.pdf` })
    await page.close()
  } catch(error) {
    console.log(error)
  }
}

async function init () {
  const slug = process.argv[2]

  browser = await puppeteer.launch({ headless: true })

  await screenshot(slug)
  await browser.close()
}

init()