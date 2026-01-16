<template>
  <div>
    <div id="pdf-content" :style="{ display: 'none' }">
      <ArticlePdf :article="article" />
    </div>
    <div id="pdf-preview"></div>
    <ArticleLayouter />
    <ElementInspector />
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'article'
  }
})
setPageLayout('pdf')

const route = useRoute()
const { data: article } = await useFetch(`/api/article/${route.params.id}`)
const c = useContent()
c.value.current = article
</script>