import productform from "./productform";

export default {
  name: "variants",
  component() {
    return {
      init() {
          const firstRadio = document.querySelector('.variant-selects input[type="radio"]');
          if (firstRadio) {
              setTimeout(() => {
                  firstRadio.click();
                  firstRadio.addEventListener("change", this.selectVariant.bind(this));
              }, 1000); // Delay for 1 second (1000 milliseconds)
          }
          const sellingGroups = document.querySelectorAll('.product-selling-groups input[type="radio"]');
        if (sellingGroups) {
            sellingGroups.forEach((radio) => {
                radio.addEventListener("change", this.selectVariant.bind(this));
            });
        }
      },

      selectVariant(variantOption) {
        console.log(
          "ARCTHEME: Updating variant ID input",
          variantOption.target.value,
        );

        const currentSelectedVariant = productform
          .component()
          .getCurrentVariant();
        if (currentSelectedVariant) {
          currentSelectedVariant.target.classList.remove("selected");
        }
        productform.component().setCurrentVariant(variantOption);
        variantOption.target.classList.add("selected");

        this.updateAvailability(variantOption);
        this.updateProductsIncluded(variantOption);
        this.updateAddtoCartInputIds(variantOption);
        this.updateSelectedVariantTitle(variantOption);
        this.switchVariantImage(variantOption);
      },
        switchVariantImage(variantOption){
           const variantImage = variantOption.target.getAttribute("data-variant-image");
           const event = new CustomEvent("variantImageSwitch", {
                detail: {
                    image: variantImage,
                }
            });
            window.dispatchEvent(event);
        },
      updateAddtoCartInputIds(variantOption) {
        const productForms = document.querySelectorAll(
          '.pdp-details .product-form input[name="id"]',
        );

        const variantId = variantOption.target.getAttribute("data-variant-id");

        productForms.forEach((productForm) => {
          productForm.value = variantId;
        });
      },
      updateSelectedVariantTitle(variantOption) {
        const newVariantTitle = variantOption.target.value;
          const variantTitleElements = document.querySelectorAll(
              "[data-arctheme-variant-title]",
          );
        variantTitleElements.forEach((element) => {
          element.innerHTML = newVariantTitle;
        });
      },
      updateProductsIncluded(variantOption) {
        // ZEROCO SPECIFIC - Included Products
        const variantMetafields = variantOption.target.getAttribute(
          "data-variant-metafields",
        );
        if (variantMetafields) {
            const metafieldIds = variantMetafields
                .split(",")
                .map((id) => id.trim()) // Trim whitespace from each ID
                .filter((id) => id); // Filter out any null, undefined, or empty strings
            const event = new CustomEvent("variantProductsIncluded", {
                detail: {
                    ids: metafieldIds,
                },
            });

            // Dispatch the event
            document.dispatchEvent(event);
        }
      },
      updateAvailability(targetVariant) {
        const variantAvailable = targetVariant.target.getAttribute("data-variant-available");
        const quantityInputEl = document.getElementById('quantityInput');

        const qty = quantityInputEl.querySelector('input')?.value || 1;


        const variantPrice =
          targetVariant.target.getAttribute("data-variant-price");


          const currencySymbol = window.Alpine?.store('currency').getCurrencySymbol();
          const parsedPrice = parseFloat(variantPrice.replace("$", ""));

        let displayPrice = `${currencySymbol}${(parsedPrice * qty).toFixed(2)}`;

        if (variantAvailable === "false") {
          if (quantityInputEl) quantityInputEl.classList.add('disabled');

          productform.component().updateAddButtonDom(true, `Out of Stock`,true, variantPrice);

        } else {
          if (quantityInputEl) quantityInputEl.classList.remove('disabled');

          if (displayPrice) {
              productform
                  .component()
                  .updateAddButtonDom(false, `Add to Cart | ${displayPrice}`,true,parsedPrice);
          } else {
              productform
                  .component()
                  .updateAddButtonDom(false, `Add to Cart`,true,parsedPrice);
          }
        }
      },
    };
  },
};
