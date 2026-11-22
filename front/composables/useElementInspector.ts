// Each action sets (or with null removes) declarations on the clicked element's rule
const MENU_ACTIONS: Record<string, [property: string, value: string | null][]> = {
  'break-before': [['page-break-before', 'always']],
  'break-after': [['page-break-after', 'always']],
  'remove-break': [['page-break-before', null], ['page-break-after', null]],
  'margin-1': [['margin-top', '1em']],
  'margin-2': [['margin-top', '2em']],
  'margin-3': [['margin-top', '3em']],
  'margin-4': [['margin-top', '4em']],
  'margin-5': [['margin-top', '5em']],
  'margin-6': [['margin-top', '6em']],
  'remove-margin': [['margin-top', null]],
}

type MenuItem = 
  | { action: string; label: string; danger?: boolean }
  | { divider: true }

const MENU_ITEMS: MenuItem[] = [
  { action: 'break-before', label: 'Page break before' },
  { action: 'break-after', label: 'Page break after' },
  { action: 'remove-break', label: 'Remove page break', danger: true },
  { divider: true },
  { action: 'margin-1', label: '1em top margin' },
  { action: 'margin-2', label: '2em top margin' },
  { action: 'margin-3', label: '3em top margin' },
  { action: 'margin-4', label: '4em top margin' },
  { action: 'margin-5', label: '5em top margin' },
  { action: 'margin-6', label: '6em top margin' },
  { action: 'remove-margin', label: 'Remove top margin', danger: true },
]

// Same look as the site and the editor bar: black, white border, mono uppercase
const BASE_STYLES = `
  position: fixed;
  font-family: 'm', monospace;
  font-size: 12px;
  text-transform: uppercase;
  color: #fff;
  background: #000;
  border: 1px solid #fff;
`

export function useElementInspector() {
  const isActive = ref(false)
  const { status, update } = usePrintCss()
  let tooltip: HTMLElement | null = null
  let menu: HTMLElement | null = null
  let currentElement: HTMLElement | null = null
  let selectedElement: HTMLElement | null = null

  const createTooltip = () => {
    tooltip = document.createElement('div')
    tooltip.id = 'element-inspector-tooltip'
    tooltip.style.cssText = `
      ${BASE_STYLES}
      padding: 6px 8px;
      z-index: 99999;
      pointer-events: none;
      max-width: 400px;
      white-space: nowrap;
    `
    document.body.appendChild(tooltip)
  }

  const createMenu = () => {
    menu = document.createElement('div')
    menu.id = 'element-inspector-menu'
    menu.style.cssText = `
      ${BASE_STYLES}
      z-index: 100000;
      min-width: 220px;
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
      if (item) Object.assign(item.style, { background: '#fff', color: '#000' })
    })
    menu.addEventListener('mouseout', (e) => {
      const item = (e.target as HTMLElement).closest(
        '.menu-item',
      ) as HTMLElement
      if (item) Object.assign(item.style, { background: 'transparent', color: item.dataset.color })
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
    const articleEl = element.closest('[data-slug]') as HTMLElement | null
    const slug = articleEl?.dataset.slug || ''
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
    const itemStyle = 'padding: 6px 8px; cursor: pointer;'

    menu!.innerHTML = `
      <div style="padding: 6px 8px; border-bottom: 1px solid #fff; text-transform: none; opacity: 0.6;">
        ${selector || 'No selector'}
      </div>
      ${MENU_ITEMS.map((item) => {
        if ('divider' in item) return '<div style="border-top: 1px solid #fff;"></div>'
        const color = item.danger ? '#f87171' : '#fff'
        return `<div class="menu-item" data-action="${item.action}" data-color="${color}" style="${itemStyle} color: ${color};">${item.label}</div>`
      }).join('')}
    `

    menu!.style.display = 'block'
    menu!.style.left = `${Math.min(x, window.innerWidth - 220)}px`
    menu!.style.top = `${Math.min(y, window.innerHeight - menu!.offsetHeight - 10)}px`
  }

  const hideMenu = () => {
    if (menu) menu.style.display = 'none'
    selectedElement = null
  }

  const handleMenuClick = async (action: string) => {
    if (!selectedElement || !(action in MENU_ACTIONS)) return

    const selector = generateSelector(selectedElement)
    hideMenu()
    if (!selector) {
      status.value = { text: 'Could not find a selector for this element', error: true }
      return
    }

    await update((css) =>
      MENU_ACTIONS[action].reduce((result, [property, value]) => setDeclaration(result, selector, property, value), css),
    )
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
    inspectedElement.style.outline = '1px solid #000'
    inspectedElement.style.outlineOffset = '2px'

    const tag = inspectedElement.tagName.toLowerCase()
    const id = inspectedElement.id || ''
    const dimensions = `${inspectedElement.offsetWidth}x${inspectedElement.offsetHeight}`

    tooltip.innerHTML = `
      ${id ? `<span style="text-transform: none">#${id}</span>` : ''}
      <span style="opacity: 0.6; margin-left: 8px">&lt;${tag}&gt; ${dimensions}</span>
      <span style="margin-left: 8px">Click for options</span>
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
