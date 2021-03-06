const express = require('express')
const fs = require('fs')
const router =  express.Router()

const videos = require('../mockdata')
const id = 'tom and jerry'
console.log(videos[id])

// get list of videos
router.get('/', (req, res) => {
    res.json(videos)
})


// get caption
router.get('/video/:id/caption', (req, res) => {
    return res.sendFile(`assets/captions/${req.params.id}.vtt`, {root: './'})
})


// get single video
router.get('/:id/data', (req, res) => {
    const id = parseInt(req.params.id, 10)
    res.json(videos[id])
})


router.get('/video/:id', (req, res) => {
    const videoPath = `assets/${req.params.id}.mp4`
    const videoStat = fs.statSync(videoPath)
    const fileSize = videoStat.size
    const videoRange = req.header.range

    if (videoRange) {
        const parts = videoRange.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parseInt[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(videoPath, {start, end})
        const head =  {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": `bytes`,
            "Content-Length": chunksize,
            "Content-Type": "video/mp4" 
        }
        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4" 
        }

        res.writeHead(200, head)
        fs.createReadStream(videoPath).pipe(res)
    }
})

module.exports = router