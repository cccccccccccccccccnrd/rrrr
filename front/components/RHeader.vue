<template>
  <header class="relative flex flex-col">
    <div class="w-full flex justify-between items-center font-[m] text-[12px] uppercase select-none">
      <div class="flex">
        <NuxtLink
          class="p-2 hover:bg-white hover:text-black overflow-hidden whitespace-nowrap"
          :class="{
            'bg-white text-black':
              $route.params.slug === category.id.replace('categories/', '') ||
              $route.params.category === category.id.replace('categories/', '')
          }"
          v-for="category in c.pages.categories"
          :to="`/${category.id.replace('categories/', '')}`"
          >{{ category.title }}</NuxtLink
        >
      </div>
      <div v-if="!isMobile" class="mx-2 overflow-hidden whitespace-nowrap text-ellipsis">
        {{ c.current.title }}
      </div>
      <div
        @click="overlay ? (overlay = false) : (overlay = true)"
        class="break-keep cursor-pointer hover:bg-white hover:text-black whitespace-nowrap p-2"
        :class="{ 'bg-white text-black': overlay }"
      >
        rrrreflect{{ overlay ? ' ●' : ' ○' }}
      </div>
    </div>
    <div class="relative">
      <R class="mx-3 my-1 mb-3 cursor-pointer" @click="navigateTo('/')" />
      <div
        class="overlay absolute top-0 right-0 flex column font-serif text-white overflow-hidden grow"
        :style="`${overlay ? 'height: auto;' : 'height: 0px; padding: 0;'}`"
      >
        <div class="w-full flex justify-end">
          <div class="group w-full md:w-[55%] bg-white text-black p-3 justify-self-end overflow-y-auto">
            <p class="sans-serif-uppercase">About rrrreflect</p>
            <div class="mb-4" v-html="c.pages.about.about"></div>
            <div v-html="c.pages.about.extended" class="extended"></div>
            <p class="sans-serif-uppercase mt-4">Publisher</p>
            <div class="mb-4 flex gap-4">
              <div v-html="c.pages.about.edition"></div>
              <img
                class="max-w-[120px] h-full cursor-pointer invert-0 opacity-80"
                @click="
                  navigateTo('https://kisd.de', {
                    open: {
                      target: '_blank'
                    },
                    external: true
                  })
                "
                src="@/assets/kisd-th-logo.svg"
              />
            </div>
            <div class="mb-4 text-sm">
              <p class="sans-serif-uppercase">Advisory Committee</p>
              <div v-html="c.pages.about.advisory"></div>
            </div>
            <div class="mb-4 text-sm">
              <p class="sans-serif-uppercase">rrrreflect Development Team</p>
              <div v-html="c.pages.about.development"></div>
            </div>
            <div class="text-sm flex justify-between">
              <p><a href="https://kisd.de/en/imprint/" target="_blank">Imprint</a></p>
              <p>
                ty ~ <a href="https://getkirby.com/" target="_blank">Kirby</a>,
                <a href="https://abcdinamo.com/" target="_blank">DINAMO</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
const c = useContent()
const overlay = ref(false)
const { isMobile } = useDevice()
</script>

<style scoped>
:deep(p a) {
  line-height: 0.5;
  border-bottom: 1px dotted;
}

:deep(.extended p) {
  margin-bottom: 1rem;
}

:deep(ul) {
  columns: 2;
  list-style-position: inside;
  list-style-type: '– ';
}
</style>
