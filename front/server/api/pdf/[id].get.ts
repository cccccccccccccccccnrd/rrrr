import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, unlink } from 'fs/promises'
import { join } from 'path'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing article ID' })
  }

  const baseUrl = process.env.NUXT_URL || 'http://localhost:4000'
  const url = `${baseUrl}/html/${id}`
  const styleUrl = `${baseUrl}/print.css`
  const outputPath = join(process.cwd(), `.tmp-${id}-${Date.now()}.pdf`)

  try {
    // Use pagedjs-cli to generate PDF
    await execAsync(
      `npx pagedjs-cli "${url}" -o "${outputPath}" --style "${styleUrl}"`,
      { timeout: 60000 }
    )

    // Read the generated PDF
    const pdfBuffer = await readFile(outputPath)

    // Clean up temp file
    await unlink(outputPath).catch(() => {})

    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `inline; filename="${id}.pdf"`)

    return pdfBuffer
  } catch (error: any) {
    // Clean up temp file on error
    await unlink(outputPath).catch(() => {})

    console.error('PDF generation error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to generate PDF',
    })
  }
})
