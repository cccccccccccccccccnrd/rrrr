<template>
  <div class="max-w-[1200px] grow w-screen">
    <RHeader />
    <slot />
  </div>
  <div
    v-if="y > 100"
    class="fixed bottom-5 right-5 cursor-pointer text-3xl origin-center w-5 h-5 rounded-full flex justify-center items-center"
    :style="`transform: rotate(-${h}deg); background: linear-gradient(0deg, white 0%, black 100%);`"
    @click="handleClick"
  ></div>
</template>

<script setup>
const route = useRoute()
const { data: content } = await useFetch('/api/content')
const c = useContent()
const { y } = useWindowScroll()
const h = computed(
  () => (y.value / (document.body.scrollHeight - window.innerHeight)) * 100 * (window.innerHeight / 100)
)

c.value.pages = content.value

function handleClick() {
  window.scrollTo(0, 0, { behavior: 'smooth' })
}

watch(
  () => route.fullPath,
  () => {
    const category = c.value.pages.categories.find(
      (category) => category.id.replace('categories/', '') === route.params.slug
    )

    if (category) {
      document.body.style.background = category.content.color
      document.body.style.color = 'black'
    } else {
      document.body.style.background = 'black'
      document.body.style.color = 'white'
    }
  },
  { deep: true, immediate: true }
)
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
  display: none;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(0deg, rgba(204, 204, 204, 1) 0%, rgba(0, 0, 0, 1) 100%);
  display: none;
}

::selection {
  background: black;
  color: #f6f6f6;
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
  scrollbar-width: none;
  scroll-behavior: smooth;
}

body {
  display: flex;
  width: 100vw;
  justify-content: center;
  font-family: 'i', 'limousine', sans-serif;
  font-size: 16px;
  font-size: 1.15em;
  line-height: 1;
  background: black;
  color: #f6f6f6;
  overflow-x: hidden;
  scrollbar-width: none;
}

body.article {
  font-family: 'a', serif;
  /* border-left: 5px solid black; */
}

@media (max-width: 768px) {
  body.article {
    border: 0;
  }
}

sup {
  font-family: 'i', sans-serif;
  text-transform: uppercase;
  font-size: 0.7em;
  top: -0.4em;
}

h1,
h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.25em;
}

p {
  margin: 0;
  line-height: 1.3;
}

figcaption {
  margin: 0.5em 0 0 0;
  font-size: 0.8em;
  text-align: left;
  word-wrap: break-word;
}

ol {
  list-style-type: decimal;
  list-style-position: inside;
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
</style>
