<template>
  <div>
    <div id="pdf-content" :style="{ display: 'none' }">
      <ArticlePdf :article="article" />
    </div>
    <div id="pdf-preview"></div>
    <ArticleLayouter />
    <div class="w-full h-16 fixed bottom-0 left-0 flex flex-row justify-center items-center gap-4 z-50">
      <div class="bg-black/60 backdrop-blur p-3 rounded-full border flex flex-row gap-4">
        <CssEditor :article-id="route.params.id" />
        <ElementInspector />
        <PdfDownload />
      </div>
    </div>
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