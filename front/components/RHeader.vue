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
          >{{ short(category.title) }}</NuxtLink
        >
      </div>
      <div v-if="!isMobile" class="mx-2 overflow-hidden whitespace-nowrap text-ellipsis">
        {{ c.current.title }}
      </div>
      <div
        @click="overlay = !overlay"
        id="over-btn"
        class="break-keep cursor-pointer hover:bg-white hover:text-black whitespace-nowrap"
        :class="{ 'bg-white text-black': overlay }"
      >
        rrrreflect{{ overlay ? ' ●' : ' ○' }}
      </div>
    </div>
    <div class="relative">
      <R class="mb-2 mt-4 cursor-pointer" @click="navigateTo('/')" />
      <div
        ref="over"
        class="overlay absolute top-0 right-0 flex font-serif text-white overflow-hidden grow w-full md:w-[55%]"
        :style="`${overlay ? 'height: auto;' : 'height: 0px; padding: 0;'}`"
      >
        <div class="group bg-white text-black p-3 justify-self-end overflow-y-auto">
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
  </header>
</template>
<script setup>
const { isMobile } = useDevice()
const c = useContent()
const overlay = ref(false)
const over = ref(null)

function short(title) {
  const t = title.split(' ').slice(0, 3).join(' ')
  return t.endsWith(':') ? t.replace(':', '') : t
}

onClickOutside(over, (event) => {
  if (event.target.id !== 'over-btn') {
    overlay.value = false
  }
})
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
