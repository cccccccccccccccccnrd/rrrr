<template>
  <div class="fixed top-0 left-0 z-[100]">
    <header>
      <div>
        <NuxtLink v-if="c.current.title" to="/"><span style="font-size: 16px; line-height: 0">⟵</span> <span class="opacity-0 hover:opacity-100">overview</span></NuxtLink>
      </div>
      <div>{{ c.current.title }} <span style="font-size: 16px; line-height: 0; display: none;">↑</span></div>
      <div @click="overlay ? (overlay = false) : (overlay = true)" class="cursor-pointer">
        rrrreflect <span></span>
      </div>
    </header>
    <div
      class="overlay"
      :style="`${overlay ? 'height: auto;' : 'height: 0px; padding: 0;'}`"
    >
      <div class="overlay-rrrr">
        <div class="logo">
          <!-- <RR /> -->
        </div>
        <div class="about" ref="about">
          <p class="sans-serif-uppercase">About rrrreflect</p>
          <p style="margin: 0 0 0.666em 0">{{ c.pages.about.about }}</p>
          <p>{{ c.pages.about.extended }}</p>
          <br />
          <p class="sans-serif-uppercase">publisher</p>
          <p style="margin: 0 0 0.666em 0">{{ c.pages.about.edition }}</p>
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
    </div>
  </div>
  <slot />
</template>

<script setup>
const { data: content } = await useFetch('/api/content')
const c = useContent()
c.value.pages = content.value.pages
const overlay = ref(false)
const about = ref()

/* onClickOutside(about, (event) => overlay.value = false) */
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1em;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  gap: 1em;
  color: #f6f6f6;
  background: black;
  text-transform: uppercase;
  font-weight: bold;
  z-index: 100;
  user-select: none;
}

.overlay {
  font-family: 'Arizona', serif;
  font-size: 1em;
  color: white;
  overflow: hidden;
}

.overlay > div {
  display: flex;
}

.overlay-rrrr {
  columns: 2;
  gap: 0.666em;
}

.overlay-rrrr > div {
  width: 50%;
}

.overlay-rrrr .logo {
  /* max-height: 500px; */
  overflow: hidden;
  background: transparent;
}

.overlay-rrrr .about {
  background: black;
  padding: 1em;
}

.overlay-rrrr .about:hover {
  color: black;
  background: #f6f6f6;
}

.overlay-rrrr .committee {
  font-size: 0.8em;
}

.overlay-rrrr .names {
  display: flex;
  gap: 0.666rem;
}

.overlay-rrrr .names p:first-of-type {
  margin: 0 0 0.15em 0;
}
</style>
