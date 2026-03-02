import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import AlpineCollapse from '@alpinejs/collapse'
import AlpineFocus from '@alpinejs/focus'
import AlpineMorph from '@alpinejs/morph'
import AlpineWire from '../../js/alpine/plugins/wire'
import AlpineGlobals from '../../js/alpine/index.js'

export const start = () => {

    // Register and initialize AlpineJS
    if (!window.Alpine) {
        window.Alpine = Alpine

        Alpine.plugin(AlpineCollapse)
        Alpine.plugin(AlpineFocus)
        Alpine.plugin(AlpineWire)
        Alpine.plugin(AlpineMorph)
        Alpine.plugin(persist)

        AlpineGlobals.register(Alpine)
        Alpine.start()
    }
};

export const getAlpineStore = (storeName) => {
    if (window.Alpine && window.Alpine.store) {
        const store = window.Alpine.store(storeName);
        if (store) {
            return store;
        }
    }
    return null;
};
