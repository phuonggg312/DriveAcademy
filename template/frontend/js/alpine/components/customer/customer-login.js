const RECOVER_HASH = '#recover'

export default {
    name: 'customerlogin',
    component() {
        return {
            showPasswordReset: false,
            init() {
                if (window.location.hash === RECOVER_HASH) {
                    this.showPasswordReset = true
                }
            },
            toggleShowPasswordReset() {
                this.showPasswordReset = !this.showPasswordReset;

                if (this.showPasswordReset) {
                    history.replaceState(null, null, RECOVER_HASH);
                } else {
                    history.replaceState(null, null, ' ');
                }
            },
            scrollToTop () {
                window.scrollTo({ top: 0, left: 0 });
            }
        }
    }
}