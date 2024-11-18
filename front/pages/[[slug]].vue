<template>
  <div class="flex flex-col justify-between">
    <div class="mb-4 flex flex-col gap-4">
      <div v-for="category in categories" class="flex flex-col rounded-lg gap-4">
        <NuxtLink class="text-4xl py-4 pb-0 leading-none" :to="`/${category.id.replace('categories/', '')}`">{{
          category.title
        }}</NuxtLink>
        <div
          v-if="categories.length === 1 && category.content.description"
          class="font-[m] text-[12px] leading-normal flex flex-col gap-2 [&>p]:leading-snug"
          v-html="category.content.description"
        ></div>
        <NuxtLink
          v-for="a in category.articles"
          class="leading-none cursor-pointer last-of-type:pb-4"
          @mouseenter="handleMouseEnter($event)"
          @mouseover="current = a.content.cover[0].url"
          @mouseleave="current = ''"
          :to="`/${a.content.category.replace('categories/', '')}/${a.id.replace('articles/', '')}`"
        >
          <div>
            <p class="leading-none font-serif text-3xl">{{ a.title }}</p>
            <p class="mt-1 sans-serif text-base leading-none">
              {{ a.content.author }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
  <div class="fixed bottom-0 left-0 w-full h-full z-[10] flex items-center justify-center pointer-events-none">
    <img
      class="w-[50vw] max-w-[600px]"
      :src="current"
      :style="`transform: translate(${(x - xO) / oO}px, ${(y - yO) / oO}px);`"
    />
  </div>
</template>

<script setup>
const route = useRoute()
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
