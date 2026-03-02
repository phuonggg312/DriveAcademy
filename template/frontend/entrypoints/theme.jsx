import "liquid-ajax-cart";

import * as AlpineModule from './modules/alpine';
import * as RendererModule from './modules/renderer';
import * as GlobalsModule from './modules/globals';
import * as ShopifyModule from './modules/shopify';
import * as ProdifyModule from './modules/prodify';

let getAlpineStore, mobileBreakpoint;

try {
    AlpineModule.start();
    getAlpineStore = AlpineModule.getAlpineStore;
    mobileBreakpoint = GlobalsModule.getMobileBreakpoint();

    ShopifyModule.addListeners();
    RendererModule.addListeners();
    ProdifyModule.start();
} catch (e) {
    console.error('Arctheme failed to start.', e.message);
}

export { getAlpineStore, mobileBreakpoint };