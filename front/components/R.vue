<template>
  <p class="rrrr" ref="pppp">
    <span
      v-for="(r, index) in no"
      :style="`opacity: ${
        scale(index, [0, no - 4], [0, 10]) / 10
      }; filter: blur(${scale(index, [0, no - 4], [8, 0]) * (no * 0.1)}px);`"
      >r</span
    >eflect Journal of <br />
    Integrated Design Research
  </p>
</template>

<script setup lang="ts">
const min = ref(6)
const max = ref(12)
const no = ref(Math.floor(Math.random() * max.value) + min.value)

const { text } = useTextSelection()

watch(text, () => {
  no.value = Math.floor(text.value.length / 2 + 8)
})

const pppp = ref(null)
const { isSwiping, direction } = useSwipe(pppp)

watch(direction, () => {
  if (direction.value === 'right') {
    no.value = no.value + 1
  } else if (direction.value === 'left') {
    if (no.value === 4) return
    no.value = no.value - 1
  }
})

onKeyStroke('ArrowLeft', e => {
  e.preventDefault()
  if (no.value < 5) return
  no.value = no.value - 1
})

onKeyStroke('ArrowRight', e => {
  e.preventDefault()
  no.value = no.value + 1
})

function scale(number: any, [inMin, inMax]: any, [outMin, outMax]: any) {
  return ((number - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}
</script>

<style scoped>
.rrrr {
  font-family: 'i', 'limousine', sans-serif;
  font-size: 3em;
  line-height: 1;
  white-space: nowrap;
  padding-bottom: 5px;
  overflow: hidden;
}

@media only screen and (max-width: 800px) {
  .rrrr {
  font-size: 6.666vw;
}
}
</style>
