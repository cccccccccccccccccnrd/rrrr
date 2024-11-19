<template>
  <div class="article pdf" :class="$route.params.id">
    <!-- <ArticleGrid
      :article="article"
      type="pdf"
    /> -->
    <p class="meta author">{{ article.author }}</p>
    <p class="meta title">{{ article.title }}</p>
    <article>
      <section>
        <h2 class="title">{{ article.title }}</h2>
        <div class="abstract">
          <p class="sans-serif-uppercase">Abstract</p>
          <p>{{ article.abstract }}</p>
        </div>
        <div
          v-for="(b, bi) in this.article.text"
          :key="`block-${bi}`"
          :id="`block-${bi}`"
          class="block"
          :class="b.type"
        >
          <p v-if="b.type === 'text'" v-html="b.content.text" v-plain />
          <h2 v-if="b.type === 'heading'">
            {{ b.content.text }}
          </h2>
          <blockquote v-if="b.type === 'quote'" v-html="b.content.text"></blockquote>
          <figure v-if="b.type === 'image'">
            <img :src="b.content.image[0].url" />
            <figcaption>
              <span class="sans-serif-uppercase !mr-2">FIG {{ getFigNo(b) }}</span>
              <span v-html="urling(b.content.caption)"></span>
            </figcaption>
          </figure>
          <ArticleGallery v-if="b.type === 'gallery'" :images="b.content.images" :type="b.content.type" />
        </div>
      </section>
      <footer>
        <p class="sans-serif-uppercase">Footnotes</p>
        <div v-html="urling(article.literature)"></div>
        <p class="sans-serif-uppercase references">References</p>
        <div v-html="urling(article.references)" />
      </footer>
    </article>
  </div>
</template>

<script>
export default {
  name: 'ArticlePage',
  props: {
    article: Object
  },
  data() {
    return {
      literature: []
    }
  },
  mounted() {
    console.log(this.article)
  },
  directives: {
    plain: (el) => {
      if (!el) {
        return
      }

      const content = el.tagName === 'TEMPLATE' ? el.content : el
      if (content.children.length === 1) {
        ;[...el.attributes].forEach((attr) => content.firstChild.setAttribute(attr.name, attr.value))
      }

      if (el.tagName === 'TEMPLATE') {
        el.replaceWith(el.content)
      } else {
        el.replaceWith(...el.children)
      }
    }
  },
  computed: {
    blocks() {
      const wow = this.article.text.reduce((acc, curr) => {
        if (acc.length === 0) {
          acc.push([curr])
          return acc
        }

        const last = acc[acc.length - 1]
        if (
          (curr.type === 'text' || curr.type === 'heading') &&
          (last[last.length - 1].type === 'text' || last[last.length - 1].type === 'heading')
        ) {
          last.push(curr)
        } else {
          acc.push([curr])
        }

        return acc
      }, [])

      console.log(wow)
      return wow
    }
  },
  methods: {
    parseLiterature(string) {
      const div = document.createElement('DIV')
      div.innerHTML = string
      return [...div.querySelectorAll('li')].map((e) => e.innerText)
    },
    getLiterature(block) {
      if (process.client) {
        const literature = this.parseLiterature(this.article.literature)
        const div = document.createElement('DIV')
        div.innerHTML = block.content.text
        return [...div.querySelectorAll('sup')]
          .map((e) => e.innerText.match(/\d+/)[0])
          .map((n) => `<span class="sans-serif-uppercase">${n}.</span> ${literature[n - 1]}`)
      } else {
        return []
      }
    },
    getFigNo(block) {
      const images = this.article.text.filter((b) => b.type === 'image')
      const index = images.indexOf(block)
      return index + 1
    },
    urling(string) {
      return string.replace(
        new RegExp(
          /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi
        ),
        "<a href='$1' target='_blank'>$1</a>"
      )
    }
  }
}
</script>

<style scoped>
.meta {
  display: none;
}

.title {
  margin: 0 0 calc(0.666em * 1) 0;
}

.page-article {
  width: 100%;
  flex-flow: column nowrap;
  justify-content: center;
}

article {
  display: flex;
  flex-flow: column nowrap;
}

.article {
  /* padding: calc(0.666em * 2); */
}

section {
  columns: 2;
}

figure {
  width: 100%;
  columns: 1;
  /* margin: 2em 0; */
  display: block;
}

.abstract {
  margin: 0 0 calc(0.666em * 4) 0;
}

.references {
  margin: calc(0.666em * 2) 0 0 0;
}

:deep(blockquote) {
  font-size: 1.1em;
  padding: 0 0 0 calc(4 * 0.666em);
  line-height: 1.2;
}

.block {
  width: 100%;
  /* padding: calc(0.666em * 2); */
}

.block.text,
.block.quote {
  /* columns: 2; */
  margin: 0 0 calc(0.666em * 2) 0;
}

:deep(.block.text p) {
  margin: 0 0 calc(0.666em * 1) 0;
}

.block.heading h1,
.block.heading h2,
.block.heading h3 {
  margin: 0 0 calc(0.666em * 0.5) 0;
}

.block.image {
  margin: 0 0 calc(0.666em * 2) 0;
  columns: 1;
}

footer {
  columns: 2;
  line-height: 1.2;
}

:deep(footer li) {
  text-indent: calc(1 * 0.666em) hanging;
  word-break: break-word;
  font-size: 0.85em;
}

:deep(article img:not(.gallery-img)) {
  /* display: block;
    width: 100%;
    --width: 60vw;
    width: var(--width);
    max-width: 100vw;
    margin-left: calc(50% - calc(var(--width) / 2)); */
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
  margin: calc(0.666em * 2) 0;
}

:deep(li) {
  margin: calc(0.666em * 1) 0;
}

:deep(li p) {
  display: inline;
  margin: calc(0.666em / 2) 0;
  word-break: break-word;
}

:deep(.footnotes-list) {
  list-style-position: inside;
}

.block .mid {
  width: 100%;
  /* max-width: calc(600px + calc(0.666em * 2)); */
  /* flex: 1; */
  columns: 2;
  gap: calc(0.666em * 2);
}

.block.image .mid {
  display: flex;
  justify-content: center;
}

.block .side > * {
  max-width: 400px;
}

.block > div {
  /* flex: 0.5; */
  padding: calc(0.666em * 0);
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
