<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col rounded-lg gap-4 border border-current p-4">
      <h1 class="text-4xl leading-none">Pdf</h1>
      <label class="flex flex-row gap-4 text-3xl font-serif">
        <input type="file" @change="handleFiles" webkitdirectory directory multiple class="hidden" />
        <p class="border-b border-dotted w-fit hover:bg-white hover:text-black cursor-pointer">Upload html</p>
        <p v-if="!uploads.length">-</p>
        <p v-if="!uploads.length">no html uploaded</p>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploads = ref([])

</script>
