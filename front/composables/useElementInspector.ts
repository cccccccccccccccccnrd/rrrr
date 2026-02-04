export function useElementInspector() {
  const isActive = ref(false)
  const { refresh: refreshPreview } = usePdfPreview()
  let tooltip: HTMLElement | null = null
  let menu: HTMLElement | null = null
  let currentElement: HTMLElement | null = null
  let selectedElement: HTMLElement | null = null

  const createTooltip = () => {
    tooltip = document.createElement('div')
    tooltip.id = 'element-inspector-tooltip'
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      z-index: 99999;
      pointer-events: none;
      max-width: 400px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `
    document.body.appendChild(tooltip)
  }

  const createMenu = () => {
    menu = document.createElement('div')
    menu.id = 'element-inspector-menu'
    menu.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.95);
      color: #fff;
      padding: 8px 0;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      z-index: 100000;
      min-width: 200px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      display: none;
    `
    document.body.appendChild(menu)
  }

  const generateSelector = (element: HTMLElement): string => {
    const articleEl = element.closest('.article')
    const slug = articleEl?.classList[2] || ''

    if (element.id) {
      return slug ? `.${slug} #${element.id}` : `#${element.id}`
    }

    const parentWithId = element.parentElement?.closest(
      '[id]',
    ) as HTMLElement | null
    const tag = element.tagName.toLowerCase()

    if (parentWithId?.id) {
      const siblings = parentWithId.querySelectorAll(`:scope > ${tag}`)
      let index = 1
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i] === element) {
          index = i + 1
          break
        }
      }
      const base = slug ? `.${slug} #${parentWithId.id}` : `#${parentWithId.id}`
      return `${base} > ${tag}:nth-of-type(${index})`
    }

    if (slug && articleEl) {
      const allTags = articleEl.querySelectorAll(tag)
      let index = 1
      for (let i = 0; i < allTags.length; i++) {
        if (allTags[i] === element) {
          index = i + 1
          break
        }
      }
      return `.${slug} ${tag}:nth-of-type(${index})`
    }

    return ''
  }

  const showMenu = (x: number, y: number, element: HTMLElement) => {
    if (!menu) createMenu()
    selectedElement = element

    const selector = generateSelector(element)

    menu!.innerHTML = `
      <div style="padding: 6px 12px; color: #888; font-size: 10px; text-transform: uppercase;">
        ${selector || 'No selector'}
      </div>
      <div class="menu-item" data-action="break-after" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        Page break after
      </div>
      <div class="menu-item" data-action="break-before" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        Page break before
      </div>
      <div class="menu-item" data-action="avoid-break" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        Avoid page break
      </div>
      <div class="menu-item" data-action="remove-break" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s; color: #f87171;">
        Remove page break
      </div>
      <div style="border-top: 1px solid #333; margin: 4px 0;"></div>
      <div class="menu-item" data-action="margin-1" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        + margin-bottom: 1em
      </div>
      <div class="menu-item" data-action="margin-3" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        + margin-bottom: 3em
      </div>
      <div class="menu-item" data-action="margin-5" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        + margin-bottom: 5em
      </div>
      <div class="menu-item" data-action="margin-20" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s;">
        + margin-bottom: 20em
      </div>
      <div class="menu-item" data-action="remove-margin" style="padding: 8px 12px; cursor: pointer; transition: background 0.15s; color: #f87171;">
        Remove margin
      </div>
    `

    menu!.querySelectorAll('.menu-item').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        ;(item as HTMLElement).style.background = '#333'
      })
      item.addEventListener('mouseleave', () => {
        ;(item as HTMLElement).style.background = 'transparent'
      })
      item.addEventListener('click', () =>
        handleMenuClick((item as HTMLElement).dataset.action || ''),
      )
    })

    menu!.style.display = 'block'
    menu!.style.left = `${Math.min(x, window.innerWidth - 220)}px`
    menu!.style.top = `${Math.min(y, window.innerHeight - menu!.offsetHeight - 10)}px`
  }

  const hideMenu = () => {
    if (menu) menu.style.display = 'none'
    selectedElement = null
  }

  const handleMenuClick = async (action: string) => {
    if (!selectedElement) return

    const selector = generateSelector(selectedElement)

    if (!selector) {
      alert('Could not generate selector for this element')
      hideMenu()
      return
    }

    try {
      const { content } = await $fetch<{ content: string }>('/api/print-css')
      let newContent = content

      if (action === 'remove-break') {
        const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(
          `\\n?${escapedSelector}\\s*\\{[^}]*page-break[^}]*\\}\\n?`,
          'g',
        )
        newContent = content.replace(regex, '\n')

        if (newContent === content) {
          alert('No page break rule found for this element')
          hideMenu()
          return
        }

        await $fetch('/api/print-css', {
          method: 'POST',
          body: { content: newContent },
        })
        await refreshPreview()
      } else if (action === 'remove-margin') {
        const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(
          `\\n?${escapedSelector}\\s*\\{[^}]*margin[^}]*\\}\\n?`,
          'g',
        )
        newContent = content.replace(regex, '\n')

        if (newContent === content) {
          alert('No margin rule found for this element')
          hideMenu()
          return
        }

        await $fetch('/api/print-css', {
          method: 'POST',
          body: { content: newContent },
        })
        await refreshPreview()
      } else {
        let css = ''
        switch (action) {
          case 'break-after':
            css = `\n${selector} {\n  page-break-after: always !important;\n}\n`
            break
          case 'break-before':
            css = `\n${selector} {\n  page-break-before: always !important;\n}\n`
            break
          case 'avoid-break':
            css = `\n${selector} {\n  page-break-inside: avoid !important;\n}\n`
            break
          case 'margin-1':
            css = `\n${selector} {\n  margin-bottom: 1em !important;\n}\n`
            break
          case 'margin-3':
            css = `\n${selector} {\n  margin-bottom: 3em !important;\n}\n`
            break
          case 'margin-5':
            css = `\n${selector} {\n  margin-bottom: 5em !important;\n}\n`
            break
          case 'margin-20':
            css = `\n${selector} {\n  margin-bottom: 20em !important;\n}\n`
            break
        }

        if (css) {
          await $fetch('/api/print-css', {
            method: 'POST',
            body: { content: content + css },
          })
          await refreshPreview()
        }
      }
    } catch (e) {
      console.error('Failed to save CSS:', e)
    }

    hideMenu()
  }

  const handleClick = (e: MouseEvent) => {
    if (!isActive.value) return

    const target = e.target as HTMLElement
    if (target.closest('#element-inspector-menu')) return

    if (menu?.style.display === 'block') {
      hideMenu()
      return
    }

    if (currentElement) {
      e.preventDefault()
      e.stopPropagation()
      showMenu(e.clientX, e.clientY, currentElement)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive.value || !tooltip) return
    if (menu?.style.display === 'block') return

    const target = e.target as HTMLElement
    if (target === tooltip || target.id === 'element-inspector-tooltip') return
    if (target.closest('#element-inspector-menu')) return

    const blockElement = target.closest('[id^="block-"]') as HTMLElement | null
    const pElement = !blockElement
      ? (target.closest('p') as HTMLElement | null)
      : null
    const inspectedElement = blockElement || pElement

    if (currentElement && currentElement !== inspectedElement) {
      currentElement.style.outline = ''
    }

    if (!inspectedElement) {
      tooltip.style.display = 'none'
      currentElement = null
      return
    }

    tooltip.style.display = 'block'
    currentElement = inspectedElement
    inspectedElement.style.outline = '2px solid #00bfff'

    const tag = inspectedElement.tagName.toLowerCase()
    const id = inspectedElement.id || ''
    const dimensions = `${inspectedElement.offsetWidth}x${inspectedElement.offsetHeight}`

    const idSpan = id
      ? `<span style="color:#50fa7b; font-weight:bold">#${id}</span>`
      : ''
    tooltip.innerHTML = `
      ${idSpan}
      <span style="color:#ff79c6">&lt;${tag}&gt;</span>
      <span style="color:#6272a4; margin-left:8px">${dimensions}</span>
      <span style="color:#f1fa8c; margin-left:8px">click for options</span>
    `

    const x = e.clientX + 12
    const y = e.clientY + 12
    tooltip.style.left = `${Math.min(x, window.innerWidth - tooltip.offsetWidth - 10)}px`
    tooltip.style.top = `${Math.min(y, window.innerHeight - tooltip.offsetHeight - 10)}px`
  }

  const handleMouseLeave = () => {
    if (currentElement && menu?.style.display !== 'block') {
      currentElement.style.outline = ''
      currentElement = null
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // toggle with ctrl+i
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault()
      toggle()
    }
    // escape to disable
    if (e.key === 'Escape') {
      if (menu?.style.display === 'block') {
        hideMenu()
      } else if (isActive.value) {
        disable()
      }
    }
  }

  const enable = () => {
    isActive.value = true
    if (!tooltip) createTooltip()
    tooltip!.style.display = 'block'
    document.body.style.cursor = 'crosshair'
  }

  const disable = () => {
    isActive.value = false
    if (tooltip) tooltip.style.display = 'none'
    hideMenu()
    if (currentElement) {
      currentElement.style.outline = ''
      currentElement = null
    }
    document.body.style.cursor = ''
  }

  const toggle = () => {
    isActive.value ? disable() : enable()
  }

  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('click', handleClick)
    if (tooltip) tooltip.remove()
    if (menu) menu.remove()
    if (currentElement) currentElement.style.outline = ''
  })

  return {
    isActive: readonly(isActive),
    enable,
    disable,
    toggle,
  }
}
