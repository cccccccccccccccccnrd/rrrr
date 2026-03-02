<template>
  <div class="flex flex-col gap-4 p-2">
    <div class="flex flex-col rounded-lg gap-4 border border-current p-4">
      <h1 class="text-4xl leading-none">Create PDF</h1>
      <h3 class="text-3xl font-serif">Previews available for edit</h3>
      <!-- <label class="flex flex-row gap-4 text-3xl font-serif">
        <input type="file" @change="handleFiles" webkitdirectory directory multiple class="hidden" />
        <p class="border-b border-dotted w-fit hover:bg-white hover:text-black cursor-pointer">Upload html</p>
        <p v-if="!uploads.length">-</p>
        <p v-if="!uploads.length">no html uploaded</p>
      </label> -->
      <div class="mb-0">
        <div v-for="article in visibleArticles" :key="article.id" class="mt-4 flex gap-4">
          <span class="opacity-50 shrink-0 font-mono">{{ article.date?.slice(0, 10).split('-').reverse().join('-')
          }}</span>
          <NuxtLink target="_blank" :to="`/pdf/${article.id}`"
            class="border-b border-dotted w-fit hover:bg-white hover:text-black cursor-pointer">
            {{ article.id.length > 80 ? article.id.substring(0, 80) + '...' : article.id }} ↗
          </NuxtLink>
        </div>
        <button v-if="showMoreVisible"
          class="mt-4 break-keep cursor-pointer hover:bg-white hover:text-black whitespace-nowrap p-2 font-[m] text-[12px] uppercase"
          @click="showMore">Show more</button>
      </div>
    </div>
  </div>
</template>

<script setup>

const content = useContent()
const articles = content.value.pages.articles.map(a => ({
  id: a.id.replace('articles/', ''),
  date: a.content.published
})).reverse()

const visibleCount = ref(5)
const visibleArticles = computed(() => articles.slice(0, visibleCount.value))
const showMoreVisible = computed(() => visibleCount.value < articles.length)
const remainingCount = computed(() => articles.length - visibleCount.value)

function showMore() {
  visibleCount.value += 10
}

</script>
