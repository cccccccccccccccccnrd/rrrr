import { request, setAdminCookie } from '../../../utils'

// Arriving from the Panel's "Open PDF layout editor" link: Kirby's /pdf-editor route created a one-time
// token for the logged-in Panel user; redeem it (service account) and log that user in here too.
export default defineEventHandler(async (event) => {
  const { token, to } = getQuery(event)
  const result = /^[a-f0-9]{32}$/.test(String(token)) ? await request(`pdf-editor/sso/${token}`, { raw: true }) : null
  if (!result?.email) return sendRedirect(event, '/admin/login?expired=1')
  setAdminCookie(event, result.email)
  const target = String(to || '')
  return sendRedirect(event, target.startsWith('/') && !target.startsWith('//') ? target : '/admin')
})
