const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

var port = process.env.PORT || 3000
const app = express()

const prodURL = "https://polar-tor-80040.herokuapp.com"

/// This could use a nice refactoring ///

// Prod
app.get('/', function (req, res) {
    res.send(JSON.stringify({Service1: "<a href = 'https://polar-tor-80040.herokuapp.com/api/dtvnow-plus'/>DirecTV Now - Plus</a>", Service2: "<a href = 'https://polar-tor-80040.herokuapp.com/api/dtvnow-max'/>DirecTV Now - Max</a>", Service3: "<a href = 'https://polar-tor-80040.herokuapp.com/api/fubo'/>Fubo TV</a>", Service4: "<a href = 'https://polar-tor-80040.herokuapp.com/api/hulu'/>Hulu</a>", Service5: "<a href = 'https://polar-tor-80040.herokuapp.com/api/philo'/>Philo</a>", Service6: "<a href = 'https://polar-tor-80040.herokuapp.com/api/sling-blue'/>Sling Blue</a>", Service7: "<a href = 'https://polar-tor-80040.herokuapp.com/api/sling-orange'/>Sling Orange</a>", Service8: "<a href = 'https://polar-tor-80040.herokuapp.com/api/vue-access'/>Vue - Access</a>", Service9: "<a href = 'https://polar-tor-80040.herokuapp.com/api/vue-core'/>Vue - Core</a>", Service10: "<a href = 'https://polar-tor-80040.herokuapp.com/api/yttv'/>YouTube TV</a>"}))
})

// DirecTV Now Plus
app.get('/api/dtvnow-plus', function (req, res) {
    //Scrape PlayStation Vue Access Bundle Channels
    axios.get('https://www.streamingobserver.com/directv-now-channels-list/').then((response) => {
        //Load the web page source code into a cheerio instance
        const $ = cheerio.load(response.data)
        //'response' is an HTTP response object, whose body is contained in its 'data' attribute

        const urlElems = $('p')

        const urlSpan = $(urlElems[14])
        const urlText = urlSpan.text()
        const splitText = urlText.split(':')
        const channels = splitText[4]
        const uglyDtvNowPlusChannels = channels.split(',')
        const dtvNowPlusChannels = uglyDtvNowPlusChannels.map(function (channel) {
           return channel.trim()
        })

        dtvNowPlusChannels[dtvNowPlusChannels.length - 1] = "VH1"

        dtvNowPlusChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })
        
        res.write(JSON.stringify({Price: "$50/month", Channels: dtvNowPlusChannels}))
        res.end()
    })
})

// DirecTV Now Max
app.get('/api/dtvnow-max', function (req, res) {
    axios.get('https://www.streamingobserver.com/directv-now-channels-list/').then((response) => {

        const $ = cheerio.load(response.data)

        const urlElems = $('p')

        const urlSpan = $(urlElems[16])
        const urlText = urlSpan.text()
        const splitText = urlText.split(':')
        const channels = splitText[4]
        const uglyDtvNowMaxChannels = channels.split(',')
        const dtvNowMaxChannels = uglyDtvNowMaxChannels.map(function (channel) {
           return channel.trim()
        })

        dtvNowMaxChannels[dtvNowMaxChannels.length - 1] = "VH1"
        dtvNowMaxChannels.push("YES Network")

        dtvNowMaxChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })
        
        res.write(JSON.stringify({Price: "$70/month", Channels: dtvNowMaxChannels}))
        res.end()
    })
})

// Fubo TV
app.get('/api/fubo', function (req, res) {
    axios.get('https://www.groundedreason.com/what-is-fubotv/').then((response) => {
        const $ = cheerio.load(response.data)

        const urlElems = $('p')
        const urlSpan = $(urlElems[13])
        const urlText = urlSpan.text()
        const uglyFuboChannels = urlText.split(',')
        const fuboChannels = uglyFuboChannels.map(function (channel) {
           return channel.trim()
        })

        fuboChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })

        //fuboChannels[5] = "beIN Sports Español"
        
        res.write(JSON.stringify({Price: "$54.99/month", Channels: fuboChannels}))
        res.end()
    })
})

// Hulu + Live TV
app.get('/api/hulu', function (req, res) {
    axios.get('https://www.dailydot.com/upstream/hulu-live-tv-channels-list/').then((response) => {

        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })

        var huluChannels = []

        $('ul  > li > span').each(function(index, element) {
            huluChannels[index] = $(this).text()
        })

        huluChannels.splice(0, 45)

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

// Philo
app.get('/api/philo', function (req, res) {
    axios.get('https://help.philo.com/hc/en-us/articles/360006214074-Channel-Lineup').then((response) => {
        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })

        var philoChannels = []

        $('div > div > img').map(function (index, element) {
            philoChannels[index] = $(this).attr('alt')
        })

        philoChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })

        res.write(JSON.stringify({Price: "$20/month", Channels: philoChannels}))
        res.end()
    })
})

