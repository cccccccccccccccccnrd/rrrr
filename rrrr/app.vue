<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
@font-face {
  font-family: 'Arizona';
  src: url('~/assets/fonts/ABCArizonaSerif-Light-Trial.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('~/assets/fonts/Inter.ttf') format('truetype');
  font-weight: 400;
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
  background: white;
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
  font-family: 'Inter', 'limousine', sans-serif;
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
  font-family: 'Arizona', serif;
  border-left: 5px solid black;
}

sup {
  font-family: 'Inter', 'limousine', sans-serif;
  text-transform: uppercase;
  font-size: 0.8em;
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
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.sans-serif-uppercase {
  font-family: 'Inter', 'limousine', sans-serif;
  text-transform: uppercase;
}
</style>
