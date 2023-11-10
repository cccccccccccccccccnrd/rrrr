import fetch from 'node-fetch'

export async function request (path: string) {
  console.log(useRuntimeConfig().baseURL, useRuntimeConfig().auth)
  const response = await fetch(`${useRuntimeConfig().baseURL}/api/${path}`, {
    headers: {
      Authorization: `${useRuntimeConfig().auth}`
    }
  })
  const json: any = await response.json()
  return json.data
}