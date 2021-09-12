import Component from './core/Component.js'
import Title from './components/Title.js'
import Input from './components/Input.js'
import FileList from './components/FileList.js'

export default class Share extends Component {
    setup() {
        this.$state = {
            search: {
                keyword: '',
                focus: false
            },
            files: this.$props.files
        }
    }

    template() {
        return `
            <header data-component="title"></header>
            <div data-component="password"></div>
            <hr>
            <div data-component="search"></div>
            <div data-component="file-list"></div>
        `
    }

    mounted() {
        const { filteredFiles, searchFiles } = this
        const { search } = this.$state
        const $title = this.$target.querySelector('[data-component="title"]')
        const $password = this.$target.querySelector('[data-component="password"]')
        const $search = this.$target.querySelector('[data-component="search"]')
        const $fileList = this.$target.querySelector('[data-component="file-list"]')
        const { host } = this.$props

        new Title($title, host)
        new Input($password, {
            id: 'inputPassword',
            type: 'password',
            placeholder: 'Server Password',
            icon: 'key'
        })
        new Input($search, {
            id: 'inputSearch',
            type: 'text',
            placeholder: 'Search',
            icon: 'search',
            searchFiles: searchFiles.bind(this)
        })
        new FileList($fileList, filteredFiles)

        if (search.focus) {
            inputSearch.focus()
            inputSearch.value = search.keyword
        }
    }

    get filteredFiles() {
        const { search, files } = this.$state

        if (search.keyword.length > 0) {
            return files.filter(file => file.name.includes(search.keyword))
        }

        return files
    }

    searchFiles(search) {
        this.setState({ search })
    }
}