import { readFile } from 'fs/promises'
import { join } from 'path'
import type { H3Event } from 'h3'
import { verifyToken } from './api/admin/auth/login.post'

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

export function isAdmin (event: H3Event) {
  const token = getCookie(event, 'admin-auth')
  return token ? verifyToken(token, useRuntimeConfig().adminPW) : ''
}
