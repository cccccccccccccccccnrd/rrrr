import { request, isAdmin } from '../utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (typeof body?.content !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing content' })
  }

  const response = await request('pages/articles', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-Editor': `${isAdmin(event)} (PDF editor)` },
    body: JSON.stringify({ printcss: body.content }),
    raw: true
  })

  if (response.status !== 'ok') {
    throw createError({ statusCode: 500, message: `Failed to save CSS: ${response.message}` })
  }

  return { success: true }
})
