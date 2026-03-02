let currentVariant = null;
let selectedBasePrice = 0;

export default {
  name: "productform",
  component() {
    return {
      init() {
      },
      setCurrentVariant(variant) {
        currentVariant = variant;
      },
      getCurrentVariant() {
        return currentVariant;
      },
        getSelectedBasePrice(){
          return selectedBasePrice;
        },
      updateAddButtonDom(disable = true, text, modifyClass = true, basePrice = 0, form = null) {
          let productForms = null;
          if (!form){
              productForms = document.querySelectorAll(
                  '.pdp-details .product-form',
              );
          } else {
              productForms = [form];
          }

        if (basePrice > 0) {
            selectedBasePrice = basePrice;
        }
        productForms.forEach((productForm) => {
          if (!productForm) return;
          const addButton = productForm.querySelector('[name="add"]');
          const addButtonText = productForm.querySelector(
            '[name="add"] > span',
          );
          if (!addButton) return;
          if (disable) {
            addButton.setAttribute("disabled", "disabled");
            addButton
              .querySelector("span")
              .setAttribute(
                "x-on:click",
                "$nextTick(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); })",
              );
            if (text) addButtonText.textContent = text;
          } else {
            addButton.removeAttribute("disabled");
            if (text) addButtonText.textContent = text;
          }

          if (!modifyClass) return;

          if (disable) {
            addButton.classList.add("disabled");
          } else {
            addButton.classList.remove("disabled");
          }
        });
      },
    };
  },
};
