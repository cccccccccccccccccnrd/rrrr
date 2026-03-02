import { verifyToken } from './login.post'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'admin-auth')
  const config = useRuntimeConfig()

  if (!token || !verifyToken(token, config.adminPW)) {
    throw createError({ statusCode: 401 })
  }

  return { ok: true }
})
