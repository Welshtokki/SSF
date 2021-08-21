const fs = require('fs')
const path = require('path')
const { BrowserWindow, dialog, shell } = require('electron')
const { Server } = require('./server/server')
const { Observer } = require('./observer')
const { Config } = require('./config')

const mode = Config.product.mode

class Application {
    constructor (app) {
        this.app = app
        this.debugMode = Config.dev.debug
        this.server = new Server()
        this.observer = null
    }

    onReady () {
        this.createMainWindow()
        this.mainWindow.show()
    }

    onActivate () {
        if (BrowserWindow.getAllWindows().length === 0) {
            this.createMainWindow()
        }
    }

    onAllWindowsClosed () {
        if (process.platform !== 'darwin') {
            this.app.quit()
        }
    }

    createMainWindow () {
        this.mainWindow = new BrowserWindow({
            title: Config.product[mode].title ,//`SSF v${this.app.getVersion()} (${mode})`,
            width: Config.product[mode].width,
            height: Config.product[mode].height,
            icon: path.resolve(__dirname, 'icon', 'icon.png'),
            show: false,
            resizable: false,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true // Needed for E2E Test using Spectron
            }
        })

        this.mainWindow.on('closed', () => {
            const wins = BrowserWindow.getAllWindows()
            wins.forEach(win => {
                win.destroy()
            })

            this.mainWindow = null
        })

        this.mainWindow.removeMenu()
        this.mainWindow.loadFile(path.resolve(__dirname, 'index.html'))

        if(this.debugMode === true) {
            this.mainWindow.webContents.openDevTools({mode:'detach'})
        }
    }

    showMessage(option={type:'info', title:'Dialog', message:'Message'}) {
        dialog.showMessageBoxSync(this.mainWindow, option)
    }

    onServer(event, data) {

        if(data.enable === true) {
            this.server.openServer()

            setTimeout( () => {
                const url = `http://${this.server.address}:${this.server.port}`
                shell.openExternal(url)

                event.sender.send('Log', {'server': `${url}`})
            }, 100)
        }
        else {
            this.server.closeServer()

            event.sender.send('Log', {
                'server': `Server closed.`
            })
        }
    }

    onLog(event, data) {

    }

    onOpenShareFolder(event, data) {
        shell.openExternal(path.resolve('./share'))
    }

    makeShareFolder() {
        const sharePath = path.resolve('./share')

        if(fs.existsSync(sharePath) === false) {
            fs.mkdirSync(sharePath)
        }

        this.observer = new Observer(sharePath, this.server)
        this.observer.watchFolder()
    }
}

module.exports.Application = Application
