import fetch from 'node-fetch'

export async function request (path: string) {
  const response = await fetch(`${useRuntimeConfig().baseURL}/api/${path}`, {
    headers: {
      Authorization: `${useRuntimeConfig().auth}`
    }
  })
  const json: any = await response.json()
  console.log(json.data)
  return json.data
}