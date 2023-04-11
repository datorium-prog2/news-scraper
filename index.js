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

async function performTVnetScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.tvnet.lv/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })
  
    const $ = cheerio.load(axiosResponse.data)
  
    const image = $('.group-topic-with-custom-header article.list-article--1 div.list-article__image').first()
    const heading = $('.group-topic-with-custom-header article.list-article--1 div.list-article__headline').first()
    const anchor = $('.group-topic-with-custom-header article.list-article--1 a').first()
    const imageSrc = image.attr('content')
    const headingText = heading.text().trim()
    const articleUrl = anchor.attr('href')
  
    return {
        imageSrc: imageSrc,
        headingText: headingText,
        articleUrl: articleUrl,
    }
}

async function performLsmScraping() {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://www.lsm.lv/",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    const $ = cheerio.load(axiosResponse.data)
    const image = $("article:first-of-type img")
    const imageSrc = image.attr("data-src")

    const link = $("article:first-of-type a")
    const linkSrc = link.attr("href")

    const heading = $("article:first-of-type figcaption span").first()
    const headingText = heading.text().trim()

    return {
        imageSrc: imageSrc,
        headingText: headingText,
        linkSrc: linkSrc,
    }
}

app.get('/', async (req, res) => {
    const [delfiData, tvnetData, lsmData] = await Promise.all([
        performDelfiScraping(), 
        performTVnetScraping(), 
        performLsmScraping()
    ])

    res.send(`
        <div><h5>Šodien vārda dienu svin: <Parastos un paplašinātos vārdus></h5></div>
        <div style="display: flex; gap: 10px;">
            <div>
                <h1>Populārākā delfi ziņa</h1>
                <a href="${delfiData.articleUrl}" target="_blank">
                    <img src="${delfiData.imageSrc}" alt="${delfiData.headingText}" width="400">
                    <h2>${delfiData.headingText}</h2>    
                </a>
            </div>
            <div>
                <h1>Populārākā tvnet ziņa</h1>
                <a href="${tvnetData.articleUrl}" target="_blank">
                    <img src="${tvnetData.imageSrc}" alt="${tvnetData.headingText}" width="400">
                    <h2>${tvnetData.headingText}</h2>    
                </a>
            </div>
            <div>
                <h1>Populārākā lsm ziņa</h1>
                <a href="${lsmData.articleUrl}" target="_blank">
                    <img src="${lsmData.imageSrc}" alt="${lsmData.headingText}" width="400">
                    <h2>${lsmData.headingText}</h2>    
                </a>
            </div>
        </div>
    `)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
