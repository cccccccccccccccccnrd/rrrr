<template>
  <div
    class="site"
  >
    <nav>
      <NuxtLink to="/">
        Articles
      </NuxtLink>
      <NuxtLink to="/authors">
        Authors
      </NuxtLink>
      <a
        @click="overlay === 'search' ? overlay = false : overlay = 'search'"
        :style="overlay === 'search' ? 'font-weight: 800;' : ''"
      >
        Search
      </a>
      <a
        @click="overlay === 'zzz' ? overlay = false : overlay = 'zzz'"
        :style="overlay === 'zzz' ? 'font-weight: 800;' : ''"
      >
        zzz
      </a>
    </nav>
    <div
      class="overlay"
      ref="overlay"
      :style="`${overlay ? 'height: auto;' : 'height: 0px; padding: 0;'}`"
    >
      <div
        v-if="overlay === 'zzz'"
        class="overlay-zzz"
      >
        <div class="logo">
          <ZzzLogo></ZzzLogo>
        </div>
        <div class="about">
          <p class="sans-serif-uppercase">About zzzine</p>
          <p style="margin: 0 0 0.666em 0">{{ about.about }}</p>
          <p>{{ about.extended }}</p>
          <br>
          <p class="sans-serif-uppercase">publisher</p>
          <p style="margin: 0 0 0.666em 0">{{ about.edition }}</p>
          <div class="committee">
            <p class="sans-serif-uppercase">Advisory Committee</p>
            <div class="names">
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
      <div
        v-if="overlay === 'search'"
        class="overlay-search"
      >
        <input
          type="text"
          placeholder="Title, Tags, Topic..."
        >
      </div>
    </div>
    <Nuxt />
    <footer>
      <div>
        <p class="sans-serif-uppercase">
          Contact
        </p>
        <p>contact@zzzine.org</p>
        <br>
        <p class="sans-serif-uppercase">
          Imprint
        </p>
        <p class="sans-serif-uppercase">
          Data Privacy
        </p>
      </div>
      <div>
        <p class="sans-serif-uppercase">About zzzine</p>
        <p>{{ about.about }}</p>
      </div>
      <div>
        <p class="sans-serif-uppercase">
          KISDedition
        </p>
        <p class="sans-serif-uppercase">
          KISD
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      overlay: 'zzz'
    }
  },
  computed: {
    ...mapGetters({
      pages: 'pages/get'
    }),
    about () {
      return this.pages('about')
    }
  },
  mounted () {
    document.addEventListener('scroll', (event) => {
      if (this.overlay && document.documentElement.scrollTop > this.$refs.overlay.offsetHeight) {
        this.overlay = ''
        document.documentElement.scrollTop = 0
      }
    })
  }
}
</script>

<style>
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
    font-size: 18px;
    border-left: 5px solid black;
    /* border-right: 5px solid black; */
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

  nav a, nav a:visited {
    color: white;
    text-transform: uppercase;
    cursor: pointer;
    user-select: none;
  }

  a, a:visited {
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
  input[type="text"]:hover,
  input[type="text"]:focus {
    outline: 0;
  }

  p {
    margin: 0;
  }

  h1, h2, h3 {
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

  footer {
    display: flex;
    margin: calc(0.666em * 2) 0 0 0;
    /* padding: 0 0 calc(0.666em * 10) 0; */
    color: white;
    background: black;
  }

  footer > div {
    flex: 0.5;
    padding: 0.666em;
  }

  footer > div:nth-child(2) {
    width: 100%;
    max-width: calc(600px + calc(0.666em * 2));
    flex: 1;
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
