// @ts-expect-error No typings
import { Previewer } from 'pagedjs'

const isRefreshing = ref(false)

const parsePageBreakRules = (
  css: string,
): { selector: string; type: string }[] => {
  const rules: { selector: string; type: string }[] = []
  // Match CSS rules containing page-break properties
  // This regex captures: selector { ... page-break-X: value ... }
  const regex =
    /(?:^|})[\s\n]*([^{}]+?)\s*\{[^}]*(page-break-(?:after|before|inside))\s*:\s*([^;!}]+)/g
  let match

  while ((match = regex.exec(css)) !== null) {
    // Clean selector: remove any leading/trailing whitespace and newlines
    const selector = match[1].replace(/[\n\r]+/g, ' ').trim()
    
    // Skip empty selectors
    if (!selector) {
      continue
    }
    
    // Skip if selector looks like CSS property values (invalid capture)
    // Valid colons in selectors: pseudo-classes/elements (::, :nth, :first, :last, :hover, :focus, :not, :where, :is, :has, :root, :empty, :checked, :disabled, :enabled, :target, :lang, :dir, :any-link, :link, :visited, :active, :only-child, :only-of-type)
    const hasSuspiciousColon = selector.includes(':') && 
      !/:[:a-z-]/i.test(selector) // Valid pseudo-selectors start with : followed by : or letter
    
    // Skip if contains typical CSS value patterns
    const looksLikeCssValue = /^\s*[a-z-]+\s*$|;\s*$|^\s*\d|!important/i.test(selector)
    
    if (hasSuspiciousColon || looksLikeCssValue) {
      continue
    }
    
    const property = match[2]
    const value = match[3].trim()

    if (value === 'always') {
      rules.push({
        selector,
        type: property === 'page-break-after' ? 'after' : 'before',
      })
    } else if (value === 'avoid') {
      rules.push({ selector, type: 'avoid' })
    }
  }
  return rules
}

const addPageBreakIndicators = async () => {
  document
    .querySelectorAll('.page-break-indicator')
    .forEach((el) => el.remove())
  try {
    const { content } = await $fetch<{ content: string }>('/api/print-css')
    const rules = parsePageBreakRules(content)

    const previewEl = document.querySelector('#pdf-preview')
    if (!previewEl) return

    rules.forEach(({ selector, type }) => {
      try {
        const elements = previewEl.querySelectorAll(selector)
        elements.forEach((el) => {
          const indicator = document.createElement('div')
          indicator.className = 'page-break-indicator'
          if (type === 'after') {
            indicator.style.cssText = `
              position: absolute;
              bottom: -2px;
              left: 0;
              right: 0;
              height: 4px;
              background: repeating-linear-gradient(90deg, #f59e0b, #f59e0b 10px, transparent 10px, transparent 20px);
              z-index: 1000;
              pointer-events: none;
            `
            indicator.innerHTML = `<span style="position:absolute;right:0;bottom:4px;background:#f59e0b;color:#000;padding:2px 8px;font-family:monospace;font-size:10px;text-transform:uppercase;">↓ page break after</span>`
          } else if (type === 'before') {
            indicator.style.cssText = `
              position: absolute;
              top: -2px;
              left: 0;
              right: 0;
              height: 4px;
              background: repeating-linear-gradient(90deg, #8b5cf6, #8b5cf6 10px, transparent 10px, transparent 20px);
              z-index: 1000;
              pointer-events: none;
            `
            indicator.innerHTML = `<span style="position:absolute;right:0;top:4px;background:#8b5cf6;color:#fff;padding:2px 8px;font-family:monospace;font-size:10px;text-transform:uppercase;">↑ page break before</span>`
          } else if (type === 'avoid') {
            indicator.style.cssText = `
              position: absolute;
              top: 0;
              left: -4px;
              bottom: 0;
              width: 4px;
              background: #22c55e;
              z-index: 1000;
              pointer-events: none;
            `
            indicator.innerHTML = `<span style="position:absolute;left:8px;top:0;background:#22c55e;color:#000;padding:2px 8px;font-family:monospace;font-size:10px;text-transform:uppercase;white-space:nowrap;">keep together</span>`
          }

          const htmlEl = el as HTMLElement
          const computed = window.getComputedStyle(htmlEl)
          if (computed.position === 'static') {
            htmlEl.style.position = 'relative'
          }

          htmlEl.appendChild(indicator)
        })
      } catch (e) {
        console.warn('Could not find elements for selector:', selector)
      }
    })
  } catch (e) {
    console.error('Failed to add page break indicators:', e)
  }
}

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

      await addPageBreakIndicators()

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
