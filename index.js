const express = require('express')
const path = require('path')

const app = new express()
const distDir = '/dist/lightfeather-coding-challenge'
app.use(express.json())

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, `${distDir}/index.html`))
})

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, `${distDir}/${req.path}`))
})

app.post('/echo', async (req, res) => {
    try {
        res.json({
            'body': req.body
        })
    }
    catch(e) {
        res.json({
            'error': e.message
        })
    }
})

app.listen(8080, () => {
    console.log('Listening on 8080. Ctrl+c to stop this server.')
})