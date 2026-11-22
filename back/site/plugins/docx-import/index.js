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
    "p[style-name='Zitat'] => blockquote:fresh",
    "p[style-name='Template Note'] => p.template-note:fresh"
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
// mammoth only escapes & < >
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim()

const INFO_FIELDS = ['Title', 'Author', 'Abstract', 'Context', 'Tags']
const REQUIRED = ['Title', 'Author', 'Abstract']
const IMAGE_FORMAT = '![Image description](fig-01.jpg "Caption. © source")'

// Info fields are "Key: value" headings: Heading 2 (template, all older docs) or Heading 6 (former Nuxt importer)
function parseArticle(html) {
  // `![alt](file.jpg "caption")` paragraphs become figures, which Kirby turns into image blocks
  let body = html.replace(
    // Word auto-curls typed quotes, so “ ” „ count too
    /<p>!\[([^\]]*)\]\(\s*(\S+?)\s+["“„]((?:(?!<\/p>).)*?)["”“]\)<\/p>/g,
    (_, alt, src, caption) => `<figure><img src="${attr(src)}" alt="${attr(alt)}"><figcaption>${caption}</figcaption></figure>`
  )

  // mammoth appends Word foot/endnotes as one <ol> of li#footnote-N; non-greedy so body lists stay put
  const literature = html.match(/<ol><li id="(?:foot|end)note-.*?<\/ol>/)?.[0] || ''
  body = body.replace(literature, '')

  const info = {}
  const unknown = []
  const duplicate = []
  body = body.replace(/<h([26])>(.*?)<\/h\1>/g, (heading, _, inner) => {
    const kv = plain(inner).match(/^([A-Za-zÀ-ÿ ]{2,20}):\s*([\s\S]*)$/)
    if (!kv) return heading // left in the body; checkArticle reports it
    const key = INFO_FIELDS.find((k) => k.toLowerCase() === kv[1].trim().toLowerCase())
    if (!key) unknown.push(kv[1].trim())
    else if (key in info) duplicate.push(key)
    else info[key] = kv[2].trim()
    return ''
  })

  const title = info.Title || ''
  const author = info.Author || ''

  return {
    info,
    unknown,
    duplicate,
    meta: {
      title,
      author,
      abstract: info.Abstract || '',
      context: info.Context || '',
      tags: info.Tags || '',
      suggestion: `${author}. ${new Date().getFullYear()}. ${title}. Cologne: rrrreflect.`,
      doi: '',
      license: 'Creative Commons license (CC BY 4.0)',
      literature
    },
    html: body
  }
}

