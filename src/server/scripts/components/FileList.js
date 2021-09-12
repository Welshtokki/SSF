import Component from '../core/Component.js'

export default class FileList extends Component {

    template() {
        const files = this.$props

        return `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>File Name</th>
                        <th>Size</th>
                    </tr>
                </thead>
                <tbody>
                ${files.map(file => `<tr>
                        <td><a file="${file.name}" href="#">${file.name}</a></td>
                        <td><span>${file.size.number} ${file.size.unit}</span></td>
                    </tr>`).join('')}
                </tbody>
            </table>
        `
    }

    setEvent() {
        this.addEvent('click', 'a', ({ target }) => {
            const file = target.getAttribute('file')
            const password = document.querySelector('#inputPassword').value
            const url = `share/${file}?password=${password}`
            target.setAttribute('href', url)
        })
    }
}