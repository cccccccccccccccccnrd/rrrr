// node site/plugins/docx-import/check.mjs — self-check for parseArticle/checkArticle
import { readFileSync } from 'fs'
import vm from 'vm'
import assert from 'assert' // loose deepEqual: arrays from the vm realm have a different prototype

let def
vm.runInNewContext(readFileSync(new URL('index.js', import.meta.url), 'utf8'), { panel: { plugin: (_, d) => (def = d) } })
const { parseArticle, checkArticle } = def.sections.docximport.methods
const check = (html, images = [], messages = []) => checkArticle(parseArticle(html), messages, images)

const info = '<h2>Title: A &amp; B</h2><h2>Author: Ada</h2><h2>Abstract: Short.</h2><h2>Tags: x, y</h2>'
const good = info + '<h1>Intro</h1><p>Text.</p><p>![Alt](fig-01.jpg "Cap")</p>'

assert.deepEqual(check(good, ['fig-01.jpg']), { errors: [], warnings: [] })
assert.equal(parseArticle(good).meta.title, 'A & B')
assert.equal(parseArticle(good.replace(/h2>/g, 'h6>')).meta.author, 'Ada') // old Heading 6 convention

const errs = (html, images = ['fig-01.jpg']) => check(html, images).errors.join('\n')
assert.match(errs(good.replace('<h2>Title: A &amp; B</h2>', '')), /Missing "Title/)
assert.match(errs(good.replace('Title:', 'Titel:')), /Unknown info field "Titel:"/)
assert.match(errs(good.replace('<h2>Author: Ada</h2>', '<p>Author: Ada</p>')), /"Author: …" is normal text/)
assert.match(errs(good.replace('<h2>Author: Ada</h2>', '<p><strong>Author:</strong> Ada</p>')), /"Author: …" is normal text/)
assert.match(errs(good + '<h4>Deep</h4>'), /Heading 4/)
assert.match(errs(good + '<h2>Section</h2>'), /only for the info fields/)
assert.match(errs(good + '<ul><li>a</li></ul>'), /lists/)
assert.match(errs(good + '<table><tr><td>x</td></tr></table>'), /Tables/)
assert.match(errs(good + '<p><img src="data:image/png;base64,AA" /></p>'), /pasted/)
assert.match(errs(good + '<p>![Alt](fig-02.jpg no quotes)</p>'), /not recognized/)
assert.match(errs(good, ['FIG-01.jpg']), /called "FIG-01.jpg"/)
assert.match(errs(good, []), /not selected/)
assert.match(errs(good.replace('Short.', 'Lorem ipsum')), /placeholder/)
assert.match(errs(good + '<p class="template-note">Delete me</p>'), /instructions/)
assert.match(errs(info + '<p>![Alt](fig-01.jpg "Cap")</p>'), /no article text/)
assert.match(check(good, ['fig-01.jpg', 'extra.jpg']).warnings.join(), /not used/)
assert.match(check(good + '<p><strong>Fake heading</strong></p>', ['fig-01.jpg']).warnings.join(), /looks like a heading/)
assert.deepEqual(check(good.replace('"Cap"', '“Cap”'), ['fig-01.jpg']).errors, []) // Word's curly quotes
// footnotes stay out of the body checks
assert.deepEqual(check(good + '<ol><li id="footnote-1"><p>Note</p></li></ol>', ['fig-01.jpg']).errors, [])
console.log('ok')
