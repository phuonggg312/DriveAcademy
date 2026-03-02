let liveChatSystem = '';

export const livechat = {
    name: 'livechat',
    component(cookieExpiryDays) {
        return {
            isDragging: false,
            startY: 0,
            initialY: 0,
            modalShowing: true,
            cookieExpiryDays: cookieExpiryDays || 1,
            init() {
                // Initialize the component and check for the cookie
                const cookie = this.getCookie('livechat_modal');
                if (cookie === 'true') {
                    this.modalShowing = false;
                }
            },

            closeModal() {
                this.modalShowing = false;
                this.setCookie('livechat_modal', 'true', this.cookieExpiryDays);
            },

            setCookie(name, value, days) {
                const d = new Date();
                d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
                document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}`;
            },

            getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }
        }
    }
};

export default livechat;
