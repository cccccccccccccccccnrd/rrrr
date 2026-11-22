<template>
  <button class="p-2 uppercase hover:bg-white hover:text-black" :class="{ 'bg-white text-black': isActive }"
    @click="toggle">
    Inspect {{ isActive ? '●' : '○' }}
  </button>
</template>

<script setup>
const { isActive, toggle } = useElementInspector()
</script>
