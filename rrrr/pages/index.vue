<template>
  <div class="flex flex-col justify-between mt-9 m-5">
    <R />
    <div class="mt-5 max-w-[600px]">
      <!-- <details>
        <summary class="pppp">About</summary>
        <p class="mt-2 leading-none">{{ about.extended }}</p>
      </details> -->
      <details open>
        <summary class="pppp">Articles</summary>
        <NuxtLink
          v-for="a in c.pages.articles"
          class="mt-2 leading-none cursor-pointer block"
          @mouseenter="handleMouseEnter($event)"
          @mouseover="current = a.content.cover[0].url"
          @mouseleave="current = ''"
          :to="a.id"
        >
          <div>
            <p>{{ a.title }}</p>
            <p class="sans-serif-uppercase text-base leading-none">
              {{ a.content.author[0].text }}
            </p>
          </div>
        </NuxtLink>
      </details>
      <!-- <details>
        <summary class="pppp">Authors</summary>
        <p v-for="a in c.pages.authors" class="mt-2 leading-none">
          {{ a.title }}
        </p>
      </details> -->
    </div>
  </div>
  <div
    class="fixed bottom-0 left-0 w-full h-full z-[-10] flex items-center justify-center"
  >
    <img
      class="w-[50vw] max-w-[800px]"
      :src="current"
      :style="`transform: translate(${(x - xO) / oO}px, ${(y - yO) / oO}px);`"
    />
  </div>
  <!-- <RR class="absolute top-0 left-0 w-full h-full flex items-center overflow-hidden"/> -->
</template>

<script setup>
const { x, y } = useMouse()
const c = useContent()
c.value.current = {}

const current = ref('')
const xO = ref(0)
const yO = ref(0)
const oO = ref(10)

function handleMouseEnter (event) {
  xO.value = event.target.offsetLeft
  yO.value = event.target.offsetTop
}
</script>

<style scoped>
details {
  font-family: 'Arizona', serif;
  font-size: 1.5em;
}

details[open] .pppp {
  border: 1px solid rgba(255, 255, 255, 0.4);
}

details > summary {
  list-style: none;
}

.pppp {
  display: inline;
  padding: 0.5em 0.75em;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  cursor: pointer;
  backdrop-filter: blur(10px);
}
</style>
