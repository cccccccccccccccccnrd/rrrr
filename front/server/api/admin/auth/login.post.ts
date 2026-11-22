import { setAdminCookie } from '../../../utils'

// Same accounts as the Kirby Panel (needs api.basicAuth)
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const kirby = await fetch(`${useRuntimeConfig().baseURL}/api/auth`, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${body.email}:${body.password}`).toString('base64') }
  })
  if (!kirby.ok) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid login' })
  }
  setAdminCookie(event, body.email)
  return { success: true }
})
