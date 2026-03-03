import mammoth from 'mammoth'
import FormData from 'form-data'
import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { parseArticle } from './article'

const mammothOptions = {
  styleMap: [
    "p[style-name='Quote'] => blockquote:fresh",
    "p[style-name='Block Quote'] => blockquote:fresh",
    "p[style-name='Intense Quote'] => blockquote:fresh",
    "p[style-name='Zitat'] => blockquote:fresh"
  ]
}

export async function post(route: string, body: any, patch: boolean = false) {
  const config = useRuntimeConfig()
  const isFormData = body?.constructor?.name === 'FormData'
  const method = patch ? 'PATCH' : 'POST'
  const url = `${config.baseURL}/api/${route}`
  
  console.log('POST to:', url)
  
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: config.auth,
      Accept: 'application/json',
      ...(isFormData ? body.getHeaders() : { 'Content-Type': 'application/json' })
    },
    body: isFormData ? body.getBuffer() : JSON.stringify(body)
  })
  const json = await response.json()
  return json
}

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    
    if (!form) {
      throw createError({ statusCode: 400, message: 'No files provided' })
    }

    const docxFiles = form.filter(item => item.name === 'docx')
    const associatedFiles = form.filter(item => item.name === 'files')
    
    if (docxFiles.length === 0 || docxFiles.length > 1) {
      throw createError({ statusCode: 400, message: 'Exactly one .docx file must be provided' })
    }
    
    const docxFile = docxFiles[0]

    const result = await mammoth.convertToHtml({ buffer: docxFile.data }, mammothOptions)
    
    console.log('Mammoth HTML output (first 2000 chars):', result.value.substring(0, 2000))
    
    const { meta, html } = parseArticle(result.value)

    // Generate URL-safe slug from title
    const slug = meta.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    console.log('Creating article with title:', meta.title)
    console.log('Generated slug:', slug)
    console.log('POST URL:', `${process.env.BASE_URL}${process.env.UPLOAD_SUFFIX}/pages/articles/children`)
    
    const articleResponse = await post('pages/articles/children', {
      slug,
      title: meta.title,
      template: 'article',
      content: {
        ...meta,
        text: html
      }
    })

    console.log('Kirby response:', JSON.stringify(articleResponse, null, 2))

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

async function uploadImages(article: any, files: any[]) {
  const articleId = article.id.replace('/', '+')
  
  const imageBlocks = article.content.text
    .filter((b: any) => b.type === 'image' && b.content.location === 'web')
    .map((b: any) => b.content.src)

  for (const imageName of imageBlocks) {
    const imageFile = files.find((f: any) => f.filename === imageName)
    
    if (imageFile) {      
      const fd = new FormData()
      fd.append('file', imageFile.data, {
        filename: imageName,
        contentType: imageFile.type || 'application/octet-stream'
      })
      fd.append('template', 'blocks/image')
      
      const response = await post(`pages/${articleId}/files`, fd)
      
      if (response.status !== 'ok') {
        console.error(`Failed to upload ${imageName}:`, response.message)
      }
    } else {
      console.warn(`No file found matching: ${imageName}`)
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

await post(`pages/${articleId}`, {
  text: updatedText
}, true)}