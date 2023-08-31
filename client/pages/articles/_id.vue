<template>
  <div
    class="page page-article"
  >
    <div
      id="scroller"
      :style="`transform: rotate(-${scroll}deg);`"
      @click="scrollTop"
    >
      ZZZ
    </div>
    <ArticleHybrid
      :article="article"
    />
  </div>
</template>

<script>
export default {
  name: 'ArticlePage',
  async asyncData ({ params, $http }) {
    const { data: article } = await $http.$get(`pages/articles+${params.id}`)
    const { data: files } = await $http.$get(`pages/articles+${params.id}/files`)

    return {
      article: {
        ...article.content,
        text: article.content.text
          .map((b) => {
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
    }
  },
  data () {
    return {
      scroll: 0
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    scrollTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleScroll () {
      this.scroll = window.scrollY
    }
  }
}
</script>

<style scoped>
  #scroller {
    position: fixed;
    right: 0.666rem;
    bottom: 0.666rem;
    font-family: sans-serif;
    font-weight: 400;
    font-size: 2em;
    color: white;
    line-height: 1;
    mix-blend-mode: difference;
    cursor: pointer;
    transition: none;
  }
</style>
