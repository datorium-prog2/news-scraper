const express = require('express')
const cheerio = require("cheerio")
const axios = require("axios")

const port = 3000

const app = express()

app.set('view engine', 'ejs');
app.use(express.static('public'));

const getDataFromUrl = async (url) => {
    // downloading the target web page
    // by performing an HTTP GET request in Axios
    const axiosResponse = await axios.request({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    })

    return cheerio.load(axiosResponse.data)
}


async function performDelfiScraping() {
    const $ = await getDataFromUrl("https://www.delfi.lv/")

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
    const $ = await getDataFromUrl("https://www.tvnet.lv/")
  
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
    const $ = await getDataFromUrl("https://www.lsm.lv/")

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

const performNamedaysScraping = async () => {
    const $ = await getDataFromUrl("https://xn--kalendrs-m7a.lv/%C5%A1odien")

    const nameArr = []

    const primaryNames = $("ul.day-common li")
    const additionalNames = $("p.day-common").text()

    primaryNames.each((i, elm) => {
        nameArr.push($(elm).text())
    });

    const additionalNamesArr = additionalNames.split(',')

    return [
        ...nameArr,
        ...additionalNamesArr,
    ]
}


const performBitcounScraping = async () => {
    const $ = await getDataFromUrl("https://www.google.com/search?q=bitcoin+value&oq=bitcoin+value&aqs=chrome..69i57j0i512l9.2961j1j4&sourceid=chrome&ie=UTF-8")
    const value = $('.pclqee').text()
    
    return `${value} €`
}


app.get('/', async (req, res) => {
    const [delfiData, tvnetData, lsmData, namesDayNames, bitcoinValue] = await Promise.all([
        performDelfiScraping(), 
        performTVnetScraping(), 
        performLsmScraping(),
        performNamedaysScraping(),
        performBitcounScraping(),
    ])

    const news = [
        {
            name: "delfi",
            data: delfiData
        },
        {
            name: "tvnet",
            data: tvnetData
        },
        {
            name: "lsm",
            data: lsmData
        }
    ]

    res.render('index', {
        news,
        namesDayNames: namesDayNames.join(', '), 
        bitcoinValue
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
