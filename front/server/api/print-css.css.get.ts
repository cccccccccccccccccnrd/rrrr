import { getPrintCss } from '../utils'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/css')
  return await getPrintCss()
})
