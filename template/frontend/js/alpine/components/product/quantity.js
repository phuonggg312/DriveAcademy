import productform from "./productform";

export default {
  name: "quantity",
  component() {
    return {
      init() {
      },
      increment() {
        const quantityInput = document.querySelector(
          "[data-prodify-quantity-presentation]",
        );
        const newVal = parseInt(quantityInput.value) + 1;
        quantityInput.value = newVal;
        this.updateFormInputValue(quantityInput.value);
      },
      decrement() {
        const quantityInput = document.querySelector(
          "[data-prodify-quantity-presentation]",
        );
        const newVal = parseInt(quantityInput.value) - 1;

        if (newVal > 0) {
          quantityInput.value = newVal;
          this.updateFormInputValue(newVal);
        }
      },
      updateFormInputValue(quantity) {
        const productForms = document.querySelectorAll(
          ".pdp-details .product-form input[name='quantity']",
        );

        productForms.forEach((productFormDat) => {
          productFormDat.value = quantity;
        });

          const currencySymbol = window.Alpine?.store('currency').getCurrencySymbol();
          const price =productform.component().getSelectedBasePrice() * quantity;
          productform
              .component()
              .updateAddButtonDom(
                  false,
                  `Add to Cart | ${currencySymbol}${price.toFixed(2)}`
              );
      },
    };
  },
};
