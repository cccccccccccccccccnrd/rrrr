import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.content || typeof body.content !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing content' })
  }

  const cssPath = join(process.cwd(), 'public', 'print.css')
  await writeFile(cssPath, body.content, 'utf-8')

  return { success: true }
})
