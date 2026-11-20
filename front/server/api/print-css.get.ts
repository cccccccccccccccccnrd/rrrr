import { getPrintCss } from '../utils'

export default defineEventHandler(async () => ({ content: await getPrintCss() }))
