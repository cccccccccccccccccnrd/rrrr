<template>
  <div>
    <button class="p-2 uppercase hover:bg-white hover:text-black" :class="{ 'bg-white text-black': isOpen }"
      @click="isOpen = !isOpen">
      CSS {{ isOpen ? '●' : '○' }}
    </button>
    <div v-if="isOpen"
      class="fixed top-[33px] right-0 bottom-0 w-[520px] max-w-full bg-black text-white border-l border-white z-50 flex flex-col">
      <div class="flex items-center justify-between border-b border-white">
        <span class="p-2 truncate normal-case">.{{ articleId }}</span>
        <div class="flex shrink-0">
          <button class="p-2 uppercase hover:bg-white hover:text-black" @click="save">Save</button>
          <button class="p-2 uppercase hover:bg-white hover:text-black" @click="isOpen = false">Close</button>
        </div>
      </div>
      <textarea v-model="cssContent" spellcheck="false"
        class="flex-1 p-3 bg-transparent font-[m] text-[13px] leading-relaxed normal-case resize-none outline-none"
        @keydown.ctrl.s.prevent="save" @keydown.meta.s.prevent="save"></textarea>
      <p class="p-2 border-t border-white normal-case opacity-60">
        Only rules for this article, each starting with .{{ articleId }}. Shared rules are in Kirby → Articles → Print
        CSS. ⌘S / Ctrl+S saves.
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  articleId: { type: String, required: true }
})

const { status, load, update } = usePrintCss()
const isOpen = ref(false)
const cssContent = ref('')

const own = (rules) => rules.filter((rule) => belongsTo(rule, props.articleId))

watch(isOpen, async (open) => {
  if (!open) return
  try {
    cssContent.value = own(parseRules(await load()).rules).map((rule) => rule.text).join('\n\n')
  } catch {
    status.value = { text: 'Could not load CSS', error: true }
  }
})

const save = async () => {
  const edited = parseRules(cssContent.value)
  if (edited.rest) {
    status.value = { text: 'Unfinished rule, a } is missing', error: true }
    return
  }
  if (own(edited.rules).length !== edited.rules.length) {
    status.value = { text: `Every rule must start with .${props.articleId}`, error: true }
    return
  }
  await update((latest) => {
    const stored = parseRules(latest)
    const others = stored.rules.filter((rule) => !belongsTo(rule, props.articleId))
    return [...others, ...edited.rules].map((rule) => rule.text).concat(stored.tail).filter(Boolean).join('\n\n') + '\n'
  })
}
</script>

<style scoped>
textarea::selection {
  background: white;
  color: black;
}
</style>
