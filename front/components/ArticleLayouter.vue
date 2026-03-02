<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const { refresh } = usePdfPreview()

onMounted(() => {
    refresh()
})

onBeforeUnmount(() => {
    document.head.querySelectorAll('[data-pagedjs-inserted-styles]').forEach(e => e.parentNode?.removeChild(e))
})
</script>

<template>
    <div></div>
</template>
