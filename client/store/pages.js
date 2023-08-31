export const state = () => ({
  pages: {}
})

export const getters = {
  get: state => (id) => {
    return state.pages[id]
  }
}

export const mutations = {
  set (state, pages) {
    state.pages = pages
  }
}
