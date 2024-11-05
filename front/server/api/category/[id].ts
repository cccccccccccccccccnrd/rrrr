import { request } from '../../utils'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const articles = await request('pages/articles/children?select=id,title,content')
  const category = await request(`pages/categories+${id}`)
  return {
    ...category,
    articles: articles.filter((a) => a.content.category === `categories/${id}`)
  }
})
