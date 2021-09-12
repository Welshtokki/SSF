const fs = require('fs')
const chokidar = require('chokidar')
const { Util } = require('./util')


class Observer {
    constructor(targetPath, server) {
        this.targetPath = targetPath
        this.server = server
        this.watcher = null
    }

    watchFolder() {

        const watchingHandler = filePath => {

            if (this.server.state === true) {
                console.log(`Detected : ${filePath}`)

                const files = Util.getFilesInDirectory(this.targetPath)
                const data = { files }

                this.server.webSocket.sendToClients(JSON.stringify(data))
            }
        }

        if (this.targetPath) {
            try {
                if (process.platform === 'win32') {
                    this.watcher = chokidar.watch(this.targetPath, { persistent: true })
                }
                if (process.platform === 'darwin') {
                    this.watcher = chokidar.watch(this.targetPath, {
                        persistent: true, usePolling: true, useFsEvents: false
                    })
                }

                if (this.watcher !== null) {
                    this.watcher.on('add', watchingHandler)
                        .on('change', watchingHandler)
                        .on('unlink', watchingHandler)
                }

            } catch (error) {
                console.log(error)
            }
        }
    }
}

module.exports.Observer = Observer