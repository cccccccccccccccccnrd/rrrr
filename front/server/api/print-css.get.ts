import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const cssPath = join(process.cwd(), 'public', 'print.css')
  const content = await readFile(cssPath, 'utf-8')
  return { content }
})