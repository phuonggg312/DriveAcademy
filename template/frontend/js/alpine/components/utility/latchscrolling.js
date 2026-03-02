export default {
    name: "latchscrolling",
    component() {
        const useLatchScrolling = true;

        return {
            targetElement: null,
            pdpDetails: null,
            offset: -115,
            init() {
                if (!useLatchScrolling) return;

                this.targetElement = document.querySelector('.pdp-trigger');
                this.pdpDetails = document.querySelector('.pdp-details');

                if (this.targetElement && this.pdpDetails) {
                    window.addEventListener('scroll', this.checkScrollPosition.bind(this));
                    this.checkScrollPosition();
                }
            },
            getExactYPosition(element) {
                let yPosition = 0;
                let el = element;

                while (el) {
                    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
                    el = el.offsetParent;
                }

                return yPosition;
            },
            checkScrollPosition() {
                const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                const scrollYThreshold = this.getExactYPosition(this.targetElement);

                if (scrollPosition > ((scrollYThreshold) - (window.innerHeight + this.offset))) {
                    this.pdpDetails.classList.add('attached');
                } else {
                    this.pdpDetails.classList.remove('attached');
                }
            },
        }
    },
};
