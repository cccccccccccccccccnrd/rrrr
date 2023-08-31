async function load ($http, id) {
  switch (id) {
    case 'about': {
      const response = await $http.$get('pages/about')
      return response.data.content
    }
    case 'articles': {
      const response = await $http.$get('pages/articles/children?select=id,title,content')
      console.log(response.data)
      const sorted = response.data.sort((a, b) => new Date(a.content.published) - new Date(b.content.published))
      return sorted
    }
    case 'authors': {
      const response = await $http.$get('pages/authors/children?select=id,title,content')
      return response.data
    }
  }
}

export const actions = {
  async nuxtServerInit ({ commit }) {
    const pages = {
      about: await load(this.$http, 'about'),
      articles: await load(this.$http, 'articles'),
      authors: await load(this.$http, 'authors')
    }
    commit('pages/set', pages)
  }
}
