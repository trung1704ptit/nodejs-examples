const express = require('express')
const cors = require('cors')
const videoRouter = require('./routes/video')

const app = express()

app.use(cors())
app.use(express.static('assets'))
app.use('/videos', videoRouter)


app.listen(5000, () => {
    console.log('App is running on port 5000')
})