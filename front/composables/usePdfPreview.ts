// @ts-expect-error No typings
import { Previewer } from 'pagedjs'

const isRefreshing = ref(false)



export function usePdfPreview() {
  const refresh = async () => {
    if (isRefreshing.value) return
    isRefreshing.value = true

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
      const flow = await previewer.preview(
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
    } finally {
      isRefreshing.value = false
    }
  }

  return {
    refresh,
    isRefreshing: readonly(isRefreshing),
  }
}
