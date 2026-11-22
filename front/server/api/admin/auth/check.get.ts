import { isAdmin } from '../../../utils'

export default defineEventHandler((event) => {
  if (!isAdmin(event)) throw createError({ statusCode: 401 })
  return { ok: true }
})
