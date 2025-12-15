<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
// @ts-expect-error No typings
import { Previewer } from 'pagedjs'

type Flow = {
    total: number
}

onMounted(() => {
    const previewer = new Previewer()
    const styleURL = '/print.css'

    previewer
        .preview(
            document.querySelector('#pdf-content')?.innerHTML || '',
            [styleURL],
            document.querySelector('#pdf-preview') || undefined
        )
        .then((flow: Flow) => {
            console.log('preview rendered, total pages', flow.total)
        })
})

onBeforeUnmount(() => {
    document.head.querySelectorAll('[data-pagedjs-inserted-styles]').forEach(e => e.parentNode?.removeChild(e))
})
</script>

<template>
    <div></div>
</template>
