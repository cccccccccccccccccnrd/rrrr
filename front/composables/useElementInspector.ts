export function useElementInspector() {
  const isActive = ref(false)
  let tooltip: HTMLElement | null = null
  let currentElement: HTMLElement | null = null

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

  const handleMouseMove = (e: MouseEvent) => {
    if (!isActive.value || !tooltip) return

    const target = e.target as HTMLElement
    if (target === tooltip || target.id === 'element-inspector-tooltip') return

    const blockElement = target.closest('[id^="block-"]') as HTMLElement | null

    if (currentElement && currentElement !== blockElement) {
      currentElement.style.outline = ''
    }

    if (!blockElement) {
      tooltip.style.display = 'none'
      currentElement = null
      return
    }

    tooltip.style.display = 'block'
    currentElement = blockElement
    blockElement.style.outline = '2px solid #00bfff'

    const tag = blockElement.tagName.toLowerCase()
    const id = blockElement.id || ''
    const dimensions = `${blockElement.offsetWidth}x${blockElement.offsetHeight}`

    tooltip.innerHTML = `
      <span style="color:#50fa7b; font-weight:bold">#${id}</span>
    `

    //<span style="color:#ff79c6">&lt;${tag}&gt;</span>
    //<span style="color:#6272a4; margin-left:8px">${dimensions}</span>

    const x = e.clientX + 12
    const y = e.clientY + 12
    tooltip.style.left = `${Math.min(x, window.innerWidth - tooltip.offsetWidth - 10)}px`
    tooltip.style.top = `${Math.min(y, window.innerHeight - tooltip.offsetHeight - 10)}px`
  }

  const handleMouseLeave = () => {
    if (currentElement) {
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
    if (e.key === 'Escape' && isActive.value) {
      disable()
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
  })

  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('keydown', handleKeyDown)
    if (tooltip) tooltip.remove()
    if (currentElement) currentElement.style.outline = ''
  })

  return {
    isActive: readonly(isActive),
    enable,
    disable,
    toggle,
  }
}
