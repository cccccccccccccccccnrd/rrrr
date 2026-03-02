<template>
  <button @click="print"
    class="w-fit px-4 py-2 bg-black/80 text-white border border-neutral-600 rounded-full font-mono text-xs cursor-pointer z-[99998] uppercase transition-all hover:bg-neutral-800">
    Save PDF
  </button>
</template>

<script setup>
const print = () => {
  window.print()
}
</script>
