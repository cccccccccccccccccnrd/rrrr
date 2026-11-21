import { isAdmin } from '../utils'

// The page middleware in /middleware only runs client-side; this guards the API itself.
export default defineEventHandler((event) => {
  const path = event.path.split('?')[0]
  const isAdminApi = path.startsWith('/api/admin/') && !path.startsWith('/api/admin/auth/')
  const isCssWrite = path === '/api/print-css' && event.method !== 'GET'

  if (!isAdminApi && !isCssWrite) return

  if (!isAdmin(event)) {
    throw createError({ statusCode: 401 })
  }
})
