export default defineEventHandler((event) => {
  const auth = getCookie(event, 'admin-auth')

  if (auth !== 'true') {
    throw createError({ statusCode: 401 })
  }

  return { ok: true }
})
