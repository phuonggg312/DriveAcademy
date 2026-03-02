import { debounce } from "alpinejs/src/utils/debounce";

export default {
    name: 'modelview',
    store() {
        return {
            isModelView: Alpine.$persist([]).as('isModelView'),
            init() {
                this.dispatchEvent();
                // Add event listener for modelview-toggle
                window.addEventListener('modelview-toggle', this.setModelView.bind(this));
            },
            setModelView(event) {
                this.isModelView = event.detail.isModelView;
                this.dispatchEvent();
            },
            toggleModelView: debounce(function() {
                this.isModelView = !this.isModelView;
                this.dispatchEvent();
            }, 300),
            dispatchEvent(){
                window.dispatchEvent(new CustomEvent('modelview-toggled', {
                    detail: { isModelView: this.isModelView }
                }));
            }
        };
    }
};
