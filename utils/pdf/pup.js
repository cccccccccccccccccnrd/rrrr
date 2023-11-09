const puppeteer = require('puppeteer')

let browser
const margin = '8mm'

async function pdf (slug) {
  const url = `http://localhost:4444/pdfs/${slug}`
  console.log(url)

  try {
    const page = await browser.newPage()

    page.setDefaultTimeout(20 * 1000)

    /* await page.setViewport({
      width: 1240, // 2480,
      height: 1754, // 3508,
      deviceScaleFactor: 2
    }) */

    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.pdf({
      /* printBackground: true, */
      /* preferCSSPageSize: true, */
      format: 'A4',
      /* displayHeaderFooter: true,
      footerTemplate:
        "<span class='pageNumber'></span> <span>out of</span> <span class='totalPages'></span>", */
      margin: {
        top: margin,
        bottom: margin,
        right: margin,
        left: margin
      },
      path: `exports/${slug}.pdf`
    })
  } catch (error) {
    console.log(error)
  }
}

async function init () {
  const slug = process.argv[2]

  browser = await puppeteer.launch({ headless: false })

  await pdf(slug)
  /* await browser.close() */
}

init()
