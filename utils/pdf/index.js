const { exec } = require('child_process')
const fetch = require('node-fetch')
const fs = require('fs')

async function save (slug) {
  const response = await fetch(`http://localhost:4444/pdfs/${slug}`)
  const body = await response.text()
  fs.writeFileSync(`./htmls/${slug}.html`, content, "utf8")
}

async function init () {
  const slug = process.argv[2]

  /* await save(slug) */
  exec(
    `pagedjs-cli ./htmls/${slug}.html -o ./exports/${slug}.pdf --style style.css`,
    (error, stdout, stderr) => {
      console.log(slug)
    }
  )
}

init()
