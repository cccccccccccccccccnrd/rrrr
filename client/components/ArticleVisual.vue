<template>
  <div
    class="article visual"
  >
    <ArticleGrid
      :article="article"
    />
    <!-- <img
      v-if="article.cover.length > 0"
      :src="article.cover[0].url"
      class="cover"
    > -->
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
              Literature
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
  name: 'ArticleVisual',
  props: {
    article: Object
  },
  data () {
    return {
      literature: []
    }
  },
  methods: {
    log (e) {
      console.log(e)
    },
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
        return [...div.querySelectorAll('sup')].map(e => e.innerText.match(/\d+/)[0]).map(n => `<span class="sans-serif-uppercase">${n}.</span> ${literature[n - 1]}`)
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

  .grid {
    display: flex;
    margin: 0 0 calc(0.666em * 2) 0;
    /* border-bottom: var(--border); */
    /* box-shadow: 0 0 10em rgba(0, 0, 0, 0.1); */
    /* background: rgba(0, 0, 0, 1); */
  }

  .cover {
    width: 100%;
  }

  .cell {
    padding: 0.666em;
    /* border-bottom: var(--border); */
    flex-grow: 1;
    flex: 1;
    /* box-shadow: 0 0 1em rgba(0, 0, 0, 0.3); */
  }

  .column {
    flex: 0.5;
    /* border-right: var(--border);
    border-bottom: var(--border); */
  }

  .column:last-of-type {
    border-right: 0;
  }

  .column:nth-child(2) {
    width: 100%;
    max-width: calc(600px + calc(0.666em * 2));
    flex: 1;
  }

  .cell .heading {
    margin: 0;
    font-size: 1.25em;
  }

  .cell.tags > div {
    display: flex;
    flex-flow: row wrap;
  }

  .tag {
    padding: 0.15em 0.4em;
    border: 1px solid black;
    border-radius: 3px;
    margin: 0.15em 0.15em 0 0;
    background: black;
    color: white;
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
    max-width: 50%;
    margin: 0.666em 0;
    font-size: 0.9em;
    opacity: 0.6;
    animation: blend-in 1s;
  }

  .side-literature:hover {
    opacity: 1;
    cursor: pointer;
  }
</style>
