import puppeteer, { Browser } from 'puppeteer'
// @ts-ignore
import report from 'puppeteer-report'

let browser: Browser | null = null

async function getBrowser() {
  if (!browser || !browser.connected) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    })
  }
  return browser
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing article ID' })
  }

  const margin = '10mm'
  const baseUrl = process.env.NUXT_URL || 'http://localhost:4000'
  const url = `${baseUrl}/html/${id}`
  const printCssUrl = `${baseUrl}/print.css`

  try {
    const browser = await getBrowser()
    const page = await browser.newPage()

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

    // Add print styles from public folder
    await page.addStyleTag({ url: printCssUrl })

    // Wait for fonts to load (runs in browser context)
    await page.evaluate(`(async () => {
      await document.fonts.ready
      await new Promise((resolve) => setTimeout(resolve, 500))
    })()`)

    // Use puppeteer-report for @page header/footer support
    const pdfBuffer = await report.pdfPage(page, {
      format: 'A4',
      margin: {
        top: margin,
        bottom: margin,
        left: margin,
        right: margin,
      },
    })

    await page.close()

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `inline; filename="${id}.pdf"`)

    return pdfBuffer
  } catch (error: any) {
    console.error('PDF generation error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to generate PDF',
    })
  }
})
