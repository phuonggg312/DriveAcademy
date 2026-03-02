export default {
  name: "global",
  store() {
    return {
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      isPredictiveSearchVisible: false,
      isWindowScrolled: false,
      cart: null,
      init() {

        window.addEventListener(
          "scroll",
          this.onWindowScrollHandler.bind(this),
        );
        window.addEventListener("keydown", this.onKeyDownHandler.bind(this));
        window.addEventListener("mobile-menu-open", this.openMobileMenu);
        window.addEventListener("mobile-menu-closed", this.closeMobileMenu);
        window.addEventListener(
          "toggle-minicart",
          this.toggleMinicart.bind(this),
        );

        this.initLiquidAJaxCart();
      },
      get bodyClasses() {
        let classes = [];

        if (this.isMobileMenuVisible) {
          classes.push("mobile-menu-visible");
        }
        if (this.isMinicartVisible) {
          classes.push("minicart-open");
        }
        if (this.isPredictiveSearchVisible) {
          classes.push("search-open");
        }

        document.body.classList[this.isMinicartVisible ? "add" : "remove"](
          "no-scroll",
        );

        return classes || "";
      },
      openMobileMenu() {
        this.isMobileMenuVisible = true;
        document.body.classList[this.isMobileMenuVisible ? "add" : "remove"](
          "mobile-menu-visible",
        );
      },
      closeMobileMenu() {
        this.isMobileMenuVisible = false;
        document.body.classList[this.isMobileMenuVisible ? "add" : "remove"](
          "mobile-menu-visible",
        );
      },
      toggleMobileMenu() {
        this.isMobileMenuVisible = !this.isMobileMenuVisible;
        this.isPredictiveSearchVisible = !this.isPredictiveSearchVisible;
      },
      toggleSearch() {
        console.log("Toggling Search");
        this.isPredictiveSearchVisible = !this.isPredictiveSearchVisible;
        document.body.classList[
          this.isPredictiveSearchVisible ? "add" : "remove"
        ]("no-scroll");
      },
      toggleMinicart() {
        this.isMinicartVisible = !this.isMinicartVisible;
        console.log("Toggle Minicart", this.isMinicartVisible);
        document.body.classList[this.isMinicartVisible ? "add" : "remove"](
          "no-scroll",
        );
      },
      initLiquidAJaxCart() {
        document.addEventListener("liquid-ajax-cart:request-end", (event) => {
          const { requestState, cart, previousCart, sections } = event.detail;

          if (requestState.requestType === "add") {
            if (requestState.responseData?.ok) {
              this.isMinicartVisible = true;
              document.body.classList.add("no-scroll");
            }
          }

          this.cart = cart;
        });
      },
      onWindowScrollHandler() {
        const isScrolled = window.scrollY > 0;

        this.isWindowScrolled = isScrolled;
        document.body.classList[isScrolled ? "add" : "remove"]("scrolled");
      },
      onKeyDownHandler(event) {
        if (event.key === "Escape") {
          console.log("Escape Key Pressed");
          this.isMinicartVisible = false;
          this.isPredictiveSearchVisible = false;
        }
      },
    };
  },
};
