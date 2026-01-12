import mammoth from 'mammoth'
import FormData from 'form-data'
import MarkdownIt from 'markdown-it'
// @ts-ignore
import mdfigcaption from 'markdown-it-image-figures'
// @ts-ignore
import mdfootnote from 'markdown-it-footnote'
import { request } from '../../../utils'

const md = new MarkdownIt()
  .use(mdfigcaption, { figcaption: true })
  .use(mdfootnote)

md.renderer.rules.footnote_anchor = () => ''

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    
    if (!form) {
      throw createError({ statusCode: 400, message: 'No files provided' })
    }

    const docxFile = form.find(item => item.name === 'docx')
    const associatedFiles = form.filter(item => item.name === 'files')
    
    if (!docxFile) {
      throw createError({ statusCode: 400, message: 'No .docx file provided' })
    }

    const result = await mammoth.convertToHtml({ buffer: docxFile.data })
    const { meta, html } = parseArticle(result.value)

    const articleResponse = await request('pages/articles/children', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: meta.title,
        template: 'article',
        content: {
          ...meta,
          text: html
        }
      }),
      raw: true
    })

    if (articleResponse.status !== 'ok') {
      throw createError({ 
        statusCode: 500, 
        message: articleResponse.message || 'Failed to create article' 
      })
    }

    const article = articleResponse.data

    if (associatedFiles.length > 0) {
      await uploadImages(article, associatedFiles)
      await updateArticleWithKirbyImages(article)
    }

    return { article }
  } catch (error: any) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Upload failed'
    })
  }
})

function parseArticle(html: string) {
  const visuals = [...html.matchAll(/(<p>!\[).*?("\)<\/p>)/g)]
  const literatureMatch = html.match(/(<ol>).*(<\/ol>)/g)
  const literature = literatureMatch ? literatureMatch[0] : ''
  
  let processedHtml = html
  
  visuals.forEach((v) => {
    processedHtml = processedHtml.replace(
      v[0], 
      md.render(v[0].replace(/<p>|<\/p>/g, ''))
    )
  })
  
  processedHtml = processedHtml.replace(literature, '')
  processedHtml = processedHtml.replace(/<h2>(.*)<\/h2>/g, '')

  const extractMeta = (key: string) => {
    const regex = new RegExp(
      `<h2>${key.charAt(0).toUpperCase() + key.slice(1)}: (.*?)<\/h2>`, 
      'g'
    )
    const match = [...html.matchAll(regex)]
    return match[0]?.[1] || ''
  }

  const title = extractMeta('title')
  const author = extractMeta('author')
  const abstract = extractMeta('abstract')
  const context = extractMeta('context')
  const tags = extractMeta('tags')

  return {
    meta: {
      title,
      author,
      abstract,
      context,
      tags,
      suggestion: `${author}. ${new Date().getFullYear()}. ${title}. Cologne: rrrreflect.`,
      doi: '',
      license: 'Creative Commons license (CC BY 4.0)',
      literature
    },
    html: processedHtml
  }
}

async function uploadImages(article: any, files: any[]) {
  const articleId = article.id.replace('/', '+')
  
  // Filter for image files referenced in article.content.text
  const imageBlocks = article.content.text
    .filter((b: any) => b.type === 'image' && b.content.location === 'web')
    .map((b: any) => b.content.src)

  for (const imageName of imageBlocks) {
    // Find matching file from uploaded files
    const imageFile = files.find(f => f.filename === imageName)
    
    if (imageFile) {
      const fd = new FormData()
      fd.append('file', imageFile.data, imageName)
      fd.append('template', 'blocks/image')

      await request(`pages/${articleId}/files`, {
        method: 'POST',
        headers: {
          ...fd.getHeaders()
        },
        body: fd,
        raw: true
      })
    }
  }
}

async function updateArticleWithKirbyImages(article: any) {
  const articleId = article.id.replace('/', '+')

  const updatedText = article.content.text.map((block: any) => {
    if (block.type === 'image' && block.content.location === 'web') {
      return {
        ...block,
        content: {
          location: 'kirby',
          image: [
            {
              id: `${article.id}/${block.content.src}`
            }
          ],
          alt: block.content.alt,
          caption: block.content.caption
        }
      }
    }
    return block
  })

  await request(`pages/${articleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: updatedText
    }),
    raw: true
  })
}