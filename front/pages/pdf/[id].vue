<template>
  <div>
    <div id="pdf-content" :style="{ display: 'none' }">
      <ArticlePdf :article="article" />
    </div>
    <div id="pdf-preview"></div>
    <ArticleLayouter />
    <div class="fixed top-0 inset-x-0 z-50 flex justify-between items-center bg-black text-white font-[m] text-[12px] uppercase">
      <div class="flex items-center min-w-0">
        <NuxtLink to="/admin" class="p-2 shrink-0 bg-white text-black">PDF editor</NuxtLink>
        <span class="p-2 truncate">{{ article?.title }}</span>
      </div>
      <div class="flex items-center shrink-0">
        <span v-if="status.text" class="p-2" :class="{ 'text-red-400': status.error }">{{ status.text }}</span>
        <span v-else-if="isRefreshing" class="p-2 opacity-60">Rendering…</span>
        <ElementInspector />
        <CssEditor :article-id="route.params.id" />
        <PdfDownload />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
})

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
const { status } = usePrintCss()
const { isRefreshing } = usePdfPreview()
</script>