import { request } from '../utils'

export default defineEventHandler(async (event) => {
  const about = await load('about')
  const articles = await load('articles')
  const authors = await load('authors')
  const categories = await load('categories')

  return {
    about,
    articles,
    authors,
    categories: categories.map((c) => ({
      ...c,
      articles: articles.filter((a) => a.content.category === c.id)
    }))
  }
})

async function load(id: string) {
  switch (id) {
    case 'about': {
      const response = await request('pages/about')
      /* @ts-ignore */
      return response.content
    }
    case 'articles': {
      const response = await request('pages/articles/children?select=id,title,content')
      /* @ts-ignore */
      const sorted = response.sort((a, b) => new Date(a.content.published) - new Date(b.content.published))
      return sorted
    }
    case 'authors': {
      return await request('pages/authors/children?select=id,title,content')
    }
    case 'categories': {
      const response = await request('pages/categories/children?status=all&select=id,title,status,content')
      const sorted = response.reverse()
      return sorted
    }
  }
}
