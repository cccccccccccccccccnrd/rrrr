// Import an article from a .docx (+ its images) straight into the Panel.
// Conversion runs in the browser with mammoth; pages are created through
// Kirby's REST API with the editor's own session.

// Kirby concatenates all plugin index.js files into one classic script, hence the IIFE
;(() => {
const mammothOptions = {
  styleMap: [
    "p[style-name='Quote'] => blockquote:fresh",
    "p[style-name='Block Quote'] => blockquote:fresh",
    "p[style-name='Intense Quote'] => blockquote:fresh",
    "p[style-name='Zitat'] => blockquote:fresh"
  ]
}

const loadScript = (src) =>
  window.mammoth ||
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error('Could not load mammoth'))
    document.head.append(script)
  })

const attr = (s) => s.replace(/"/g, '&quot;')

function parseArticle(html) {
  // `![alt](file.jpg "caption")` paragraphs become figures, which Kirby turns into image blocks
  let processedHtml = html.replace(
    /<p>!\[([^\]]*)\]\(\s*(\S+?)\s+"((?:(?!<\/p>).)*?)"\)<\/p>/g,
    (_, alt, src, caption) => `<figure><img src="${attr(src)}" alt="${attr(alt)}"><figcaption>${caption}</figcaption></figure>`
  )

  // mammoth appends Word foot/endnotes as one <ol> of li#footnote-N; non-greedy so body lists stay put
  const literature = html.match(/<ol><li id="(?:foot|end)note-.*?<\/ol>/)?.[0] || ''
  processedHtml = processedHtml.replace(literature, '').replace(/<h6>.*?<\/h6>/g, '')

  const extractMeta = (key) => html.match(new RegExp(`<h6>${key}: (.*?)</h6>`))?.[1] || ''

  const title = extractMeta('Title')
  const author = extractMeta('Author')

  return {
    meta: {
      title,
      author,
      abstract: extractMeta('Abstract'),
      context: extractMeta('Context'),
      tags: extractMeta('Tags'),
      suggestion: `${author}. ${new Date().getFullYear()}. ${title}. Cologne: rrrreflect.`,
      doi: '',
      license: 'Creative Commons license (CC BY 4.0)',
      literature
    },
    html: processedHtml
  }
}

panel.plugin('rrrr/docx-import', {
  sections: {
    docximport: {
      data() {
        return { mammoth: null, busy: false, error: null, warnings: [], article: null }
      },
      async created() {
        this.mammoth = (await this.load()).mammoth
      },
      methods: {
        async api(path, method, body) {
          const isForm = body instanceof FormData
          const response = await fetch(`${this.$panel.urls.api}/${path}`, {
            method,
            headers: {
              'x-csrf': this.$panel.system.csrf,
              ...(isForm ? {} : { 'content-type': 'application/json' })
            },
            body: isForm ? body : JSON.stringify(body)
          })
          const json = await response.json()
          if (json.status !== 'ok') throw new Error(json.message || `${method} ${path} failed`)
          return json.data
        },

        async onSelect(event) {
          const files = [...event.target.files]
          event.target.value = ''
          Object.assign(this, { error: null, warnings: [], article: null })

          const docx = files.filter((f) => f.name.toLowerCase().endsWith('.docx'))
          const images = files.filter((f) => !docx.includes(f))
          if (docx.length !== 1) {
            this.error = 'Select exactly one .docx file, plus the images it references.'
            return
          }

          this.busy = true
          try {
            this.article = await this.importArticle(docx[0], images)
          } catch (e) {
            this.error = e.message
          } finally {
            this.busy = false
          }
        },

        async importArticle(docx, images) {
          await loadScript(this.mammoth)
          const { value } = await window.mammoth.convertToHtml({ arrayBuffer: await docx.arrayBuffer() }, mammothOptions)
          if (!value.trim()) throw new Error('The .docx appears to be empty or could not be read.')

          const { meta, html } = parseArticle(value)
          if (!meta.title.trim()) {
            throw new Error('Missing title. Add an H6 heading "Title: Your Title" to the document.')
          }

          const slug = meta.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          if (!slug) throw new Error('Could not generate a URL slug from the title.')

          const article = await this.api('pages/articles/children', 'POST', {
            slug,
            title: meta.title,
            template: 'article',
            content: { ...meta, text: html }
          })
          const apiId = article.id.replace('/', '+')

          const isWebImage = (b) => b?.type === 'image' && b.content?.location === 'web' && b.content?.src
          const uploaded = new Set()

          for (const block of article.content.text.filter(isWebImage)) {
            const name = block.content.src
            const file = images.find((f) => f.name === name)
            if (!file) {
              this.warnings.push(`Image "${name}" is referenced in the document but was not selected.`)
              continue
            }
            const form = new FormData()
            form.append('file', file, name)
            form.append('template', 'blocks/image')
            try {
              await this.api(`pages/${apiId}/files`, 'POST', form)
              uploaded.add(name)
            } catch (e) {
              this.warnings.push(`Upload of "${name}" failed: ${e.message}`)
            }
          }

          if (uploaded.size) {
            const text = article.content.text.map((block) =>
              isWebImage(block) && uploaded.has(block.content.src)
                ? {
                    ...block,
                    content: {
                      location: 'kirby',
                      image: [{ id: `${article.id}/${block.content.src}` }],
                      alt: block.content.alt || '',
                      caption: block.content.caption || ''
                    }
                  }
                : block
            )
            await this.api(`pages/${apiId}`, 'PATCH', { text })
          }

          return { title: meta.title, link: `/pages/${apiId}` }
        }
      },
      template: `
        <k-section label="Import article from DOCX">
          <label class="k-docx-import">
            <input type="file" accept=".docx,image/*" multiple :disabled="busy" @change="onSelect" hidden>
            <k-box
              :icon="busy ? 'loader' : 'upload'"
              :text="busy ? 'Importing…' : 'Select one .docx plus its images'"
              style="cursor: pointer"
            />
          </label>
          <k-box v-if="error" theme="negative" :text="error" style="margin-top: var(--spacing-2)" />
          <k-box v-if="article" theme="positive" style="margin-top: var(--spacing-2)">
            <k-link :to="article.link">Created draft “{{ article.title }}” →</k-link>
          </k-box>
          <k-box v-for="w in warnings" :key="w" theme="notice" :text="w" style="margin-top: var(--spacing-2)" />
        </k-section>
      `
    }
  }
})
})()
