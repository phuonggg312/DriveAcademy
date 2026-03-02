export default {
    name: 'carouselFilter',
    component() {
        return {
            active: 0,
            init(){

            },
            changeActive(i) {
                this.active = i;
                this.$nextTick(() => {
                    var carouselContainer = this.$el.closest('.carousel-container');
                    var carousels = carouselContainer.querySelectorAll('.carousel');
                    for (i = 0; i < carousels.length; i++){
                        let flkty = Flickity.data( carouselContainer.querySelectorAll('.carousel')[i] );
                        flkty.resize();
                    }
                });
            }
        }
    }
}
