const { ipcMain, ipcRenderer } = require('electron')

class IPC {
    static validChannels = ['Server', 'OpenShareFolder', 'Log', 'Password']

    static sendToMain(channel, data) {
        if (IPC.validChannels.includes(channel)) {
            ipcRenderer.send(channel, data)
        }
    }

    static addMainReceiver(channel, handler) {
        if (IPC.validChannels.includes(channel)) {
            ipcMain.on(channel, handler)
        }
    }

    static addRendererReceiver(channel, handler) {
        if (IPC.validChannels.includes(channel)) {
            ipcRenderer.on(channel, handler)
        }
    }
}

exports.IPC = IPC
