const { app } = require('electron')

class Config {
    static product = {
        mode: 'server',
        server: {
            width: 460,
            height: 360,
            title: app ? `SSF v${app.getVersion()} (Server & Client)` : 'SSF (Server & Client)'
        },
        client: {
            width: 460,
            height: 140,
            title: app ? `SSF v${app.getVersion()} (Client)` : 'SSF (Client)'
        }
    }

    static dev = {
        debug: false
    }
}

exports.Config = Config