<template>
  <button
    class="fixed bottom-4 left-1/2 -translate-x-1/2 w-fit px-4 py-2 bg-black/80 text-white border border-neutral-600 rounded-full font-mono text-xs cursor-pointer z-[99998] uppercase transition-all hover:bg-neutral-800"
    :class="{ '!bg-cyan-400 !text-black !border-cyan-400': isActive }" @click="toggle">
    {{ isActive ? 'Inspector ON' : 'Inspect' }}
  </button>
</template>

<script setup>
const { isActive, toggle } = useElementInspector()
</script>

i need to write some code in this bitch
i dont know if i like th
