const { app } = require('electron');
const { Application } = require('./application')
const { IPC } = require('./ipc')
const { Config } = require('./config')

if (Config.dev.debug) {
    require('electron-reload')(__dirname)
}

const application = new Application(app)
if (Config.product.mode === 'server') {
    application.makeShareFolder()
}
launchApp(application)
addIpcMainHandlers()

function launchApp(application) {
    app.on('ready', application.onReady.bind(application))
    app.on('activate', application.onActivate.bind(application))
    app.on('window-all-closed', application.onAllWindowsClosed.bind(application))
}

function addIpcMainHandlers() {
    IPC.addMainReceiver('Server', application.onServer.bind(application))
    IPC.addMainReceiver('Log', application.onLog.bind(application))
    IPC.addMainReceiver('OpenShareFolder', application.onOpenShareFolder.bind(application))
    IPC.addMainReceiver('Password', application.onPassword.bind(application))
}