// Sling TV Blue
app.get('/api/sling-blue', function (req, res) {
    axios.get('https://www.dailydot.com/upstream/sling-tv-channels-lineup/').then((response) => {

        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })

        var slingBlueChannels = []

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

// Sling TV Orange
app.get('/api/sling-orange', function (req, res) {
    axios.get('https://www.dailydot.com/upstream/sling-tv-channels-lineup/').then((response) => {
        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })

        var slingOrangeChannels = []

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

// PlayStation Vue
app.get('/api/vue-access', function (req, res) {
    axios.get('https://www.groundedreason.com/replace-cable-with-playstation-vue/').then((response) => {

        const $ = cheerio.load(response.data)
        
        const urlElems = $('p')
        const urlSpan = $(urlElems[10])
        const urlText = urlSpan.text()
        const splitText = urlText.split(':')
        const channels = splitText[1]
        const uglyVueAccessChannels = channels.split(',')
        const vueAccessChannels = uglyVueAccessChannels.map(function (channel) {
            return channel.trim()
        })

        vueAccessChannels[0] = "ABC On Demand"
        vueAccessChannels[vueAccessChannels.length-1] = "WE TV"

        vueAccessChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })
        
        res.write(JSON.stringify({Price: "$44.99/month", Channels: vueAccessChannels}))
        res.end()
    })
})

// PlayStation Vue
app.get('/api/vue-core', function (req, res) {
    axios.get('https://www.dailydot.com/upstream/playstation-vue-channels-list/').then((response) => {
        const $ = cheerio.load(response.data, {
            normalizeWhiteSpace: true,
            xmlMode: true
        })

        var uglyVueCoreChannels = []

        $('ul  > li > span').each(function(index, element) {
            uglyVueCoreChannels[index] = $(this).text()
        })

        var vueCoreChannels = uglyVueCoreChannels.map(function(channel) {
            return channel.trim()
        })

        vueCoreChannels.splice(0, 90)
        vueCoreChannels.splice(55)

        vueCoreChannels.sort(function(a, b) {
            var stringA = a.toLowerCase(), stringB = b.toLowerCase()
            if (stringA < stringB) {
                return -1
            }
            if (stringA > stringB) {
                return 1
            }
            return 0
        })

        res.write(JSON.stringify({Price: "$49.99/month", Channels: vueCoreChannels}))
        res.end()
    })
})

// YouTube TV
app.get('/api/yttv', function (req, res) {
    axios.get('https://www.groundedreason.com/youtube-tv-channels/').then((response) => {
        const $ = cheerio.load(response.data)

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


app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`)
})











//// Alternate Hulu Scrape ////

// app.get('/api/hulu', function (req, res) {
//     //Scrape Hulu with Live TV Channels
//     axios.get('https://www.hulu.com/live-tv').then((response) => {
//         //Load the web page source code into a cheerio instance
//         const $ = cheerio.load(response.data)
//         //'response' is an HTTP response object, whose body is contained in its 'data' attribute

//         var huluChannels = []

//         //var channels = $('div.network-list').children().attr('alt')
//         $('div.network-list').children().map(function (index, element) {
//             huluChannels[index] = $(this).attr('alt')
//         })

//         huluChannels.sort(function(a, b) {
//             var stringA = a.toLowerCase(), stringB = b.toLowerCase()
//             if (stringA < stringB) {
//                 return -1
//             }
//             if (stringA > stringB) {
//                 return 1
//             }
//             return 0
//         })

//         res.write(JSON.stringify({Price: "$44.99/month", Channels: huluChannels}))
//         res.end()
//     })
// })









// Almost a better version of YTTV scraping from YTTV's actual website. It's not returning every channel though :(

// app.get('/api/yttv', function (req, res) {
//     //Scrape YouTube TV Channels
//     axios.get('https://tv.youtube.com/welcome/').then((response) => {
//         //Load the web page source code into a cheerio instance
//         const $ = cheerio.load(response.data, {
//             normalizeWhiteSpace: true,
//             xmlMode: true
//         })
//         //'response' is an HTTP response object, whose body is contained in its 'data' attribute

//         //console.log($.html())

//         var duplicateYttvChannels = []
//         var yttvChannels = []

//         $('ul > li > div > a > div > div > img').map(function (index, element) {
//             duplicateYttvChannels[index] = $(this).attr('alt')
//         })

//         function unique(a) {
//             var seen = {}
//             return a.filter(function(item) {
//                 return seen.hasOwnProperty(item) ? false: (seen[item] = true)
//             })
//         }

//         yttvChannels = unique(duplicateYttvChannels)

//         yttvChannels.sort(function(a, b) {
//             var stringA = a.toLowerCase(), stringB = b.toLowerCase()
//             if (stringA < stringB) { return -1 }
//             if (stringA > stringB) { return 1 }
//             return 0
//         })

//         res.write(JSON.stringify({Price: "$49.99/month", Channels: yttvChannels}))
//         res.end()
//     })
// })
