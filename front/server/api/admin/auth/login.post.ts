export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  if (body.password === config.adminPW) {
    setCookie(event, 'admin-auth', 'true', {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 60 * 60, 
    })

    return { success: true }
  }

  throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
})
