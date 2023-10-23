import { request } from '../utils'

export default defineEventHandler(async (event) => {
  const pages = {
    about: await load('about'),
    articles: await load('articles'),
    authors: await load('authors')
  }

  return {
    pages
  }
})

async function load (id: string) {
  switch (id) {
    case 'about': {
      const response = await request('pages/about')
      /* @ts-ignore */
      return response.content
    }
    case 'articles': {
      const response = await request('pages/articles/children?select=id,title,content')
      console.log(response)
      /* @ts-ignore */
      const sorted = response.sort((a, b) => new Date(a.content.published) - new Date(b.content.published))
      return sorted
    }
    case 'authors': {
      return await request('pages/authors/children?select=id,title,content')
    }
  }
}