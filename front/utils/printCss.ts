// Helpers for print.css, which holds the shared rules plus per-article rules that start with `.<slug>`.
// Auto-imported by Nuxt (utils/), used by the CSS editor and the element inspector.

export interface CssRule {
  text: string // the full rule as written, including any comment above it
  selector: string // selector without comments, e.g. `.my-article #block-3-p-0`
}

// Splits top-level rules (an @media block counts as one). Braces inside comments are ignored.
// `rest` is non-comment text after the last complete rule (an unfinished rule); `tail` is that text as written.
// ponytail: braces inside strings (content: "{") aren't handled; print.css doesn't use them
export function parseRules (css: string): { rules: CssRule[], rest: string, tail: string } {
  const rules: CssRule[] = []
  let current = ''
  let depth = 0
  for (let i = 0; i < css.length; i++) {
    if (css.startsWith('/*', i)) {
      const end = css.indexOf('*/', i + 2)
      const stop = end === -1 ? css.length : end + 2
      current += css.slice(i, stop)
      i = stop - 1
      continue
    }
    const char = css[i]
    current += char
    if (char === '{') depth++
    if (char === '}' && depth > 0 && --depth === 0) {
      const text = current.trim()
      rules.push({ text, selector: stripComments(text.slice(0, openBrace(text))).trim() })
      current = ''
    }
  }
  return { rules, rest: stripComments(current).trim(), tail: current.trim() }
}

const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '')
// first `{` that isn't inside a comment
const openBrace = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, (c) => ' '.repeat(c.length)).indexOf('{')
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// `.blank` must not claim rules of `.blank-two`
export function belongsTo (rule: CssRule, slug: string) {
  return new RegExp(`^\\.${escapeRegExp(slug)}(?![\\w-])`).test(rule.selector)
}

// Sets (or with value null removes) one declaration on the rule with exactly this selector,
// leaving the rule's other declarations alone. Drops the rule if nothing is left in it.
export function setDeclaration (css: string, selector: string, property: string, value: string | null) {
  const { rules, tail } = parseRules(css)
  let found = false
  const out = rules.flatMap((rule) => {
    if (rule.selector !== selector) return [rule.text]
    found = true
    const open = openBrace(rule.text)
    const declarations = rule.text.slice(open + 1, -1).split(';').map((d) => d.trim()).filter(Boolean)
      .filter((d) => stripComments(d.split(':')[0]).trim() !== property)
    if (value !== null) declarations.push(`${property}: ${value} !important`)
    if (!declarations.length) return []
    return [`${rule.text.slice(0, open).trimEnd()} {\n  ${declarations.join(';\n  ')};\n}`]
  })
  if (!found && value !== null) out.push(`${selector} {\n  ${property}: ${value} !important;\n}`)
  return [...out, tail].filter(Boolean).join('\n\n') + '\n'
}
