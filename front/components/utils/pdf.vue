<template>
  <div class="flex flex-col gap-4 p-2">
    <div class="flex flex-col rounded-lg gap-4 border border-current p-4">
      <h3 class="text-3xl font-serif">Available PDFs for preview</h3>
      <!-- <label class="flex flex-row gap-4 text-3xl font-serif">
        <input type="file" @change="handleFiles" webkitdirectory directory multiple class="hidden" />
        <p class="border-b border-dotted w-fit hover:bg-white hover:text-black cursor-pointer">Upload html</p>
        <p v-if="!uploads.length">-</p>
        <p v-if="!uploads.length">no html uploaded</p>
      </label> -->
      <div class="mb-0">
        <div v-for="article in visibleArticles" :key="article" class="mt-4">
          <NuxtLink target="_blank" :to="`/pdf/${article}`"
            class="border-b border-dotted w-fit hover:bg-white hover:text-black cursor-pointer">
            {{ article.length > 80 ? article.substring(0, 80) + '...' : article }}
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
const articleIds = content.value.pages.articles.map(a => a.id.replace('articles/', ''))

const visibleCount = ref(5)
const visibleArticles = computed(() => articleIds.slice(0, visibleCount.value))
const showMoreVisible = computed(() => visibleCount.value < articleIds.length)
const remainingCount = computed(() => articleIds.length - visibleCount.value)

function showMore() {
  visibleCount.value += 10
}

</script>
