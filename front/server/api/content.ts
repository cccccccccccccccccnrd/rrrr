// @ts-nocheck

import { request, isAdmin } from '../utils'

export default defineEventHandler(async event => {
  const about = await load('about')
  // drafts only for logged-in admins (pdf editor); the public gets listed + unlisted
  const articles = await load(isAdmin(event) ? 'articlesAndDrafts' : 'articles')
  const authors = await load('authors')
  const categories = await load('categories')

  return {
    about,
    articles,
    authors,
    categories: categories.map(c => ({
      ...c,
      articles: articles.filter(a => a.content.category === c.id)
    }))
  }
})

async function load(id: string) {
  switch (id) {
    case 'about': {
      const response = await request('pages/about')
      return response.content
    }
    case 'articles':
    case 'articlesAndDrafts': {
      const status = id === 'articles' ? 'published' : 'all'
      const response = await request(`pages/articles/children?status=${status}&select=id,title,status,content`)
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
