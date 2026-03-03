import { readFile } from 'fs/promises'
import { join } from 'path'

// Persistent data folder - not affected by builds
const DATA_DIR = join(process.cwd(), 'data')
const CSS_PATH = join(DATA_DIR, 'print.css')

export default defineEventHandler(async (event) => {
  const content = await readFile(CSS_PATH, 'utf-8')
  
  // Set correct MIME type for CSS
  setHeader(event, 'Content-Type', 'text/css')
  
  return content
})
