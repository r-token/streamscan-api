const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

var port = process.env.PORT || 3000
const app = express()

app.get('/', function (req, res) {
    res.send(JSON.stringify({ Hello: 'World'}))
})

app.get('/api/hulu', function (req, res) {
    //Scrape Hulu with Live TV Channels
    axios.get('https://www.hulu.com/live-tv').then((response) => {
        //Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)
        //'response' is an HTTP response object, whose body is contained in its 'data' attribute

        var huluChannels = []

        //var channels = $('div.network-list').children().attr('alt')
        $('div.network-list').children().map(function (index, element) {
            huluChannels[index] = $(this).attr('alt')
        })

        huluChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })

        res.write(JSON.stringify({Price: "$44.99/month", Channels: huluChannels}))
        res.end()
    })
})

app.get('/api/vue', function (req, res) {
    //Scrape PlayStation Vue Access Bundle Channels
    axios.get('https://www.groundedreason.com/replace-cable-with-playstation-vue/').then((response) => {
        //Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)
        //'response' is an HTTP response object, whose body is contained in its 'data' attribute

        //The p CSS selector matches all 'p' elements
        const urlElems = $('p')

        const urlSpan = $(urlElems[10])
        const urlText = urlSpan.text()
        const splitText = urlText.split(':')
        const channels = splitText[1]
        const uglyVueChannels = channels.split(',')
        const vueChannels = uglyVueChannels.map(function (channel) {
            return channel.trim()
        })

        vueChannels[0] = "ABC On Demand"
        vueChannels[vueChannels.length-1] = "WE TV"

        vueChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })
        
        res.write(JSON.stringify({Price: "$44.99/month", Channels: vueChannels}))
        res.end()
    })
})

app.get('/api/yttv', function (req, res) {
    //Scrape YouTube TV Channels
    axios.get('https://www.groundedreason.com/youtube-tv-channels/').then((response) => {
        //Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)
        //'response' is an HTTP response object, whose body is contained in its 'data' attribute

        //The p CSS selector matches all 'p' elements
        const urlElems = $('p')

        const urlSpan = $(urlElems[12])
        const urlText = urlSpan.text()
        const splitText = urlText.split(':')
        const channels = splitText[1]
        const uglyYTTVChannels = channels.split(',')
        const YTTVChannels = uglyYTTVChannels.map(function (channel) {
            return channel.trim()
        })

        YTTVChannels[YTTVChannels.length - 1] = "WE TV"

        YTTVChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })
        
        res.write(JSON.stringify({Price: "$49.99/month", Channels: YTTVChannels}))
        res.end()
    })
})

app.get('/api/sling-blue', function (req, res) {
    //Scrape Hulu with Live TV Channels
    axios.get('https://www.dailydot.com/upstream/sling-tv-channels-lineup/').then((response) => {
        //Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })
        //'response' is an HTTP response object, whose body is contained in its 'data' attribute

        var slingBlueChannels = []

        //var channels = $('div.network-list').children().attr('alt')
        $('ul  > li > span').each(function(index, element) {
            slingBlueChannels[index] = $(this).text()
        })

        slingBlueChannels.splice(0, 79)
        slingBlueChannels.splice(48)

        slingBlueChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })

        res.write(JSON.stringify({Price: "$25/month", Channels: slingBlueChannels}))
        res.end()
    })
})

app.get('/api/sling-orange', function (req, res) {
    //Scrape Hulu with Live TV Channels
    axios.get('https://www.dailydot.com/upstream/sling-tv-channels-lineup/').then((response) => {
        //Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })
        //'response' is an HTTP response object, whose body is contained in its 'data' attribute

        var slingOrangeChannels = []

        //var channels = $('div.network-list').children().attr('alt')
        $('ul  > li > span').each(function(index, element) {
            slingOrangeChannels[index] = $(this).text()
        })

        slingOrangeChannels.splice(0, 45)
        slingOrangeChannels.splice(34)


        slingOrangeChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })

        res.write(JSON.stringify({Price: "$25/month", Channels: slingOrangeChannels}))
        res.end()
    })
})

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
})