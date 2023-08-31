<template>
  <div class="grid">
    <div class="column">
      <div class="cell">
        <p class="sans-serif-uppercase">Published</p>
        {{
          new Date(article.published).toLocaleDateString('en-uk', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }}
      </div>
      <div class="cell">
        <p class="sans-serif-uppercase">Context</p>
        {{ article.context }}
      </div>
      <div class="cell tags">
        <p class="sans-serif-uppercase">Tags</p>
        <div>
          <div
            v-for="(tag, index) in article.tags"
            :key="`tag-${index}`"
            class="tag"
          >
            {{ tag.value }}
          </div>
        </div>
      </div>
      <div class="cell">
        <p class="sans-serif-uppercase">Download</p>
        <a href="#">
          {{ `${article.title.toLowerCase().replaceAll(' ', '-')}.pdf` }}
        </a>
      </div>
    </div>
    <div class="column">
      <div class="cell entry">
        <p class="sans-serif-uppercase">
          {{ article.author.length > 0 ? article.author[0].text : 'No author' }}
        </p>
        <h1>{{ article.title }}</h1>
      </div>
      <div class="cell">
        <p class="sans-serif-uppercase">Abstract</p>
        {{ article.abstract }}
      </div>
    </div>
    <div class="column">
      <div class="cell">
        <p class="sans-serif-uppercase">DOI</p>
        {{ article.doi }}
      </div>
      <div class="cell">
        <p class="sans-serif-uppercase">License</p>
        {{ article.license }}
      </div>
      <div class="cell">
        <p class="sans-serif-uppercase">Citation Suggestion</p>
        {{ article.suggestion }}
      </div>
      <div class="cell">
        <p class="sans-serif-uppercase">Author</p>
        {{ article.author.length > 0 ? article.author[0].text : 'No author' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleGrid',
  props: {
    article: Object
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.grid {
  display: flex;
  margin: 0 0 calc(0.666em * 2) 0;
  /* border-bottom: var(--border); */
  /* box-shadow: 0 0 10em rgba(0, 0, 0, 0.1); */
  /* background: rgba(0, 0, 0, 1); */
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
</style>
