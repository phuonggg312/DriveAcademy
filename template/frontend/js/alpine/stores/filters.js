export default {
    name: 'filters',
    store() {
        return {
            open: false,
            init() {

            },
            toggle() {
                this.open = !this.open
            },
            close() {
                this.open = false
            },
            openDropdown() {
                this.open = true
            },
        }
    }
}
