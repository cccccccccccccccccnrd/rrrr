<template>
  <div>
    <button
      class="w-fit px-4 py-2 bg-black/80 text-white border border-neutral-600 rounded-full font-mono text-xs cursor-pointer z-[99998] uppercase transition-all hover:bg-neutral-800"
      :class="{ '!bg-yellow-400 !text-black !border-yellow-400': isOpen }" @click="isOpen = !isOpen">
      CSS
    </button>
    <div v-if="isOpen"
      class="absolute bottom-full right-0  mb-2 w-[500px] h-[40vh] bg-black/95 border border-neutral-700 rounded-lg z-[99999] flex flex-col">
      <div class="flex items-center justify-between p-3 border-b border-neutral-700">
        <span class="font-mono text-xs text-white uppercase">print.css {{ articleId ? `(${articleId})` : '' }}</span>
        <div class="flex gap-2">
          <button @click="save" :disabled="saving"
            class="px-3 py-1 bg-green-600 text-white rounded font-mono text-xs uppercase hover:bg-green-500 disabled:opacity-50">
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
          <button @click="isOpen = false"
            class="px-3 py-1 bg-neutral-700 text-white rounded font-mono text-xs uppercase hover:bg-neutral-600">
            Close
          </button>
        </div>
      </div>
      <textarea v-model="cssContent"
        class="flex-1 p-4 bg-transparent text-white font-mono text-sm resize-none outline-none" spellcheck="false"
        @keydown.ctrl.s.prevent="save" @keydown.meta.s.prevent="save"></textarea>
      <div v-if="message" class="p-2 text-xs font-mono" :class="messageClass">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  articleId: { type: String, default: '' }
})

const { refresh: refreshPreview } = usePdfPreview()

const isOpen = ref(false)
const cssContent = ref('')
const fullCss = ref('')
const saving = ref(false)
const message = ref('')
const messageClass = ref('')

const filterCssForArticle = (css, articleId) => {
  if (!articleId) return css

  const rules = []
  let current = ''
  let braceCount = 0

  for (const char of css) {
    current += char
    if (char === '{') braceCount++
    if (char === '}') {
      braceCount--
      if (braceCount === 0) {
        rules.push(current.trim())
        current = ''
      }
    }
  }

  const filtered = rules.filter(rule => {
    const selector = rule.split('{')[0].trim()
    return selector.startsWith('.' + articleId)
  })

  return filtered.join('\n\n')
}

const load = async () => {
  try {
    const { content } = await $fetch('/api/print-css')
    fullCss.value = content
    cssContent.value = filterCssForArticle(content, props.articleId)
  } catch (e) {
    message.value = 'Failed to load CSS'
    messageClass.value = 'text-red-400'
  }
}

const mergeCss = (fullCss, editedCss, articleId) => {
  if (!articleId) return editedCss

  const parseRules = (css) => {
    const rules = []
    let current = ''
    let braceCount = 0
    for (const char of css) {
      current += char
      if (char === '{') braceCount++
      if (char === '}') {
        braceCount--
        if (braceCount === 0) {
          rules.push(current.trim())
          current = ''
        }
      }
    }
    return rules
  }

  const fullRules = parseRules(fullCss)
  const editedRules = parseRules(editedCss)

  const otherRules = fullRules.filter(rule => {
    const selector = rule.split('{')[0].trim()
    return !selector.startsWith('.' + articleId)
  })

  return [...otherRules, ...editedRules].join('\n\n')
}

const save = async () => {
  saving.value = true
  message.value = ''
  try {
    const mergedCss = mergeCss(fullCss.value, cssContent.value, props.articleId)
    await $fetch('/api/print-css', {
      method: 'POST',
      body: { content: mergedCss }
    })
    fullCss.value = mergedCss
    message.value = 'Saved! Refreshing preview...'
    messageClass.value = 'text-green-400'
    await refreshPreview()
    message.value = 'Saved!'
    setTimeout(() => { message.value = '' }, 2000)
  } catch (e) {
    message.value = 'Failed to save'
    messageClass.value = 'text-red-400'
  } finally {
    saving.value = false
  }
}

watch(isOpen, (open) => {
  if (open) load()
})
</script>

<style scoped>
textarea::selection {
  background: #facc15;
  color: black;
}
</style>