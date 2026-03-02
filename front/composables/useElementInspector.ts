const MENU_ACTIONS: Record<string, { property: string; value: string }> = {
  'break-before': { property: 'page-break-before', value: 'always' },
  'break-after': { property: 'page-break-after', value: 'always' },
  'margin-1': { property: 'margin-top', value: '1em' },
  'margin-2': { property: 'margin-top', value: '2em' },
  'margin-3': { property: 'margin-top', value: '3em' },
  'margin-4': { property: 'margin-top', value: '4em' },
  'margin-5': { property: 'margin-top', value: '5em' },
  'margin-6': { property: 'margin-top', value: '6em' },
}

type MenuItem = 
  | { action: string; label: string; danger?: boolean }
  | { divider: true }

const MENU_ITEMS: MenuItem[] = [
  { action: 'break-before', label: 'Page break before' },
  { action: 'break-after', label: 'Page break after' },
  { divider: true },
  { action: 'margin-1', label: '1em top margin' },
  { action: 'margin-2', label: '2em top margin' },
  { action: 'margin-3', label: '3em top margin' },
  { action: 'margin-4', label: '4em top margin' },
  { action: 'margin-5', label: '5em top margin' },
  { action: 'margin-6', label: '6em top margin' },
  { action: 'remove-margin', label: 'Remove margin rule', danger: true },
]

const BASE_STYLES = `
  position: fixed;
  font-family: 'm', monospace;
  font-size: 12px;
  color: #fff;
`

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
      ${BASE_STYLES}
      background: rgba(0, 0, 0, 0.85);
      padding: 6px 10px;
      border-radius: 4px;
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
      ${BASE_STYLES}
      background: rgba(0, 0, 0, 0.95);
      padding: 8px 0;
      border-radius: 6px;
      z-index: 100000;
      min-width: 200px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      display: none;
    `
    // Event delegation - single listener for all menu items
    menu.addEventListener('click', (e) => {
      const item = (e.target as HTMLElement).closest(
        '[data-action]',
      ) as HTMLElement
      if (item?.dataset.action) handleMenuClick(item.dataset.action)
    })
    menu.addEventListener('mouseover', (e) => {
      const item = (e.target as HTMLElement).closest(
        '.menu-item',
      ) as HTMLElement
      if (item) item.style.background = '#333'
    })
    menu.addEventListener('mouseout', (e) => {
      const item = (e.target as HTMLElement).closest(
        '.menu-item',
      ) as HTMLElement
      if (item) item.style.background = 'transparent'
    })
    document.body.appendChild(menu)
  }

  const findElementIndex = (
    element: HTMLElement,
    siblings: NodeListOf<Element>,
  ): number => {
    return Array.from(siblings).findIndex((el) => el === element) + 1
  }

  const generateSelector = (element: HTMLElement): string => {
    const articleEl = element.closest('.article')
    const slug = articleEl?.classList[2] || ''
    const tag = element.tagName.toLowerCase()

    // Check for footnote list items
    const footnotesList = element.closest('.footnotes-list')
    if (footnotesList && tag === 'li') {
      const items = footnotesList.querySelectorAll('li')
      const index = findElementIndex(element, items)
      const base = slug ? `.${slug} .footnotes-list` : `.footnotes-list`
      return `${base} li:nth-child(${index})`
    }

    // Check for original block ID or split block data-id
    const blockId = element.id || element.dataset.id
    if (blockId?.startsWith('block-')) {
      return slug ? `.${slug} #${blockId}` : `#${blockId}`
    }

    if (element.id) {
      return slug ? `.${slug} #${element.id}` : `#${element.id}`
    }

    const parentWithId = element.parentElement?.closest(
      '[id]',
    ) as HTMLElement | null

    if (parentWithId?.id) {
      const siblings = parentWithId.querySelectorAll(`:scope > ${tag}`)
      const index = findElementIndex(element, siblings)
      const base = slug ? `.${slug} #${parentWithId.id}` : `#${parentWithId.id}`
      return `${base} > ${tag}:nth-of-type(${index})`
    }

    if (slug && articleEl) {
      const index = findElementIndex(element, articleEl.querySelectorAll(tag))
      return `.${slug} ${tag}:nth-of-type(${index})`
    }

    return ''
  }

  const showMenu = (x: number, y: number, element: HTMLElement) => {
    if (!menu) createMenu()
    selectedElement = element

    const selector = generateSelector(element)
    const itemStyle =
      'padding: 8px 12px; cursor: pointer; transition: background 0.15s;'

    menu!.innerHTML = `
      <div style="padding: 6px 12px; color: #888; font-size: 10px; text-transform: uppercase;">
        ${selector || 'No selector'}
      </div>
      ${MENU_ITEMS.map((item) =>
        'divider' in item
          ? '<div style="border-top: 1px solid #333; margin: 4px 0;"></div>'
          : `<div class="menu-item" data-action="${item.action}" style="${itemStyle}${item.danger ? ' color: #f87171;' : ''}">${item.label}</div>`,
      ).join('')}
    `

    menu!.style.display = 'block'
    menu!.style.left = `${Math.min(x, window.innerWidth - 220)}px`
    menu!.style.top = `${Math.min(y, window.innerHeight - menu!.offsetHeight - 10)}px`
  }

  const hideMenu = () => {
    if (menu) menu.style.display = 'none'
    selectedElement = null
  }

  const removeRule = async (
    content: string,
    selector: string,
    property: string,
  ): Promise<string | null> => {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(
      `\\n?${escapedSelector}\\s*\\{[^}]*${property}[^}]*\\}\\n?`,
      'g',
    )
    const newContent = content.replace(regex, '\n')
    return newContent !== content ? newContent : null
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

      // Handle remove actions
      if (action === 'remove-break' || action === 'remove-margin') {
        const property = action === 'remove-break' ? 'page-break' : 'margin'
        const newContent = await removeRule(content, selector, property)

        if (!newContent) {
          alert(`No ${property} rule found for this element`)
          hideMenu()
          return
        }

        await $fetch('/api/print-css', {
          method: 'POST',
          body: { content: newContent },
        })
        await refreshPreview()
      }
      // Handle add actions
      else if (action in MENU_ACTIONS) {
        const { property, value } = MENU_ACTIONS[action]
        let newContent = content

        // For margin actions, remove existing margin rule first
        if (action.startsWith('margin-')) {
          const removed = await removeRule(content, selector, 'margin')
          if (removed) newContent = removed
        }

        const css = `\n${selector} {\n  ${property}: ${value} !important;\n}\n`
        await $fetch('/api/print-css', {
          method: 'POST',
          body: { content: newContent + css },
        })
        await refreshPreview()
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

    // Match blocks, split blocks, and footnote items
    const inspectedElement = target.closest('[id^="block-"], [data-id^="block-"], .footnotes-list li') as HTMLElement | null

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
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault()
      toggle()
    }
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
