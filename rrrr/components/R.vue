<template>
  <p class="rrrr">
    <span v-for="(r, index) in no" :style="`opacity: ${ scale(index, [0, no - 4], [0, 10]) / 10 }; filter: blur(${ scale(index, [0, no - 4], [8, 0]) * (no * 0.1) }px);`">r</span>eflect Journal of <br />
    Integrated Design Research
  </p>
</template>

<script setup lang="ts">
const min = ref(6)
const max = ref(12)
const no = ref(Math.floor(Math.random() * max.value) + min.value)

const { pressed } = useMousePressed()

onKeyStroke('ArrowLeft', (e) => {
  e.preventDefault()
  if (no.value < 5) return
  no.value = no.value - 1
})

onKeyStroke('ArrowRight', (e) => {
  e.preventDefault()
  no.value = no.value + 1
})

/* watch(pressed, () => {
  console.log(pressed.value)
  if (pressed.value) return no.value = Math.floor(Math.random() * max.value) + min.value
}) */

function scale (number: any, [inMin, inMax]: any, [outMin, outMax]: any) {
  return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin
}
</script>

<style scoped>
  .rrrr {
    font-size: 3em;
    line-height: 1;
  }
</style>
