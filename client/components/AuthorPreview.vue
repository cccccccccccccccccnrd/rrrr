<template>
  <div
    class="author-preview"
  >
    <div
      class="author-header"
      @click="open = !open"
    >
      <h1>{{ author.title }}</h1>
      <img
        :src="author.content.profile[0].image.url"
        class="cover"
        :class="{ 'bottom': bottom, 'open': open }"
      >
    </div>
    <div
      v-if="open"
      class="author-body"
    >
      <div class="biography">
        <p>{{ author.content.biography }}</p>
      </div>
      <p class="sans-serif-uppercase">
        Links
      </p>
      <div class="socials">
        <a
          v-for="(social, index) in author.content.socials"
          :key="`social-${index}`"
          :href="social.url"
          target="_blank"
        >{{ social.title }}</a>
      </div>
      <p class="sans-serif-uppercase">
        Contributions
      </p>
      <div class="contributions">
        <NuxtLink
          v-for="(contribution, index) in contributions"
          :key="`contribution-${index}`"
          :to="contribution.id"
        >{{ contribution.title }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    author: Object,
    bottom: Boolean
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    ...mapGetters({
      pages: 'pages/get'
    }),
    articles () {
      return this.pages('articles')
    },
    contributions () {
      return this.articles.filter((article) => {
        if (article.content.author.length > 0) {
          if (article.content.author[0].id === this.author.id) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .author-preview {
    position: relative;
    margin: 0 0 0.666em 0;
  }

  a {
    display: block;
  }

  .author-header {
    max-width: 500px;
    cursor: pointer;
    user-select: none;
  }

  .author-header h1 {
    font-family: sans-serif;
    font-size: 3em;
    font-weight: 400;
    text-transform: uppercase;
  }

  .author-body {
    max-width: 500px;
  }

  img {
    max-width: 100%;
    margin: 0 0 0.666em 0;
  }

  .biography, .socials, .contributions {
    margin: 0 0 0.666em 0;
  }

  .socials {
    display: flex;
  }

  .socials a {
    margin: 0 0.333em 0 0;
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

  .cover.open {
    filter: blur(0px);
    opacity: 1;
  }

  .cover.bottom {
    top: inherit;
    bottom: 0.666em;
  }

  .author-preview:hover .cover {
    opacity: 1;
    z-index: 99999;
    filter: blur(0px);
  }
</style>
