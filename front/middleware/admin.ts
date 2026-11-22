export default defineNuxtRouteMiddleware(async (to) => {
  const { error } = await useFetch('/api/admin/auth/check')

  if (error.value) {
    return navigateTo({ path: '/admin/login', query: { to: to.fullPath } })
  }
})
