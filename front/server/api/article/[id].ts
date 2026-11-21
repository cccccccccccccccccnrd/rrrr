import { request, isAdmin } from '../../utils'

export default defineEventHandler(async event => {
  const id = event.context.params?.id

  const article = await request(`pages/articles+${id}`)
  if (!article || (article.status === 'draft' && !isAdmin(event))) {
    throw createError({ statusCode: 404 })
  }
  const files = await request(`pages/articles+${id}/files`)

  return {
    ...article.content,
    text: article.content.text.map(b => {
      if (b.type === 'gallery') {
        return {
          ...b,
          content: {
            ...b.content,
            images: b.content.images.map(i =>
              files.find(f => f.filename === i.filename)
            )
          }
        }
      } else {
        return b
      }
    })
  }
})
