<template>
  <button class="p-2 uppercase hover:bg-white hover:text-black" @click="print">Save PDF</button>
</template>

<script setup>
const print = () => {
  window.print()
}
</script>
