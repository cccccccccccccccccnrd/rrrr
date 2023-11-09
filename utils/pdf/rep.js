const puppeteer = require('puppeteer')
const report = require('puppeteer-report')
const path = require('path')

let browser
const margin = '10mm'

async function screenshot(slug) {
  /* const url = `file://${path.join(__dirname, `/dump/${slug}.html`)}` */
  const url = `http://localhost:4444/pdfs/${slug}`
  console.log(url)

  try {
    const page = await browser.newPage()

    await page.goto(url, { waitUntil: 'networkidle0' })
    await report.pdfPage(page, {
      path: `exports/${slug}.pdf`,
      format: 'A4',
      margin: {
        bottom: margin,
        left: margin,
        right: margin,
        top: margin
      }
    })
  } finally {
    await browser.close()
  }
}

async function init () {
  const slug = process.argv[2]

  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  })

  await screenshot(slug)
  await browser.close()
}

init()
