<template>
  <div
    class="page page-authors"
  >
    <AuthorPreview
      v-for="(author, index) in authors"
      :key="`author-${index}`"
      :author="author"
      :bottom="index > (authors.length - 1) / 2"
    />
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
    authors () {
      return this.pages('authors')
    }
  }
}
</script>

<style>
.page-authors {
  display: flex;
  flex-flow: column wrap;
  padding: 0.666em;
  gap: 0.666em;
}
</style>
