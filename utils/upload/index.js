import 'dotenv/config.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import MarkdownIt from 'markdown-it'
import mdfigcaption from 'markdown-it-image-figures'
import mdfootnote from 'markdown-it-footnote'
import FormData from 'form-data'
import mammoth from 'mammoth'

if (process.argv.length === 2) {
  console.error('please provide folder name')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const folder = process.argv[2]

const md = new MarkdownIt()
  .use(mdfigcaption, {
    figcaption: true
  })
  .use(mdfootnote)

md.renderer.rules.footnote_anchor = () => {
  return ''
}

async function post(route, body, patch) {
  const response = await fetch(`${process.env.BASE_URL}/${route}`, {
    method: patch ? 'patch' : 'post',
    headers: {
      Authorization: process.env.AUTH
    },
    body: body.constructor.name === 'FormData' ? body : JSON.stringify(body)
  })
  const json = await response.json()
  return json
}

function read(path) {
  return fs.readFileSync(path, 'utf-8')
}

function meta(m, article) {
  const regex = new RegExp(`<h2>${m.charAt(0).toUpperCase() + m.slice(1)}: (.*?)<\/h2>`, 'g')
  const match = [...article.matchAll(regex)]
  if (match.length > 0) {
    return match[0][1]
  } else {
    return ''
  }
}

function parse(article) {
  const visuals = [...article.matchAll(/(<p>!\[).*?("\)<\/p>)/g)]
  const literature = article.match(/(<ol>).*(<\/ol>)/g)[0]
  let html = article

  visuals.map((v) => {
    html = html.replace(v[0], md.render(v[0].replace(/<p>|<\/p>/g, '')))
  })
  html = html.replace(literature, '')
  html = html.replace(/<h2>(.*)<\/h2>/g, '')

  const title = meta('title', article)
  const author = meta('author', article)
  const abstract = meta('abstract', article)
  const context = meta('context', article)
  const tags = meta('tags', article)
  const suggestion = `${author}. ${new Date().getFullYear()}. ${title}. Cologne: rrrreflect.`

  const parsed = {
    meta: {
      title,
      author,
      abstract,
      context,
      tags,
      suggestion,
      doi: '',
      license: 'Creative Commons license (CC BY 4.0)',
      literature
    },
    html
  }
  console.log(parsed)
  return parsed
}

async function upload(file) {
  const p = path.join(__dirname, `articles/${folder}/${file}`)
  const article = await mammoth.convertToHtml({ path: p })
  const { meta, html } = parse(article.value)

  const body = {
    title: meta.title,
    template: 'article',
    content: {
      ...meta,
      text: html
    }
  }

  const response = await post('pages/articles/children', body)

  if (response.status === 'ok') {
    return response.data
  } else {
    console.log(response.message)
  }
}

async function image(id, filename) {
  const fd = new FormData()
  fd.append('file', fs.createReadStream(path.join(__dirname, `articles/${folder}/${filename}`)))
  fd.append('template', 'blocks/image')
  const response = await post(`pages/${id}/files`, fd)
  return response.data.id
}

async function visuals(article) {
  const images = article.content.text
    .filter((b) => b.type === 'image' && b.content.location === 'web')
    .map((b) => b.content.src)
  await Promise.all(images.map(async (filename) => await image(article.id.replace('/', '+'), filename)))

  const body = {
    text: article.content.text.map((b) => {
      if (b.type === 'image' && b.content.location === 'web') {
        return {
          ...b,
          content: {
            location: 'kirby',
            image: [
              {
                id: `${article.id}/${b.content.src}`
              }
            ],
            alt: b.content.alt,
            caption: b.content.caption
          }
        }
      } else {
        return b
      }
    })
  }

  const response = await post(`pages/${article.id.replace('/', '+')}`, body, 'patch')
}

async function init() {
  const files = fs
    .readdirSync(path.join(__dirname, `articles/${folder}`))
    .filter((f) => f.endsWith('.docx') && !f.includes('backup') && !f.includes('$'))
  files.map(async (file) => {
    const article = await upload(file)
    await visuals(article)
  })
}

init()
