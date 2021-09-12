import Component from '../core/Component.js'

export default class Title extends Component {

    template() {

        const { name, username } = this.$props

        return `
            <h2>Simple Sharing File</h2>
            <h4>${username} (${name})</h4>
        `
    }
}