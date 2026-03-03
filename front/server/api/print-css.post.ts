import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Persistent data folder - not affected by builds
const DATA_DIR = join(process.cwd(), 'data')
const CSS_PATH = join(DATA_DIR, 'print.css')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.content || typeof body.content !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing content' })
  }

  try {
    // Ensure data directory exists
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(CSS_PATH, body.content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to write CSS file:', error)
    throw createError({ 
      statusCode: 500, 
      message: `Failed to write CSS: ${error.message}` 
    })
  }
})
