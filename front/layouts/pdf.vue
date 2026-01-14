<template>
  <slot />
</template>

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
  background-image: none !important;
  border: none !important;
  color: black !important;
  background-color: black !important;
  font-family: 'a', serif;
  font-weight: 300;
  font-size: 16px;
}

.pagedjs_page {
  background-color: white !important;
  margin-bottom: 20px !important;
}

nav {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  font-family: 'm', monospace;
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
  font-family: 'm', monospace;
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

h1,
h2,
h3 {
  margin: 0;
  font-weight: 300;
  line-height: 1.1;
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
</style>
