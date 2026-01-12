export async function request (path: string, options: any = {}) {
  const config = useRuntimeConfig()
  const response = await fetch(`${config.baseURL}/api/${path}`, {
    headers: {
      Authorization: config.auth,
      ...options.headers
    },
    ...options
  })
  const json: any = await response.json()
  return options.raw ? json : json.data
}