import * as AnimationModule from "./animations";
import * as RendererModule from "./renderer";
import * as ComponentsModule from "./components";

export function addListeners(){
    if (Shopify.designMode) {
        document.addEventListener("shopify:section:load", function() {
            AnimationModule.start();
            RendererModule.renderReactBlocks(ComponentsModule.getComponents());
        });

        document.addEventListener("shopify:section:unload", function() {
            AnimationModule.start();
            RendererModule.renderReactBlocks(ComponentsModule.getComponents());
        });

        document.addEventListener("shopify:block:select", function() {
            AnimationModule.start();
            RendererModule.renderReactBlocks(ComponentsModule.getComponents());
        });
    }
}
