<template>
  <div
    class="article-preview"
  >
    <NuxtLink
      :to="article.id"
    >
      <img
        v-if="article.content.cover.length > 0"
        :src="article.content.cover[0].url"
        class="cover"
        :class="{ 'bottom': bottom }"
      >
      <h1 class="title">{{ article.title }}</h1>
      <p class="author">{{ article.content.author.length > 0 ? article.content.author[0].text : 'No author' }}</p>
      <!-- <br>
      <p>{{ article.content.abstract }}</p> -->
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    article: Object,
    bottom: Boolean
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
  p {
    margin: 0;
  }

  .article-preview {
    position: relative;
    margin: 0 0 1em 0;
  }

  .article-preview:hover .title {
    filter: blur(1.5px);
  }

  .article-preview:hover .author {
    filter: blur(2px);
    opacity: 0.6;
  }

  .article-preview:hover .cover {
    opacity: 1;
    z-index: 99999;
    filter: blur(0px);
  }

  .title {
    max-width: 500px;
  }

  .author {
    font-family: sans-serif;
    font-weight: 400;
    text-transform: uppercase;
    max-width: 500px;
  }

  .cover {
    position: absolute;
    top: 0.666em;
    right: 0.666em;
    max-width: 400px;
    z-index: 9999;
    filter: blur(5px);
    opacity: 0;
  }

  .cover.bottom {
    top: inherit;
    bottom: 0.666em;
  }
</style>
