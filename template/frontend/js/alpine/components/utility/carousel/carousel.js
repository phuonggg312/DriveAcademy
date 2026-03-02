export default {
    name: "carousel",
    component() {
        return {
            active: 0,
            hasInit: false,
            flickity: null,
            showPagination: false,
            showNavigation: true,
            setGallerySize: true,
            setFreeScroll: false,
            fadePartial: true,
            autoPlay: 0,
            sectionId: null,

            initialise(
                showPageDots = false,
                showNavigation = true,
                fadePartial = true,
                checkWidth = true,
                autoPlay = 0,
                sectionId,
                setGallerySize = true,
                setFreeScroll = false,
            ) {
                this.showPagination = showPageDots;
                this.showNavigation = showNavigation;
                this.setGallerySize = setGallerySize;
                this.fadePartial = fadePartial;
                this.autoPlay = autoPlay;
                this.sectionId = sectionId;
                this.setFreeScroll = setFreeScroll;

                if (!this.hasInit) {
                    this.hasInit = true;

                    if (checkWidth) {
                        const totalWidth = this.calculateTotalWidth();
                        const containerWidth = this.$refs.carousel.offsetWidth;

                        // Carousel items fit within the container. No need to initialize Flickity.
                        if (totalWidth <= containerWidth) return;
                    }

                    let flickityScript =
                        "https://unpkg.com/flickity@2.3.0/dist/flickity.pkgd.min.js";
                    let flickityStylesheet =
                        "https://unpkg.com/flickity@2.3.0/dist/flickity.css";

                    // Check if the script already exists
                    const existingScript = document.querySelector(
                        `script[src="${flickityScript}"]`,
                    );

                    // Check if the stylesheet already exists
                    const existingStylesheet = document.querySelector(
                        `link[href="${flickityStylesheet}"]`,
                    );

                    // Only append the script if it doesn't already exist
                    if (!existingScript) {
                        const script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = `${flickityScript}`;
                        document.head.appendChild(script);
                    }

                    // Only append the stylesheet if it doesn't already exist
                    if (!existingStylesheet) {
                        const stylesheet = document.createElement("link");
                        stylesheet.type = "text/css";
                        stylesheet.rel = "stylesheet";
                        stylesheet.href = `${flickityStylesheet}`;
                        document.head.appendChild(stylesheet);
                    }

                    this.$nextTick(() => {
                        const intervalId = setInterval(() => {
                            if (window.Flickity) {
                                this.initializeFlickity();
                                clearInterval(intervalId);
                            }
                        }, 100);
                    });

                    if (this.flickity) {
                        this.flickity.reloadCells();
                        this.flickity.resize();
                    }

                    // Add event listener for window resize
                    window.addEventListener("resize", this.handleResize.bind(this));
                }
            },

            destroy() {
                if (this.flickity) {
                    return new Promise((resolve) => {
                        this.flickity.destroy();
                        window.removeEventListener("carousel-navigate", this.navigate);
                        resolve();
                    }).then(() => {
                        // CLEANUP ON CHILDREN FOR TRANSFORM AS DESTROY RETAINS THIS
                        const children = this.$refs.carousel?.children;

                        if (children) {
                            for (let i = 0; i < children.length; i++) {
                                const child = children[i];
                                child.style.transform = "";
                                child.style.setProperty("transform", "");
                            }
                        }

                        this.hasInit = false;
                    });
                }
            },

            initializeFlickity() {
                if (this.flickity) this.flickity.destroy();

                this.flickity = new Flickity(this.$refs.carousel, {
                    wrapAround: true,
                    resize: true,
                    contain: true,
                    draggable: true,
                    pageDots: this.showPagination,
                    cellAlign: "left",
                    setGallerySize: this.setGallerySize,
                    imagesLoaded: true,
                    freeScroll: this.setFreeScroll,
                    prevNextButtons: this.showNavigation,
                    autoPlay: this.autoPlay,
                });

                this.handleResize();
                this.flickity.on("change", (i) => (this.active = i));

                // Observe changes to the carousel and reinitialize Flickity
                const observer = new MutationObserver((mutationsList, observer) => {
                    for (let mutation of mutationsList) {
                        if (mutation.type === "childList") {
                            this.flickity.reloadCells();
                            this.flickity.resize();
                        }
                    }
                });

                if (this.fadePartial) {
                    this.flickity.on("scroll", () => this.applyOpacity());
                    this.flickity.on("settle", () => this.applyOpacity());

                    this.applyOpacity(); // Apply initial opacity
                }

                observer.observe(this.$refs.carousel, {
                    childList: true,
                    subtree: true,
                });

                if (this.sectionId) {
                    window.addEventListener(
                        "carousel-navigate",
                        this.navigate.bind(this),
                    );
                }
                window.addEventListener("previousslide", this.prev.bind(this)); // Listen for previousslide event
                window.addEventListener("nextslide", this.next.bind(this));
            },
            handleResize() {
                if (this.flickity) {
                    this.flickity.resize();
                }
            },
            applyOpacity() {
                if (!this.flickity) return;
                if (this.flickity) {
                    const cells = this.flickity.getCellElements();
                    const margin = 50; // Adjust this value for the desired threshold allowance

                    cells.forEach((cell) => {
                        const cellRect = cell.getBoundingClientRect();
                        if (this.$refs.carousel) {
                            const parentRect = this.$refs.carousel.getBoundingClientRect();

                            // Determine if the cell is partially outside the viewport with margin allowance
                            const isPartiallyVisible =
                                (cellRect.left < parentRect.left - margin &&
                                    cellRect.right > parentRect.left + margin) ||
                                (cellRect.right > parentRect.right + margin &&
                                    cellRect.left < parentRect.right - margin);

                            cell.classList.toggle(
                                "flickity-partially-visible",
                                isPartiallyVisible,
                            );
                        }
                    });
                }
            },
            navigate(event) {
                const { section_id, action } = event.detail;
                console.log(section_id);
                console.log(this.sectionId);
                if (this.sectionId === section_id) this.flickity[action]();
            },
            prev() {
                if (this.flickity) {
                    this.flickity.previous();
                }
            },
            next() {
                if (this.flickity) {
                    this.flickity.next();
                }
            },
            calculateTotalWidth() {
                const children = this.$refs.carousel.children;
                let totalWidth = 0;
                for (let i = 0; i < children.length; i++) {
                    totalWidth += children[i].offsetWidth;
                }
                return totalWidth;
            },
        };
    },
};
