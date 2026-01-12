import MarkdownIt from 'markdown-it'
// @ts-ignore
import mdfigcaption from 'markdown-it-image-figures'
// @ts-ignore
import mdfootnote from 'markdown-it-footnote'

const md = new MarkdownIt()
  .use(mdfigcaption, { figcaption: true })
  .use(mdfootnote)

md.renderer.rules.footnote_anchor = () => ''

export function parseArticle(html: string) {
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
