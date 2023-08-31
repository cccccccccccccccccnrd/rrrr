<template>
  <div class="site">
    <Nuxt />
  </div>
</template>

<script>
export default {
  name: 'LayoutPdf',
  data () {
    return {}
  },
  head () {
    return {
      link: [{
        rel: 'stylesheet',
        type: 'text/css',
        href: '/paged.polyfill.js'
      }]
    }
  },
  computed: {},
  mounted () {
  }
}
</script>

<style>
@media print {
  @page {
    size: A4 portrait;
    margin: calc(0.666em * 4) 0;
    /* @bottom-center {
      content: counter(page) ' of ' counter(pages);
    }
    marks: crop cross; */
  }

  /* .article-footer {
    break-before: right;
  } */
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
  background-color: #f6f6f6;
  background-image: linear-gradient(315deg, #f6f6f6 0%, #e9e9e9 74%);
  font-family: var(--serif);
  font-weight: 300;
  font-size: 14px;
  border: none;
}

nav {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  gap: 1em;
  color: white;
  background: black;
}

nav a,
nav a:visited {
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;
}

a,
a:visited {
  color: black;
  text-decoration: none;
}

a.nuxt-link-exact-active {
  font-weight: 800;
}

button,
input,
select {
  width: 100%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2em;
  cursor: pointer;
  color: white;
  background: transparent;
  border: 2px solid white;
  border-radius: 100px;
  padding: 0.4em 1em;
  transition: all 150ms;
}

button:hover,
input[type='text']:hover,
input[type='text']:focus {
  outline: 0;
}

p {
  margin: 0;
}

h1,
h2,
h3 {
  margin: 0;
  font-weight: 300;
  line-height: 0.9;
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

figure {
  margin: 0;
}

figcaption {
  margin: 0.5em 0 0 0;
  font-size: 0.8em;
  text-align: left;
  word-wrap: break-word;
  transition: all 600ms;
}

/* figcaption:hover {
    width: 100%;
    opacity: 1;
    font-size: 1em;
  } */

img {
  display: block;
}

ol {
  margin: 0;
  padding: 0;
}

ol ::marker {
  font-family: sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

sup {
  line-height: 0;
  font-family: sans-serif;
}

header {
  position: fixed;
  top: 0;
  left: 0;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
}

.site {
  display: flex;
  flex-flow: column nowrap;
}

.page {
  display: flex;
  width: 100%;
}

.articles {
  flex-flow: column nowrap;
}

.sans-serif-uppercase {
  margin: 0;
  font-family: sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.overlay {
  padding: 0.666em 0.666em calc(0.666em * 2) 0.666em;
  color: white;
  background: black;
}

.overlay > div {
  display: flex;
}

.overlay-zzz {
  columns: 2;
  gap: 0.666em;
}

.overlay-zzz > div {
  width: 50%;
}

.overlay-zzz .logo {
  /* max-height: 500px; */
  overflow: hidden;
}

.overlay-zzz .committee {
  font-size: 0.8em;
}

.overlay-zzz .names {
  display: flex;
  gap: 0.666rem;
}

.overlay-zzz .names p:first-of-type {
  margin: 0 0 0.15em 0;
}
</style>
