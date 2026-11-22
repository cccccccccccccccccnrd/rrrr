// node utils/printCss.check.mts — self-check for the print.css helpers
import assert from 'node:assert/strict'
import { parseRules, belongsTo, setDeclaration } from './printCss.ts'

const css = `@page { size: A4; }
/* spacing { fix } */
.blank #block-1-p-0 { margin-top: 2em !important; }
.blank-two #block-1-p-0 { margin-top: 3em !important; }
@media print { .blank #x { color: red } }`

const { rules, rest } = parseRules(css)
assert.equal(rules.length, 4)
assert.equal(rest, '')
assert.equal(rules[1].selector, '.blank #block-1-p-0') // comment (with a brace) stays attached but isn't the selector
assert.deepEqual(rules.filter((r) => belongsTo(r, 'blank')).map((r) => r.selector), ['.blank #block-1-p-0'])
assert.equal(parseRules('.a { x: y }\n.b { margin').rest, '.b { margin') // unfinished rule is reported, not dropped

// only the declaration changes; other declarations and other articles stay
const withBreak = setDeclaration(css, '.blank #block-1-p-0', 'page-break-before', 'always')
assert.match(withBreak, /margin-top: 2em !important;\n {2}page-break-before: always !important;/)
assert.match(withBreak, /\.blank-two #block-1-p-0 \{ margin-top: 3em/)
const noMargin = setDeclaration(withBreak, '.blank #block-1-p-0', 'margin-top', null)
assert.doesNotMatch(noMargin, /\.blank #block-1-p-0 \{[^}]*margin-top/)
assert.match(noMargin, /\.blank #block-1-p-0 \{\n {2}page-break-before: always !important;\n\}/)
assert.doesNotMatch(setDeclaration(noMargin, '.blank #block-1-p-0', 'page-break-before', null), /\.blank #block-1-p-0/) // empty rule dropped
assert.match(setDeclaration('', '.new #b', 'margin-top', '1em'), /^\.new #b \{\n {2}margin-top: 1em !important;\n\}/)
assert.match(setDeclaration('.a #b { x: y; }\n/* end note */', '.a #b', 'x', null), /\/\* end note \*\/\n$/) // trailing comment survives
console.log('ok')
