import crypto from 'crypto'
import { readFile } from 'fs/promises'
import { join } from 'path'
import type { H3Event } from 'h3'

export async function request (path: string, options: any = {}) {
  const config = useRuntimeConfig()
  const response = await fetch(`${config.baseURL}/api/${path}`, {
    ...options,
    headers: {
      Authorization: config.auth,
      ...options.headers
    }
  })
  const json: any = await response.json()
  return options.raw ? json : json.data
}

// print.css lives in Kirby (field `printcss` on the articles page); data/print.css is only the seed until the first save
export async function getPrintCss () {
  const articles = await request('pages/articles?select=content')
  return articles?.content?.printcss || await readFile(join(process.cwd(), 'data', 'print.css'), 'utf-8')
}

// Login cookie: `email:timestamp:hmac`, signed with ADMIN_PW (an empty secret would make it forgeable)
const sign = (data: string) => crypto.createHmac('sha256', useRuntimeConfig().adminPW).update(data).digest('hex')

export function setAdminCookie (event: H3Event, email: string) {
  if (!useRuntimeConfig().adminPW) {
    throw createError({ statusCode: 500, statusMessage: 'ADMIN_PW (cookie secret) is not set' })
  }
  const data = `${email}:${Date.now()}`
  setCookie(event, 'admin-auth', `${data}:${sign(data)}`, {
    httpOnly: true,
    sameSite: 'lax', // lax so the cookie also arrives on the redirect back from the Kirby Panel
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60
  })
}

// returns the logged-in email, or '' when there is no valid cookie
export function isAdmin (event: H3Event, maxAge = 3600000) {
  const [email, timestamp, signature] = (getCookie(event, 'admin-auth') || '').split(':')
  if (!useRuntimeConfig().adminPW || !email || !timestamp || !signature) return ''
  const expected = Buffer.from(sign(`${email}:${timestamp}`))
  const given = Buffer.from(signature)
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return ''
  return Date.now() - Number(timestamp) > maxAge ? '' : email
}
