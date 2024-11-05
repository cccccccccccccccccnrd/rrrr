<template>
  <div class="flex flex-col justify-between">
    <div class="mx-4 flex flex-col gap-4">
      <div v-for="category in categories" class="flex flex-col border border-gray-500 rounded-lg">
        <p class="text-4xl p-4 leading-none">{{ category.title }}</p>
        <p v-if="categories.length === 1" class="font-[m] text-[12px] p-4 border-y border-gray-500 leading-snug">
          {{ category.content.description }}
        </p>
        <NuxtLink
          v-for="a in category.articles"
          class="leading-none cursor-pointer px-4 pt-4 last-of-type:pb-4"
          :class="{
            'first-of-type:pt-0': categories.length !== 1
          }"
          @mouseenter="handleMouseEnter($event)"
          @mouseover="current = a.content.cover[0].url"
          @mouseleave="current = ''"
          :to="`/${a.content.category.replace('categories/', '')}/${a.id.replace('articles/', '')}`"
        >
          <div>
            <p class="leading-none font-serif text-3xl">{{ a.title }}</p>
            <p class="mt-1 sans-serif text-base leading-none">
              {{ a.content.author[0].text }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
  <div class="fixed bottom-0 left-0 w-full h-full z-[10] flex items-center justify-center pointer-events-none">
    <img
      class="w-[50vw] max-w-[800px]"
      :src="current"
      :style="`transform: translate(${(x - xO) / oO}px, ${(y - yO) / oO}px);`"
    />
  </div>
</template>

<script setup>
const route = useRoute()
console.log(route.params.slug)
const { x, y } = useMouse()
const c = useContent()
c.value.current = {}

const categories =
  route.params.slug !== ''
    ? c.value.pages.categories.filter((category) => category.id.replace('categories/', '') === route.params.slug)
    : c.value.pages.categories

const current = ref('')
const xO = ref(0)
const yO = ref(0)
const oO = ref(10)

function handleMouseEnter(event) {
  xO.value = event.target.offsetLeft
  yO.value = event.target.offsetTop
}
</script>

<style scoped>
::selection {
  color: black;
  background: #f6f6f6;
}
</style>
