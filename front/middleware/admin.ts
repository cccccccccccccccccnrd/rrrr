export default defineNuxtRouteMiddleware(async () => {
  const { data, error } = await useFetch('/api/admin/auth/check')

  if (error.value) {
    return navigateTo('/admin/login')
  }
})
