// Loading and saving print.css for the PDF editor, with one shared status line for the editor bar
export function usePrintCss () {
  const status = useState('pdf-status', () => ({ text: '', error: false }))
  const { refresh } = usePdfPreview()

  const load = async () => (await $fetch<{ content: string }>('/api/print-css')).content

  // Every save starts from the latest stored CSS, so parallel editors don't overwrite each other
  const update = async (change: (css: string) => string) => {
    status.value = { text: 'Saving…', error: false }
    try {
      const latest = await load()
      const content = change(latest)
      if (content !== latest) await $fetch('/api/print-css', { method: 'POST', body: { content } })
      const text = content === latest ? 'Nothing changed' : 'Saved'
      status.value = { text, error: false }
      setTimeout(() => { if (status.value.text === text) status.value = { text: '', error: false } }, 2500)
      await refresh()
      return true
    } catch (e: any) {
      status.value = {
        text: e?.statusCode === 401 ? 'Login expired, reload the page' : 'Saving failed',
        error: true
      }
      return false
    }
  }

  return { status, load, update }
}
