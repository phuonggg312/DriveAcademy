let name = '';

export const toggledisplay = {
    name: 'toggledisplay',
    component() {
        return {
            is_open: false,
            init(nameIn) {
                if (nameIn) {
                    name = nameIn;

                    // Bind the toggle function to the current context
                    const toggleOpenHandler = (event) => {
                        if (name === event.detail.message) {
                            this.open();
                            console.log(`Toggling: ${this.is_open}`);
                        }
                    };
                    const toggleCloseHandler = (event) => {
                        if (name === event.detail.message) {
                            this.close();
                            console.log(`Toggling: ${this.is_open}`);
                        }
                    };
                    const toggleHandler = (event) => {
                        if (name === event.detail.message) {
                            this.toggle();
                            console.log(`Toggling: ${this.is_open}`);
                        }
                    };

                    window.addEventListener("toggle-display-open", toggleOpenHandler.bind(this));
                    window.addEventListener("toggle-display-close", toggleCloseHandler.bind(this));
                    window.addEventListener("toggle-display", toggleHandler.bind(this));
                    window.addEventListener('keydown', this.onKeyDownHandler.bind(this))

                }
            },
            toggle() {
                this.is_open = !this.is_open;
                this.checkRendering();
            },
            open() {
                this.is_open = true;
                this.checkRendering();
            },
            close() {
                this.is_open = false;
                this.checkRendering();
            },
            checkRendering(){
                if (this.is_open) {
                    document.body.classList.add('popup-active')
                } else {
                    document.body.classList.remove('popup-active')
                }
            },
            onKeyDownHandler(event) {
                if (event.key === 'Escape') {
                    this.close();
                }
            },
        }
    }
}

export default toggledisplay;
