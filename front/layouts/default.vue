<template>
  <div class="fixed top-0 left-0 z-[100]">
    <header>
      <div>
        <NuxtLink v-if="c.current.title" to="/" class="group"><span style="font-size: 16px; line-height: 0">⟵</span> <span class="opacity-0 group-hover:opacity-100">overview</span></NuxtLink>
      </div>
      <div>{{ c.current.title }} <span style="font-size: 16px; line-height: 0; display: none;">↑</span></div>
      <div @click="overlay ? (overlay = false) : (overlay = true)" class="cursor-pointer">
        rrrreflect{{ overlay ? ' ●' : ' ○' }} <span></span>
      </div>
    </header>
    <div
      class="overlay flex column font-serif text-white"
      :style="`${overlay ? 'height: auto;' : 'height: 0px; padding: 0;'}`"
    >
      <div class="w-full flex justify-end">
        <div class="w-full md:w-[50%] max-h-screen bg-black p-3 justify-self-end hover:bg-white hover:text-black">
          <p class="sans-serif-uppercase">About rrrreflect</p>
          <p class="mb-4">{{ c.pages.about.about }}</p>
          <p>{{ c.pages.about.extended }}</p>
          <p class="sans-serif-uppercase mt-4">Publisher</p>
          <p class="mb-4">{{ c.pages.about.edition }}</p>
          <div class="committee">
            <p class="sans-serif-uppercase">Advisory Committee</p>
            <div class="flex">
              <div>
                <p>– Prof. Dr. Lasse Scherffig (Coordination)</p>
                <p>– Prof. Dr. Carolin Höfler</p>
                <p>– Simon Meienberg, Doctoral Candidate</p>
              </div>
              <div>
                <p>– David Sieverding, Research Assistant</p>
                <p>– Martin Sistig, Research Assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <slot />
</template>

<script setup>
const { data: content } = await useFetch('/api/content')
const c = useContent()
c.value.pages = content.value.pages
console.log(c.value)
const overlay = ref(false)
const about = ref()

/* onClickOutside(about, (event) => overlay.value = false) */
</script>

<style>
@font-face {
  font-family: 'a';
  src: url('~/assets/fonts/a.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'i';
  src: url('~/assets/fonts/i.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'm';
  src: url('~/assets/fonts/m.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

@keyframes blend-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 0.6;
    transform: translateX(0px);
  }
}

::-webkit-scrollbar {
  /* -webkit-appearance: none; */
  width: 5px;
  height: 5px;
  background: black;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(
    0deg,
    rgba(204, 204, 204, 1) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}

::selection {
  color: black;
  background: #f6f6f6;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'i', 'limousine', sans-serif;
  font-size: 16px;
  font-size: 1.15em;
  line-height: 1;
  background: black;
  color: #f6f6f6;
}

body.article {
  background: #f6f6f6;
  background-image: linear-gradient(315deg, #f6f6f6 0%, #e9e9e9 74%);
  color: black;
  font-family: 'a', serif;
  border-left: 5px solid black;
}

sup {
  font-family: 'i', sans-serif;
  text-transform: uppercase;
  font-size: 0.7em;
  top: -0.4em;
}

h1 {
  margin: 0;
  font-size: 2em;
  font-weight: 300;
}

h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.25em;
}

p {
  margin: 0;
  line-height: 1.2;
}

figcaption {
  margin: 0.5em 0 0 0;
  font-size: 0.8em;
  text-align: left;
  word-wrap: break-word;
}

ol {
  list-style-type: decimal;
}

ol ::marker {
  font-family: 'i', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.sans-serif-uppercase {
  font-family: 'i', sans-serif;
  text-transform: uppercase;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1em;
  font-family: 'm', monospace;
  font-size: 12px;
  gap: 1em;
  color: #f6f6f6;
  background: black;
  text-transform: uppercase;
  font-weight: bold;
  z-index: 100;
  user-select: none;
}

.overlay-rrrr .committee {
  font-size: 0.8em;
}
</style>
