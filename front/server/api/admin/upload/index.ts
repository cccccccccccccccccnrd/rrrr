import mammoth from 'mammoth'
import FormData from 'form-data'
import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { parseArticle } from './article'

export async function post(route: string, body: any, patch: boolean = false) {
  const isFormData = body?.constructor?.name === 'FormData'
  const method = patch ? 'PATCH' : 'POST'
  const response = await fetch(`${process.env.BASE_URL}${process.env.UPLOAD_SUFFIX}/${route}`, {
    method,
    headers: {
      Authorization: process.env.AUTH || '',
      Accept: 'application/json',
      ...(isFormData ? {} : { 'Content-Type': 'application/json' })
    },
    body: isFormData ? body : JSON.stringify(body)
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

    const result = await mammoth.convertToHtml({ buffer: docxFile.data })
    const { meta, html } = parseArticle(result.value)

    const articleResponse = await post('pages/articles/children', {
      title: meta.title,
      template: 'article',
      content: {
        ...meta,
        text: html
      }
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

async function uploadImages(article: any, files: any[]) {
  const articleId = article.id.replace('/', '+')
  
  const imageBlocks = article.content.text
    .filter((b: any) => b.type === 'image' && b.content.location === 'web')
    .map((b: any) => b.content.src)

  for (const imageName of imageBlocks) {
    const imageFile = files.find((f: any) => f.filename === imageName)
    
    if (imageFile) {
      const fd = new FormData()
      fd.append('file', imageFile.data, imageName)
      fd.append('template', 'blocks/image')

      await post(`pages/${articleId}/files`, fd)
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

  await post(`pages/${articleId}`, { text: updatedText }, true)
}