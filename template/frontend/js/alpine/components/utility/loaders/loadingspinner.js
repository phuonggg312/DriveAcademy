export default {
  name: "loadingspinner",
  component() {
    return {
      spinners: {},
      init() {
        // console.log("Spinner Component Initialized.");
        document.addEventListener(
          "show-spinner",
          this.handleShowSpinner.bind(this),
        );
        document.addEventListener(
          "hide-spinner",
          this.handleHideSpinner.bind(this),
        );
      },
      showSpinner(id) {
        this.spinners[id] = true;
        this.updateDOM(id, true);
      },
      hideSpinner(id) {
        this.spinners[id] = false;
        this.updateDOM(id, false);
      },
      isSpinnerVisible(id) {
        return this.spinners[id] === true;
      },
      handleShowSpinner(event) {
        // console.log('EVENT js', event);
        const { detail } = event;
        if (detail && detail.id) {
          this.showSpinner(detail.id);
        }
      },
      handleHideSpinner(event) {
        const { detail } = event;
        if (detail && detail.id) {
          this.hideSpinner(detail.id);
        }
      },
      updateDOM(id, show) {
        const spinnerElement = document.querySelector(
          `[data-spinner-id="${id}"] .spinner`,
        );
        if (spinnerElement) {
          spinnerElement.style.display = show ? "block" : "none";
        }
      },
    };
  },
};
