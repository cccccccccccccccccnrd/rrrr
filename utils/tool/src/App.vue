<template>
  <div id="app">
    <nav>
      <router-link to="/">Type</router-link> ·
      <router-link to="/zzz">Zzz</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style>
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: black;
  }

  ::selection {
    color: black;
    background: white;
  }
  
  :root {
    --bg: rgba(0, 0, 0, 0.15);
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
    background: var(--bg);
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    gap: 1em;
    z-index: 9999;
  }

  a, a:visited {
    color: black;
    text-decoration: none;
  }

  a.router-link-active {
    font-weight: 800;
  }

  button,
  input,
  select {
    background: transparent;
    border: 0;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    color: transparent;
    background: transparent;
    border: 2px solid black;
    border-radius: 100px;
    padding: 0.4em 1em;
    transition: all 150ms;
  }

  button:hover,
  input[type="text"]:hover,
  input[type="text"]:focus {
    color: white;
    background: black;
    outline: 0;
  }

  input[type="checkbox"] {
    display: block;
  }

  input[type="text"] {
    color: black;
    text-align: center;
    border: 0;
  }

  input[type="text"]:hover,
  input[type="text"]:focus {
    color: black;
    background: transparent;
  }

  h1, h2, h3 {
    font-weight: 400;
  }

  figure {
    margin: 0;
  }

  figcaption {
    width: 80%;
    margin: 0.5em 0 0 0;
    font-size: 0.7em;
    text-align: left;
    opacity: 0.3;
    transition: all 600ms;
  }

  figcaption:hover {
    width: 100%;
    opacity: 1;
    font-size: 1em;
  }

  img {
    display: block;
  }
</style>
