import Component from '../core/Component.js'

export default class Input extends Component {

    template() {

        const { id, type, placeholder, icon } = this.$props

        return `
            <div class="styled-input">
                ${icon ? `<i class="icon-${icon}"></i>` : ''}                
                <input type="${type}" id="${id}" placeholder="${placeholder}" />
            </div>
        `
    }

    setEvent() {

        const { searchFiles } = this.$props

        this.addEvent('keyup', '#inputSearch', ({ target }) => {
            const search = {
                keyword: target.value,
                focus: true
            }
            searchFiles(search)
        })

        this.addEvent('blur', '#inputSearch', ({ target }) => {
            const search = {
                keyword: target.value,
                focus: false
            }
            searchFiles(search)
        })
    }
}