// Everything that would import wrong or silently lose content is an error; the rest are warnings.
function checkArticle({ info, unknown, duplicate, html }, messages, imageNames) {
  const errors = []
  const warnings = []
  const short = (s) => (s.length > 70 ? s.slice(0, 70) + '…' : s)

  const asNormalText = INFO_FIELDS.filter((k) => !info[k] && new RegExp(`<p>(?:<[^>]+>)*${k}:`, 'i').test(html))
  for (const key of asNormalText) errors.push(`"${key}: …" is normal text. Format the info lines at the top as Heading 2.`)
  for (const key of REQUIRED) {
    if (!info[key] && !asNormalText.includes(key)) errors.push(`Missing "${key}: …" line. Put it at the top, formatted as Heading 2.`)
  }
  for (const key of unknown) errors.push(`Unknown info field "${key}:". Allowed: ${INFO_FIELDS.join(', ')}.`)
  for (const key of duplicate) errors.push(`"${key}:" appears more than once.`)

  const everything = Object.values(info).join(' ') + ' ' + html
  if (/lorem ipsum|add your title|firstname surname|five, words|optional, e\.g\./i.test(everything)) {
    errors.push('The document still contains placeholder text from the template.')
  }
  if (/class="template-note"|Please insert your manuscript/.test(html)) {
    errors.push('The template instructions are still in the document. Delete them before uploading.')
  }

  for (const [, level, inner] of html.matchAll(/<h([1-6])>(.*?)<\/h\1>/g)) {
    const text = short(plain(inner))
    if (!text) continue
    if (level === '2' || level === '6') {
      errors.push(`"${text}" is Heading ${level}, which is only for the info fields (Title:, Author:, …). Use Heading 1 for sections.`)
    } else if (level !== '1' && level !== '3') {
      errors.push(`"${text}" is Heading ${level}. Only Heading 1 (section) and Heading 3 (sub-section) are supported.`)
    }
  }

  if (/<table/.test(html)) errors.push('Tables are not supported yet. Add them as an image instead.')
  if (/<(ul|ol)>/.test(html)) errors.push('Bullet and numbered lists are not supported yet. Write them as normal paragraphs.')
  if (/<img src="data:/.test(html)) {
    errors.push(`Images are pasted into the document. Remove them, upload them as files and refer to them with ${IMAGE_FORMAT}.`)
  }
  for (const [p] of html.matchAll(/<p>(?:(?!<\/p>).)*?!\[(?:(?!<\/p>).)*?<\/p>/g)) {
    errors.push(`Image line not recognized: "${short(plain(p))}". Use exactly ${IMAGE_FORMAT} on its own line.`)
  }
  if (!plain(html.replace(/<figure>.*?<\/figure>/g, ''))) errors.push('The document has no article text.')

  const referenced = [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1].replace(/&quot;/g, '"')).filter((s) => !s.startsWith('data:'))
  for (const name of referenced) {
    if (imageNames.includes(name)) continue
    const similar = imageNames.find((n) => n.toLowerCase() === name.toLowerCase())
    errors.push(similar
      ? `Image "${name}" is referenced, but the selected file is called "${similar}". Names must match exactly.`
      : `Image "${name}" is referenced in the document but was not selected.`)
  }
  for (const name of imageNames) {
    if (!referenced.includes(name)) warnings.push(`Image "${name}" was selected but is not used in the document.`)
  }

  const styles = [...new Set(messages.map((m) => m.message.match(/^Unrecognised paragraph style: '([^']+)'/)?.[1]).filter(Boolean))]
  if (styles.length) warnings.push(`Unknown Word styles were imported as normal text: ${styles.join(', ')}.`)
  for (const [, text] of html.matchAll(/<p><strong>([^<]{1,80})<\/strong><\/p>/g)) {
    warnings.push(`"${short(text)}" looks like a heading but is bold normal text. Use Heading 1 or Heading 3 if it is one.`)
  }
  if (!info.Tags && !asNormalText.includes('Tags')) warnings.push('No "Tags: …" line.')
  if (info.Abstract && info.Abstract.split(/\s+/).length > 200) warnings.push('The abstract is longer than 200 words.')

  return { errors, warnings }
}

panel.plugin('rrrr/docx-import', {
  sections: {
    docximport: {
      data() {
        return { mammoth: null, template: null, busy: false, errors: [], warnings: [], article: null }
      },
      async created() {
        Object.assign(this, await this.load())
      },
      methods: {
        // exposed as methods so the self-check can reach them
        parseArticle,
        checkArticle,

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
          Object.assign(this, { errors: [], warnings: [], article: null })

          const docx = files.filter((f) => f.name.toLowerCase().endsWith('.docx'))
          const images = files.filter((f) => !docx.includes(f))
          if (docx.length !== 1) {
            this.errors = ['Select exactly one .docx file, plus the images it references.']
            return
          }

          this.busy = true
          try {
            this.article = await this.importArticle(docx[0], images)
          } catch (e) {
            this.errors = [e.message]
          } finally {
            this.busy = false
          }
        },

        async importArticle(docx, images) {
          await loadScript(this.mammoth)
          const { value, messages } = await window.mammoth.convertToHtml({ arrayBuffer: await docx.arrayBuffer() }, mammothOptions)
          if (!value.trim()) throw new Error('The .docx appears to be empty or could not be read.')

          const parsed = parseArticle(value)
          const { errors, warnings } = checkArticle(parsed, messages, images.map((f) => f.name))
          this.warnings = warnings
          if (errors.length) {
            this.errors = errors
            return null
          }
          const { meta, html } = parsed

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
        <k-section
          label="Import article from DOCX"
          :buttons="template ? [{ icon: 'download', text: 'Article template (.docx)', link: template, download: true }] : []"
        >
          <label class="k-docx-import">
            <input type="file" accept=".docx,image/*" multiple :disabled="busy" @change="onSelect" hidden>
            <k-box
              :icon="busy ? 'loader' : 'upload'"
              :text="busy ? 'Importing…' : 'Select one .docx plus its images'"
              style="cursor: pointer"
            />
          </label>
          <k-box v-if="errors.length" theme="negative" style="margin-top: var(--spacing-2); display: block">
            <p><strong>Not imported, please fix this first:</strong></p>
            <ul style="list-style: disc; margin-left: 1.25em">
              <li v-for="e in errors" :key="e">{{ e }}</li>
            </ul>
          </k-box>
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
