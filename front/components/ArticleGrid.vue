<template>
  <div v-if="type === 'pdf'" class="grid" :class="type">
    <R class="mb-5" />
    <div class="title">
      <p class="sans-serif-uppercase">
        {{ article.author }}
      </p>
      <h2>{{ article.title }}</h2>
    </div>
    <div>
      <p class="sans-serif-uppercase">Abstract</p>
      <p>{{ article.abstract }}</p>
    </div>
    <div class="grid-inner">
      <div>
        <p class="sans-serif-uppercase">Published</p>
        {{
          new Date(article.published).toLocaleDateString('en-uk', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }}
      </div>
      <div>
        <p class="sans-serif-uppercase" v-if="article.context">Context</p>
        {{ article.context }}
      </div>
      <div>
        <p class="sans-serif-uppercase">Citation Suggestion</p>
        {{ article.suggestion }}
      </div>
      <div>
        <p class="sans-serif-uppercase">DOI</p>
        {{ article.doi }}
      </div>
      <div>
        <p class="sans-serif-uppercase">License</p>
        {{ article.license }}
      </div>
      <div>
        <p class="sans-serif-uppercase">Online</p>
        <a :href="url">
          {{ url }}
        </a>
      </div>
    </div>
  </div>
  <div v-else class="grid" :class="type">
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
        <p class="sans-serif-uppercase">Edition</p>
        <NuxtLink :to="`/${category.id.replace('categories/', '')}`">
          <div :style="`background: ${category.content.color}`"
            class="hover:scale-[3] p-1 w-fit transition-all ease-out origin-left">
            {{ category.title }}
          </div>
        </NuxtLink>
      </div>
      <div v-if="article.context" class="cell">
        <p class="sans-serif-uppercase">Context</p>
        {{ article.context }}
      </div>
      <div class="cell tags">
        <p class="sans-serif-uppercase">Tags</p>
        <div>
          <div v-for="(tag, index) in article.tags" :key="`tag-${index}`" class="bg-black text-white p-1">
            {{ tag }}{{ index < article.tags.length - 1 ? ',' : '' }} </div>
          </div>
        </div>
        <div v-if="article.download" class="cell">
          <p class="sans-serif-uppercase">Download</p>
          <a class="hover:underline" :href="article.download">{{ article.download.split('/').pop() }}</a>
        </div>
      </div>
      <div class="column main">
        <div class="cell entry">
          <p class="sans-serif-uppercase">
            {{ article.author }}
          </p>
          <p class="text-4xl">{{ article.title }}</p>
        </div>
        <div class="cell">
          <p class="sans-serif-uppercase">Abstract</p>
          <p>{{ article.abstract }}</p>
        </div>
      </div>
      <div class="column">
        <div v-if="article.doi" class="cell">
          <p class="sans-serif-uppercase">DOI</p>
          <a :href="`https://doi.org/${article.doi}`" target="_blank">{{ article.doi }}</a>
        </div>
        <div class="cell">
          <p class="sans-serif-uppercase">License</p>
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">{{ article.license }}</a>
        </div>
        <div class="cell">
          <p class="sans-serif-uppercase">Citation Suggestion</p>
          <p>{{ article.suggestion }}</p>
        </div>
        <div class="cell">
          <p class="sans-serif-uppercase">Author{{ article.author.split('').includes(',') ? 's' : '' }}</p>
          <p>{{ article.author }}</p>
        </div>
        <div v-if="article.correction" class="cell">
          <p class="sans-serif-uppercase">Text correction</p>
          <p>{{ article.correction }}</p>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: false
  }
})
const route = useRoute()
const c = useContent()

const url = computed(() => {
  return `www.rrrreflect.org/articles/${String(route.params.id)}`
})

//@ts-ignore
const category = c.value.pages.categories.find((category) => category.id === props.article.category)
</script>

<style scoped>
.grid {
  display: flex;
  margin: 0 0 calc(0.666em * 2) 0;
  page-break-after: always;
  /* border-bottom: var(--border); */
  /* box-shadow: 0 0 10em rgba(0, 0, 0, 0.1); */
  /* background: rgba(0, 0, 0, 1); */
}

.grid .title {
  /* max-width: 50%; */
  margin: 0 0 calc(0.666em * 2) 0;
}

.grid.pdf {
  display: block;
  margin: 0 0 calc(0.666em * 2) 0;
  padding: calc(0.666em * 2);
  color: #f6f6f6;
  background: black;
}

.grid.pdf a {
  color: #f6f6f6;
}

.grid-inner {
  margin: calc(0.666em * 2) 0 0 0;
  columns: 2;
}

.grid-inner>div {
  margin: 0 0 calc(0.666em * 1) 0;
  page-break-inside: avoid;
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

.column:nth-child(2) {
  width: 100%;
  max-width: calc(600px + calc(0.666em * 2));
  flex: 1;
}

.cell .heading {
  margin: 0;
  font-size: 1.25em;
}

.cell.tags>div {
  display: flex;
  flex-flow: row wrap;
}

.tag {
  width: fit-content;
  padding: 0.3em 0.4em;
  border-radius: 3px;
  margin: 0.2em 0.2em 0 0;
  background: rgba(0, 0, 0, 1);
  color: white;
  font-family: 'i';
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .grid {
    flex-flow: column nowrap;
  }

  .column {
    display: none;
  }

  .column.main {
    display: block;
  }
}
</style>
