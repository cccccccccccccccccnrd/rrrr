export default defineEventHandler((event) => {
  deleteCookie(event, 'admin-auth', {
    path: '/',
  })

  return { success: true }
})