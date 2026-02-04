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
  font-size: 15.5px;
}

.pagedjs_page {
  background-color: white !important;
  margin-bottom: 20px !important;
  position: relative;
}

.pagedjs_page::after {
  content: 'PAGE ' attr(data-page-number);
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #888;
  padding: 2px 12px;
  font-family: 'm', monospace;
  font-size: 10px;
  text-transform: uppercase;
  border-radius: 4px;
  z-index: 10;
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

/* Print styles - hide UI elements */
@media print {
  @page {
    size: A4 portrait;
    margin: 0;
  }

  button,
  .fixed,
  #element-inspector-tooltip,
  #element-inspector-menu,
  .page-break-indicator,
  nav {
    display: none !important;
  }

  html,
  body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    height: auto !important;
    overflow: visible !important;
  }

  #pdf-preview {
    width: 210mm !important;
    height: auto !important;
    overflow: visible !important;
    position: static !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .pagedjs_pages {
    width: 210mm !important;
    height: auto !important;
    display: block !important;
    overflow: visible !important;
  }

  .pagedjs_page {
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    page-break-after: always !important;
    page-break-inside: avoid !important;
    break-after: page !important;
    break-inside: avoid !important;
    overflow: hidden !important;
    position: relative !important;
    display: block !important;
    float: none !important;
    width: 210mm !important;
    height: 297mm !important;
  }

  .pagedjs_page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  .pagedjs_page::after {
    display: none !important;
  }

  .pagedjs_sheet {
    width: 210mm !important;
    height: 297mm !important;
    overflow: hidden !important;
    transform: none !important;
  }

  .pagedjs_area {
    width: 100% !important;
    height: 100% !important;
  }

  #pdf-content {
    display: none !important;
  }
}
</style>
