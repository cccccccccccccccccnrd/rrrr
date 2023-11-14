<template>
  <div
    class="fixed top-0 left-0 z-[100] max-h-screen flex flex-col overflow-hidden"
  >
    <header>
      <div>
        <NuxtLink v-if="c.current.title" to="/" class="group"
          ><span class="text-base leading-none">⟵ </span>
          <span class="opacity-0 group-hover:opacity-100"
            >overview</span
          ></NuxtLink
        >
      </div>
      <div v-if="!isMobile">{{ c.current.title }}</div>
      <div
        @click="overlay ? (overlay = false) : (overlay = true)"
        class="break-keep cursor-pointer"
      >
        rrrreflect{{ overlay ? ' ●' : ' ○' }}<span></span>
      </div>
    </header>
    <div
      class="overlay flex column font-serif text-white overflow-hidden grow"
      :style="`${overlay ? 'height: auto;' : 'height: 0px; padding: 0;'}`"
    >
      <div class="w-full flex justify-end">
        <div
          class="group w-full md:w-[50%] bg-black p-3 justify-self-end hover:bg-white hover:text-black overflow-y-auto"
        >
          <p class="sans-serif-uppercase">About rrrreflect</p>
          <div class="mb-4" v-html="c.pages.about.about"></div>
          <div v-html="c.pages.about.extended"></div>
          <p class="sans-serif-uppercase mt-4">Publisher</p>
          <div class="mb-4 flex gap-4">
            <div v-html="c.pages.about.edition"></div>
            <img
              class="max-w-[120px] h-full invert cursor-pointer group-hover:invert-0 opacity-80"
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
            <p>ty ~ <a href="https://getkirby.com/" target="_blank">Kirby</a> and <a href="https://abcdinamo.com/" target="_blank">DINAMO</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const c = useContent()
const overlay = ref(false)
const { isMobile } = useDevice()
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3em;
  padding: 1em;
  font-family: 'm', monospace;
  font-size: 12px;
  gap: 1em;
  color: #f6f6f6;
  background: black;
  text-transform: uppercase;
  z-index: 100;
  user-select: none;
}

:deep(p a) {
  line-height: 0.5;
  border-bottom: 1px dotted;
}

:deep(ul) {
  columns: 2;
  list-style-position: inside;
  list-style-type: '– ';
}
</style>
