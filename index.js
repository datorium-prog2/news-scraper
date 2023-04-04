const express = require('express')
const cheerio = require("cheerio")
const axios = require("axios")

const app = express()
const port = 3000

async function performDelfiScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.delfi.lv/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const $ = cheerio.load(axiosResponse.data)

    const image = $('article:first-of-type img').first()
    const heading = $('article:first-of-type .headline__title').first()
    const anchor = $('article:first-of-type a').first()
    const imageSrc = image.attr('src')
    const headingText = heading.text().trim()
    const articleUrl = anchor.attr('href')

    return {
        imageSrc: imageSrc,
        headingText: headingText,
        articleUrl: articleUrl,
    }
}


app.get('/', async (req, res) => {
    const {imageSrc, headingText, articleUrl} = await performDelfiScraping()

    res.send(`
        <a href="${articleUrl}" target="_blank">
            <img src="${imageSrc}" alt="${headingText}" width="400">
            <h2>${headingText}</h2>    
        </a>
    `)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})