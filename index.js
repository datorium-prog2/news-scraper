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

    return cheerio.load(axiosResponse.data)
}


app.get('/', async (req, res) => {
    const pageData = await performDelfiScraping()

    console.log(pageData("body"))

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})