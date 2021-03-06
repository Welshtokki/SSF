const os = require('os')
const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const fileUpload = require('express-fileupload')
const { networkInterfaces } = require('os');
const { WebSocket } = require('./webSocket')
const { Util } = require('../util')

class Server {

    constructor(shareFolderPath) {
        this.app = express()
        this.app.use(fileUpload())
        this.app.use(favicon(path.resolve(__dirname, 'styles', 'icon', 'favicon.ico')))
        this.app.use('/styles', express.static(path.resolve(__dirname, 'styles')))
        this.app.use('/scripts', express.static(path.resolve(__dirname, 'scripts')))
        this.app.set('view engine', 'ejs')
        this.app.set('views', path.resolve(__dirname, 'views'))
        this.server = null
        this.state = false
        this.address = this.getAddress()
        this.sharePath = shareFolderPath
        this.webSocket = null
        this.password = ''
    }

    openServer() {
        this.app
            .get('/', (req, res) => {
                res.redirect('/share')
            })
            .get('/share', (req, res) => {

                const host = {
                    name: os.hostname(),
                    username: os.userInfo().username
                }

                const files = Util.getFilesInDirectory(this.sharePath)

                res.render('share', {
                    data: {
                        host,
                        files
                    }
                })
            })
            .get('/share/:fileName', (req, res) => {

                if (this.state === true) {

                    const pwFromClient = req.query.password
                    const fileName = req.params.fileName

                    const file = path.resolve(this.sharePath, fileName)
                    console.log(`[Down] ${file} [PW] ${pwFromClient}`)

                    if (this.password !== pwFromClient) {
                        return res.status(404).render('notFound', { address: `Invalid Password` })
                    }

                    try {
                        if (fs.existsSync(file)) {

                            res.download(file)
                        }
                        else {
                            res.status(404).render('notFound', { address: fileName })
                        }
                    } catch (e) {
                        console.log(e);
                        res.send(e.toString())
                    }
                }
                else {
                    // Server OFF
                    return res.status(521).render('close')
                }
            })
            .post('/share', (req, res) => {

                if (this.state === true) {
                    // Server ON
                    const uploadFile = req.files?.upload

                    if (uploadFile !== null) {
                        const filePath = path.resolve(this.sharePath, uploadFile.name)

                        uploadFile.mv(filePath, err => {
                            if (err) {
                                return res.status(500).send(err)
                            }
                            //const statsObj = fs.statSync(filePath)

                            const result = { 'result': 'OK' }
                            res.status(200).json(result)
                        })
                    }
                    else {
                        const err = { 'result': 'Fail' }
                        return res.status(500).json(err)
                    }
                }
                else {
                    // Server OFF
                    return res.status(521).render('close')
                }
            })
            .get('/:addr', (req, res) => {

                const addr = req.params.addr

                const routeToShare = ['index', 'index.html', 'main', 'main.html']

                if (routeToShare.includes(addr)) {
                    res.redirect('/share')
                }
                else {
                    res.status(404).render('notFound', { address: addr })
                }
            })

        this.server = this.app.listen(0, () => {
            this.state = true
            this.port = this.server.address().port
            console.log(`Listening at http://${this.address}:${this.port}`)

            this.webSocket = new WebSocket(this.server)
        })
    }

    closeServer() {
        console.log('Close the server.')
        this.state = false
        this.webSocket.stop()
        this.server.close()
    }

    getAddress() {
        const nets = networkInterfaces();
        const arrayIp = []

        const exceptionList = ['10.10.10.1']

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {

                    if (exceptionList.includes(net.address) === false) {

                        arrayIp.push(net.address)

                    }
                }
            }
        }

        console.log(`Network Interfaces : ${arrayIp.join(' / ')}`)

        const result = (arrayIp.length > 0) ? arrayIp[arrayIp.length - 1] : undefined

        return result
    }
}

exports.Server = Server


function calcFileSize(size) {
    let number = 0
    let unit = ''

    if (size < 1024) {
        number = size.toString()
        unit = 'bytes'
    }
    else if (size < (1024 ** 2)) {
        number = (size / 1024).toFixed(2)
        unit = 'KB'
    }
    else if (size < (1024 ** 3)) {
        number = (size / (1024 ** 2)).toFixed(2)
        unit = 'MB'
    }
    else if (size < (1024 ** 4)) {
        number = (size / (1024 ** 3)).toFixed(2)
        unit = 'GB'
    }

    return { number: Number(number), unit }
}