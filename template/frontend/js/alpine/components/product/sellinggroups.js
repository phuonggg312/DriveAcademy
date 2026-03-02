import productform from "./productform";

export default {
  name: "sellinggroups",
  component() {
    return {
      init() {

        document.addEventListener(
          "liquid-ajax-cart:request-start",
          function (event) {
            const { requestState } = event.detail;

            if (requestState.requestType === "add") {
              // Find the selected selling plan from the radio buttons
              let selectedSellingPlan = document.querySelector(
                ".pdp-details .product-selling-groups input[type=radio]:checked",
              );

              if (!selectedSellingPlan) {
                selectedSellingPlan = document.querySelector(
                  ".product-tile-hovered input[type=radio]:checked",
                );
              }

              if (selectedSellingPlan) {
                const selectedSellingPlanId = selectedSellingPlan.value; // assuming the value attribute contains the selling plan ID

                if (selectedSellingPlan.value !== "on") {
                  if (
                    requestState.requestBody instanceof FormData ||
                    requestState.requestBody instanceof URLSearchParams
                  ) {
                    requestState.requestBody.set(
                      "selling_plan",
                      selectedSellingPlanId,
                    );
                  } else {
                    requestState.requestBody.selling_plan =
                      selectedSellingPlanId;
                  }
                }
              }
            }
          },
        );
      },
      sellingGroupSelected(sellingGroup) {
        const variantPrice = sellingGroup.target.getAttribute(
          "data-sellinggroup-price",
        );
          const quantityInputEl = document?.getElementById('quantityInput');

          const qty = quantityInputEl?.querySelector('input')?.value || 1;
          // Get the closest .product-form to the sellingGroup
          const sellingGroupParent = sellingGroup?.target?.closest('.product-selling-groups');
          const productFormEl = sellingGroupParent?.querySelector('.product-form');

          productform.component().setCurrentVariant(sellingGroup.target);

        const currentVariant = productform.component().getCurrentVariant();
        const variantAvailability = currentVariant?.target?.getAttribute(
          "data-variant-available",
        );
          const currencySymbol = window.Alpine?.store('currency').getCurrencySymbol();
          const parsedPrice = parseFloat(variantPrice.replace("$", ""));
          let displayPrice = `${currencySymbol}${(parsedPrice * qty).toFixed(2)}`;

        if (variantAvailability !== "false") {
          productform
            .component()
            .updateAddButtonDom(false, `Add to Cart | ${displayPrice}`, true, parsedPrice, productFormEl);
        }
      },
    };
  },
};
