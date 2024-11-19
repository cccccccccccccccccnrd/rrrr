const { exec } = require('child_process')
const fetch = require('node-fetch')
const fs = require('fs')

async function init() {
  if (process.argv[2] === 'ls') {
    const htmls = fs.readdirSync('./htmls').filter((file) => file.endsWith('.html'))
    htmls.forEach((html) => {
      const slug = html.replace('.html', '')
      const url = `http://localhost:4000/pdfs/${slug}`
      console.log(url)
    })
  } else if (process.argv[2] === 'all') {
    const command = fs
      .readdirSync('./htmls')
      .filter((file) => file.endsWith('.html'))
      .map((file) => file.replace('.html', ''))
      .map((slug) => `pagedjs-cli ./htmls/${slug}.html -o ./exports/${slug}.pdf --style style.css`)
      .join('\n')

    console.log(command)
    await exec(command, (error, stdout, stderr) => {
      console.log(error, stdout)
    })
  } else {
    const slug = process.argv[2]
    await exec(
      `pagedjs-cli ./htmls/${slug}.html -o ./exports/${slug}.pdf --style ./style.css`,
      (error, stdout, stderr) => {
        console.log(error, slug)
      }
    )
  }
}

init()
