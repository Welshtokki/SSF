const chokidar = require('chokidar')


class Observer {
    constructor(targetPath, server) {
        this.targetPath = targetPath
        this.server = server
    }

    watchFolder() {

        const watchingHandler = filePath => {
            if(this.server.state === true) {
                console.log(`Detected : ${filePath}`)

                const data = {Req: 'Reload'}

                this.server.webSocket.sendToClients(JSON.stringify(data))
            }
        }

        if(this.targetPath) {
            try {
                const watcher = chokidar.watch(this.targetPath, {persistent: true})

                watcher.on('add', watchingHandler)
                    .on('change', watchingHandler)
                    .on('unlink', watchingHandler)

            } catch(error) {
                console.log(error)
            }
        }
    }
}

module.exports.Observer = Observer