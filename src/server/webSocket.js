const ws = require('ws')

class WebSocket {
    constructor(server) {
        this.wsServer = new ws.Server({server:server})

        this.wsServer.on('connection', (wss, req) => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

            console.log(`[WS][Connection] request from ${ip}`)

            wss.on('message', message => {
                console.log(`[WS][MSG][${ip}] ${message}`)

                wss.send(`[WS][Echo][${ip}] ${message}`)
            })

            wss.on('error', error => {
                console.log(error)
            })

            wss.on('close', () => {
                console.log(`[WS][Close] Disconnected : ${ip}`)
            })
        })
    }

    sendToClients(data) {

        this.wsServer.clients.forEach( client => {
            if(client.readyState === ws.OPEN) {
                client.send(data)
            }
        })

    }

    stop() {
        console.log('[WS] STOP')

        this.wsServer.clients.forEach( client => {
            if(client.readyState === ws.OPEN) {
                client.close()
            }
        })
    }

}

exports.WebSocket = WebSocket