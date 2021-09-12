const fs = require('fs')

class Util {
    static getFilesInDirectory(targetPath) {
        const fileArray = []
        const ignoreList = ['.DS_Store']

        fs.readdirSync(targetPath).forEach(file => {
            const fstat = fs.statSync(`${targetPath}/${file}`)
            const size = Util.calcFileSize(fstat.size)

            fileArray.push({
                name: file,
                size
            })
        })

        const files = fileArray.filter(fileInfo => ignoreList.includes(fileInfo.name) === false)

        return files
    }

    static calcFileSize(size) {
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
}

module.exports.Util = Util