let activeMenuId = null;

export const navigation = {
    name: 'navigation',
    store() {
        return {
            megaMenuLinks: null,
            activeMenuIdData: null,
            isMegamenuVisible: false,
            init() {
                this.megaMenuLinks = document.querySelectorAll('.header-menu li');

                for (let j = 0; j < this.megaMenuLinks.length; j++) {
                    const headerElement = this.megaMenuLinks[j];
                    headerElement.addEventListener('mouseenter', this.onMegamenuHover.bind(headerElement))
                }

                const closeHandler = this.close.bind(this);
                window.addEventListener('megamenu-close', closeHandler);
            },
            subscribe(callback) {
                window.addEventListener('megamenu-hover', callback);
                return () => {
                    window.removeEventListener('megamenu-hover', callback);
                };
            },
            getMenuId() {
                return activeMenuId;
            },
            getMenuIdActual() {
                return navigation.store().activeMenuIdData;
            },
            close() {
                this.activeMenuIdData = null;
                activeMenuId = null;

                if (activeMenuId === '') {
                    document.body.classList.add('megamenu-active')
                } else {
                    document.body.classList.remove('megamenu-active')
                }
                let dispatchEvent = new Event('megamenu-hover');
                window.dispatchEvent(dispatchEvent);
                return activeMenuId;
            },
            setMenuId(val) {
                this.activeMenuIdData = val;
                activeMenuId = val;
                let dispatchEvent = new Event('megamenu-hover');
                window.dispatchEvent(dispatchEvent);

                if (activeMenuId || activeMenuId === '') {
                    document.body.classList.add('megamenu-active')
                } else {
                    document.body.classList.remove('megamenu-active')
                }

                if (activeMenuId == null){
                    let dispatchEvent = new Event('megamenu-closed');
                    window.dispatchEvent(dispatchEvent);
                }
                return activeMenuId;
            },
            onMegamenuHover(element = document) {

                if (element) {
                    const targetElement = element.target;
                    const megamenuId = targetElement.getAttribute('data-id');
                    this.activeMenuIdData = megamenuId;
                    activeMenuId = megamenuId;
                    navigation.store().setMenuId(megamenuId);
                } else {
                    let dispatchEvent = new Event('megamenu-closed');
                    window.dispatchEvent(dispatchEvent);
                    navigation.store().setMenuId(null);
                }
            },
        }
    }
}

export default navigation;
