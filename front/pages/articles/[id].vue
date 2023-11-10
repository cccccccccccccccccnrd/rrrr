<template>
  <div>
    <div class="w-full flex justify-center">
      <ArticleHybrid :article="article" class="max-w-[1400px] mt-9" />
    </div>
  </div>
</template>

<script setup>
useHead({
  bodyAttrs: {
    class: 'article'
  }
})
const route = useRoute()
const { data: article } = await useFetch(`/api/article/${route.params.id}`)
const c = useContent()
c.value.current = article
</script>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1em;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  gap: 1em;
  color: #f6f6f6;
  background: black;
  text-transform: uppercase;
  font-weight: bold;
  z-index: 100;
}
</style>
