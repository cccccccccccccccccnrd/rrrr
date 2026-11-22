// @ts-expect-error No typings
import { Previewer } from 'pagedjs'

const isRefreshing = ref(false)
let queued = false

export function usePdfPreview() {
  // A refresh requested while one is rendering runs right after it, so saved changes always show up
  const refresh = async () => {
    if (isRefreshing.value) {
      queued = true
      return
    }
    isRefreshing.value = true
    try {
      do {
        queued = false
        await render()
      } while (queued)
    } finally {
      isRefreshing.value = false
    }
  }

  const render = async () => {
    // Save scroll position before refresh
    const scrollY = window.scrollY

    document.head
      .querySelectorAll('[data-pagedjs-inserted-styles]')
      .forEach((e) => e.parentNode?.removeChild(e))

    const previewEl = document.querySelector('#pdf-preview')
    if (previewEl) {
      previewEl.innerHTML = ''
    }

    const previewer = new Previewer()
    const styleURL = `/api/print-css.css?t=${Date.now()}`

    try {
      await previewer.preview(
        document.querySelector('#pdf-content')?.innerHTML || '',
        [styleURL],
        previewEl || undefined,
      )

      // Restore scroll position after render
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY)
      })
    } catch (e) {
      console.error('Failed to refresh preview:', e)
    }
  }

  return {
    refresh,
    isRefreshing: readonly(isRefreshing),
  }
}
