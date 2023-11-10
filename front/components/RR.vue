<template>
  <p :style="`font-size: ${ width * 20 }px; line-height: 0.5;`">
    <span v-for="(r, index) in no" :style="`opacity: ${ scale(index, [0, no], [2.5, 10]) / 10 }; filter: blur(${ scale(index, [0, no], [20000, 0]) * (no * 0.2) }px);`">r</span>
  </p>
</template>

<script setup lang="ts">
const { pressed } = useMousePressed()
const { width } = useWindowSize()

const min = ref(6)
const max = ref(8)
const no = 4

function scale (number: any, [inMin, inMax]: any, [outMin, outMax]: any) {
  return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin
}
</script>
