<template>
  <div
    class="page page-articles"
  >
    <div
      v-for="(article, index) in articles"
      :key="`article-${index}`"
    >
      <ArticlePreview
        :article="article"
        :bottom="index > (articles.length - 1) / 2"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'IndexPage',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      pages: 'pages/get'
    }),
    articles () {
      return this.pages('articles')
    }
  }
}
</script>

<style>
.page-articles {
  flex-flow: column nowrap;
  padding: 0.666em;
}
</style>
