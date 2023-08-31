import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fetch from 'node-fetch'
import MarkdownIt from 'markdown-it'
import mdfigcaption from 'markdown-it-image-figures'
import mdfootnote from 'markdown-it-footnote'
import fm from 'front-matter'
import FormData from 'form-data'

if (process.argv.length === 2) {
  console.error('please provide folder name')
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const url = 'http://0.0.0.0:8000/api/'
const folder = process.argv[2]

const md = new MarkdownIt().use(mdfigcaption, {
  figcaption: true
}).use(mdfootnote)

md.renderer.rules.footnote_anchor = () => {
  return ''
}

async function get (route) {
  const response = await fetch(`${url}${route}`, {
    headers: {
      'Authorization': 'Basic aGlAYXV0aC5jb206YXV0aGF1dGg='
    }
  })
  const json = await response.json()
  return json
}

async function post (route, body, patch) {
  const response = await fetch(`${url}${route}`, {
    method: patch ? 'patch' : 'post',
    headers: {
      'Authorization': 'Basic aGlAYXV0aC5jb206YXV0aGF1dGg='
    },
    body: body.constructor.name === 'FormData' ? body : JSON.stringify(body)
  })
  const json = await response.json()
  return json
}

function read (path) {
  return fs.readFileSync(path, 'utf-8')
}

function parse (article) {
  const meta = fm(article)
  const content = article.split('\n').splice(meta.bodyBegin - 1).join('\n')
  const [html, literature] = md.render(content).split('<hr class="footnotes-sep">')

  return {
    meta: {
      ...meta.attributes,
      literature,
      doi: '10.11588/ic.2021.3.81537',
      license: 'Creative Commons license (CC BY 4.0)'
    },
    html
  }
}

async function upload (file) {
  const article = read(path.join(__dirname, `articles/${folder}/${file}`))
  const { meta, html } = parse(article)
  console.log(meta, html)
  const body = {
    title: meta.title,
    template: 'article',
    content: {
      ...meta,
      text: html
    }
  }

  return
  const response = await post('pages/articles/children', body)

  if (response.status === 'ok') {
    console.log(response)
    return response.data
  } else {
    console.log(response.message)
  }
}

async function image (id, filename) {
  const fd = new FormData()
  fd.append('file', fs.createReadStream(path.join(__dirname, `articles/${folder}/${filename}`)))
  fd.append('template', 'blocks/image')
  const response = await post(`pages/${id}/files`, fd)
  console.log(response)
  return response.data.id
}

async function visuals (article) {
  const images = article.content.text.filter((b) => b.type === 'image' && b.content.location === 'web').map((b) => b.content.src)
  await Promise.all(images.map(async (filename) => await image(article.id.replace('/', '+'), filename)))

  const body = {
    text: article.content.text.map((b) => {
      console.log(b)
      if (b.type === 'image' && b.content.location === 'web') {
        return {
          ...b,
          content: {
            location: 'kirby',
            image: [{
              id: `${article.id}/${b.content.src}`
            }],
            alt: b.content.alt,
            caption: b.content.caption,
          }
        }
      } else {
        return b
      }
    })
  }

  const response = await post(`pages/${article.id.replace('/', '+')}`, body, 'patch')
  console.log(response)
}

function init () {
  const files = fs.readdirSync(path.join(__dirname, `articles/${folder}`)).filter((f) => f.endsWith('.md') && !f.includes('backup'))
  console.log(files)
  files.map(async (file) => {
    const article = await upload(file)
    /* console.log(article) */
    /* await visuals(article) */
  })
}

/* image() */
init()