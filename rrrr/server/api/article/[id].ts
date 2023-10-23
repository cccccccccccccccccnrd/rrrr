import { request } from '../../utils'

export default defineEventHandler(async event => {
  const id = event.context.params?.id

  const article = await request(`pages/articles+${id}`)
  const files = await request(`pages/articles+${id}/files`)

  return {
    ...article.content,
    text: article.content.text.map(b => {
      if (b.type === 'gallery') {
        return {
          ...b,
          content: {
            ...b.content,
            images: b.content.images.map(i => files.find(f => f.id === i.id))
          }
        }
      } else {
        return b
      }
    })
  }
})
