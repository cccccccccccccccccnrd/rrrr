import crypto from 'crypto'

const generateToken = (secret: string): string => {
  const timestamp = Date.now()
  const data = `admin:${timestamp}`
  const signature = crypto.createHmac('sha256', secret).update(data).digest('hex')
  return `${data}:${signature}`
}

export const verifyToken = (token: string, secret: string, maxAge = 3600000): boolean => {
  const parts = token.split(':')
  if (parts.length !== 3) return false

  const [prefix, timestamp, signature] = parts
  const data = `${prefix}:${timestamp}`

  // Verify signature
  const expected = crypto.createHmac('sha256', secret).update(data).digest('hex')
  if (signature !== expected) return false

  // Check expiry
  const tokenTime = parseInt(timestamp, 10)
  if (Date.now() - tokenTime > maxAge) return false

  return true
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Same accounts as the Kirby Panel (needs api.basicAuth); ADMIN_PW is only the cookie signing secret now
  const kirby = await fetch(`${config.baseURL}/api/auth`, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${body.email}:${body.password}`).toString('base64') }
  })

  if (kirby.ok) {
    const token = generateToken(config.adminPW)

    setCookie(event, 'admin-auth', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    })

    return { success: true }
  }

  throw createError({ statusCode: 401, statusMessage: 'Invalid login' })
})
