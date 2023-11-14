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
          <p class="mb-4">{{ c.pages.about.about }}</p>
          <p>{{ c.pages.about.extended }}</p>
          <p class="sans-serif-uppercase mt-4">Publisher</p>
          <div class="mb-4 flex gap-4">
            <p>{{ c.pages.about.edition }}</p>
            <img
              class="max-w-[120px] h-full invert cursor-pointer group-hover:invert-0"
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
            <div class="columns-2">
                <p>– Prof. Dr. Lasse Scherffig (Coordination)</p>
                <p>– Prof. Dr. Carolin Höfler</p>
                <p>– Prof. Michael Gais</p>
                <p>– Simon Meienberg, Doctoral Candidate</p>
                <p>– David Sieverding, Research Assistant</p>
                <p>– Martin Sistig, Research Assistant</p>
            </div>
          </div>
          <div class="text-sm">
            <p class="sans-serif-uppercase">rrrreflect Development Team</p>
            <div class="columns-2">
              <p>– Carolin Höfler</p>
              <p>– Yvonne Lober</p>
              <p>– Simon Meienberg</p>
              <p>– Conrad Weise</p>
              <p>– Students of KISD Research AG</p>
            </div>
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

<style>
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

.overlay-rrrr .committee {
  font-size: 0.8em;
}
</style>
