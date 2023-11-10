<template>
  <div
    class="article hybrid"
  >
    <ArticleGrid
      :article="article"
    />
    <article>
      <div
        v-for="(block, bi) in article.text"
        :key="`block-${bi}`"
        :class="block.type"
        class="block"
      >
        <div class="left side" />
        <div class="mid">
          <ArticleGallery
            v-if="block.type === 'gallery'"
            :images="block.content.images"
            :type="block.content.type"
          />
          <div
            v-if="block.type === 'text'"
            v-html="block.content.text"
          />
          <div
            v-if="block.type === 'heading'"
          >
            <h2 v-if="block.content.level === 'h2'">
              {{ block.content.text }}
            </h2>
            <h3 v-if="block.content.level === 'h3'">
              {{ block.content.text }}
            </h3>
          </div>
          <figure
            v-if="block.type === 'image'"
          >
            <img
              :src="block.content.image[0].url"
            >
            <figcaption><span class="sans-serif-uppercase">FIG {{ getFigNo(block) }}</span> {{ block.content.caption }}</figcaption>
          </figure>
        </div>
        <div class="right side">
          <div
            v-if="block.type === 'text'"
          >
            <p
              v-for="(lit, li) in getLiterature(block)"
              :key="`side-literature-${li}`"
              class="side-literature"
              v-html="lit"
            />
          </div>
        </div>
      </div>
      <div class="article-footer">
        <div class="block">
          <div class="left side" />
          <div class="mid">
            <p class="sans-serif-uppercase">
              References
            </p>
            <div
              v-html="article.literature"
            />
          </div>
          <div class="right side" />
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'ArticlePage',
  props: {
    article: Object
  },
  data () {
    return {
      literature: []
    }
  },
  methods: {
    parseLiterature (string) {
      const div = document.createElement('DIV')
      div.innerHTML = string
      return [...div.querySelectorAll('li')].map(e => e.innerText)
    },
    getLiterature (block) {
      if (process.client) {
        const literature = this.parseLiterature(this.article.literature)
        const div = document.createElement('DIV')
        div.innerHTML = block.content.text
        return new Set([...div.querySelectorAll('sup')].map(e => e.innerText.match(/\d+/)[0]).map(n => `<span class="sans-serif-uppercase">${n}.</span> ${literature[n - 1]}`))
      } else {
        return []
      }
    },
    getFigNo (block) {
      const images = this.article.text.filter(b => b.type === 'image')
      const index = images.indexOf(block)
      return index + 1
    }
  }
}
</script>

<style scoped>
  .page-article {
    width: 100%;
    flex-flow: column nowrap;
    justify-content: center;
  }

  article {
    display: flex;
    flex-flow: column nowrap;
  }

  ::v-deep article img:not(.gallery-img) {
    --width: 60vw;
    width: var(--width);
    max-width: 100vw;
    margin-left: calc(50% - calc(var(--width) / 2));
  }

  .article-footer {
    margin: 0.666em 0;
  }

  ::v-deep .footnotes p {
    margin: 0.333em 0;
  }

  .block {
    width: 100%;
    display: flex;
  }

  .block .mid {
    width: 100%;
    max-width: calc(600px + calc(0.666em * 2));
    flex: 1;
  }

  .block .side > * {
    max-width: 400px;
  }

  .block > div {
    flex: 0.5;
    padding: 0.666em;
  }

  .block.heading > div {
    padding: 0.666em 0.666em 0 0.666em;
  }

  ::v-deep .block p:not(:first-of-type) {
    margin: 0.666em 0 0 0;
  }

  .side-literature {
    display: -webkit-box;
    -webkit-line-clamp: 10;
    -webkit-box-orient: vertical;
    max-width: 66%;
    margin: 0.666em 0;
    font-size: 0.9em;
    word-break: break-word;
    text-overflow: ellipsis;
    opacity: 0.6;
    animation: blend-in 1s;
    overflow: hidden;
    transition: all 1s ease-in-out;
  }

  .side-literature:hover {
    position: absolute;
    -webkit-line-clamp: 100;
  }

  .side-literature:hover {
    opacity: 1;
    cursor: pointer;
  }
</style>
