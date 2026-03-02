let open = false;
let currentModal = '';

export const modal = {
    name: 'modal',
    component() {
        return {
            open: false,
            currentModal: '',
            init() {
                document.addEventListener('show-modal', () => {
                    modal.component().open = true
                })

                document.addEventListener('close-modal', () => {
                    modal.component().open = false
                })

            },
            subscribe(callback) {
                window.addEventListener('show-modal', callback);
                window.addEventListener('close-modal', callback);
                return () => {
                    window.removeEventListener('show-modal', callback);
                    window.removeEventListener('close-modal', callback);
                };
            },
            show() {
                modal.component().open = true;
                open = true;
                let rerenderEvent = new Event('show-modal');
                dispatchEvent(rerenderEvent);
                this.addEscapeKeyListener();
                console.log('Showing Modal');
            },
            hide() {
                modal.component().open = false;
                open = false;
                this.currentModal = '';
                let rerenderEvent = new Event('close-modal');
                dispatchEvent(rerenderEvent);
                this.removeEscapeKeyListener();
                console.log('Hiding Modal');
            },
            getIsOpen() {
                return open;
            },
            addEscapeKeyListener() {
                this.escapeKeyListener = event => {
                    if (event.key === 'Escape') {
                        this.hide();
                    }
                };
                window.addEventListener('keydown', this.escapeKeyListener);
            },
            removeEscapeKeyListener() {
                window.removeEventListener('keydown', this.escapeKeyListener);
            },
            openModal(name){
                this.currentModal = name;
                this.show();
            }
        }
    }
}

export default modal;
