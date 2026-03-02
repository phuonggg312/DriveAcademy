import findinstore from "./alpine/components/ecommerce/findinstore";

class Prodify {
  constructor(settings) {
    this.settings = {
      ...settings,
    };

    this.el = document.querySelector("[data-prodify]");

    this.pickerType = this.el.dataset.prodify;

    this.selectors = {
      priceContainer: "[data-prodify-price-container]",
      mediaContainer: "[data-prodify-media-container]",
      variantsJson: "[data-prodify-variants-json]",
      optionContainer: "[data-prodify-option-container]",
      productForm: "[data-prodify-product-form]",
      quantityIncrement: "[data-prodify-quantity-increment]",
      quantityDecrement: "[data-prodify-quantity-decrement]",
      quantityPresentation: "[data-prodify-quantity-presentation]",
    };

    this.textStrings = {
      addToCart: window.variantStrings.addToCart,
      unavailableVariantValueLabel:
        window.variantStrings.unavailable_with_option,
      soldOutVariantValueLabel: "Sold Out",
      addButtonTextUnavailable: "Add to Cart",
    };

    // Default to unavailable until size is selected
    // this.updateAddButtonDom(
    //   true,
    //   this.textStrings.addButtonTextUnavailable,
    //   true,
    // );

    this.quantityIncrementButton = this.el.querySelector(
      this.selectors.quantityIncrement,
    );
    this.quantityDecrementButton = this.el.querySelector(
      this.selectors.quantityDecrement,
    );
    this.quantityPresentationInput = this.el.querySelector(
      this.selectors.quantityPresentation,
    );
    this.quantityHiddenInput = this.el.querySelector('input[name="quantity"]');

    this.initEventListeners();
    this.initHashScrolling();
  }

  initEventListeners = () => {
    this.el.addEventListener("change", this.onVariantChange);
    console.log("ARCTHEME: Prodify Event Listeners");
    if (
      this.quantityIncrementButton &&
      this.quantityDecrementButton &&
      this.quantityPresentationInput
    ) {
      this.quantityIncrementButton.addEventListener("click", () => {
        this.updateQuantity("up");
      });

      this.quantityDecrementButton.addEventListener("click", () => {
        this.updateQuantity("down");
      });
    }
  };

  initHashScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const offset = 150;

        if (
          this.getAttribute("href") &&
          this.getAttribute("href").startsWith("#") &&
          this.getAttribute("href").length > 1
        ) {
          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            const targetPosition =
              targetElement.getBoundingClientRect().top +
              window.pageYOffset -
              offset;

            window.scrollTo({
              top: targetPosition,
              behavior: "smooth",
            });
          }
        }
      });
    });
  }

  updateCurrentVariant = () => {
    const variants = this.getVariantData();
    const matchingVariant = variants.find((variant) => {
      return variant.options.every((option, index) => {
        return this.options[index] === option;
      });
    });
    this.currentVariant = matchingVariant;
  };

  updateQuantity = (stepDirection) => {
    const previousQuantity = parseInt(this.quantityPresentationInput.value);

    if (stepDirection == "up") {
      this.quantityHiddenInput.value = this.quantityPresentationInput.value =
        previousQuantity + 1;
    } else {
      this.quantityHiddenInput.value = this.quantityPresentationInput.value =
        Math.max(1, previousQuantity - 1);
    }
  };

  updateCurrentOptions = () => {
    if (this.pickerType == "select") {
      this.options = Array.from(
        this.el.querySelectorAll("select"),
        (select) => select.value,
      );
      return;
    }

    this.optionContainers = Array.from(
      this.el.querySelectorAll(this.selectors.optionContainer),
    );
    console.log("ele", this.el);
    console.log("container", this.selectors.optionContainer);
    console.log("containers", this.optionContainers);
    this.options = [
      ...new Set(
        this.optionContainers
          .map((optionContainer) => {
            const inputs = Array.from(
              optionContainer.querySelectorAll("input:checked"),
            );
            const values = inputs.map((input) => input.value);
            return values;
          })
          .flat(),
      ),
    ];
    console.log("options after", this.options);
  };

  updateVariantIdInput() {
    console.log("ARCTHEME: Updating variant ID input");
    const productForms = document.querySelectorAll(this.selectors.productForm);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      console.log("ARCTHEME: " + this.currentVariant.id);
      input.value = this.currentVariant.id;
      // input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updateURL() {
    if (!this.currentVariant || this.el.dataset.updateUrl === "false") return;
    window.history.replaceState(
      {},
      "",
      `${this.el.dataset.url}?variant=${this.currentVariant.id}`,
    );
  }

  updateAddButtonDom(disable = true, text, modifyClass = true) {
    const productForms = document.querySelectorAll(this.selectors.productForm);
    productForms.forEach((productForm) => {
      if (!productForm) return;
      const addButton = productForm.querySelector('[name="add"]');
      const addButtonText = productForm.querySelector('[name="add"] > span');
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
  }

  onVariantChange = (event) => {
    this.updateCurrentOptions();
    this.updateCurrentVariant();
    this.updateAddButtonDom(true, "", false);
    this.compareInputValues();
    this.setOptionSelected(event.target);
    console.log("ARCTHEME: Variant changed");

    if (!this.currentVariant) {
      console.log("No Current Variant");
      this.updateAddButtonDom(
        false,
        this.textStrings.addButtonTextUnavailable,
        true,
      );
    } else {
      console.log("Current Variant");
      if (!this.currentVariant.available) {
        this.updateAddButtonDom(
          true,
          this.textStrings.soldOutVariantValueLabel,
          true,
        );
      } else {
        this.updateAddButtonDom(false, this.textStrings.addToCart, true);
      }

      this.updateURL();
      this.updateVariantIdInput();
      this.swapProductInfo();
    }
  };

  setOptionSelected(select) {
    if (this.pickerType == "select") {
      const options = Array.from(select.querySelectorAll("option"));
      const currentValue = select.value;

      options.forEach((option) => {
        if (option.value === currentValue) {
          option.setAttribute("selected", "selected");
        } else {
          option.removeAttribute("selected");
        }
      });
    }
  }

  compareInputValues() {
    // Create a mapping of option names to their corresponding indices in variant data
    const optionNameToIndexMap = {
      Color: "option1",
      Size: "option2",
    };

    const variantsMatchingOptionOneSelected = this.variantData.filter(
      // Grab the first checked input and compare it to the variant option1
      // return an array of variants where the option1 matches the checked input
      (variant) => this.el.querySelector(":checked").value === variant.option1,
    );

    const inputWrappers = [
      ...this.el.querySelectorAll(this.selectors.optionContainer),
    ];

    inputWrappers.forEach((option, index) => {
      const optionName = option.getAttribute("name"); // Assuming the name attribute is set on the fieldset
      const optionKey = optionNameToIndexMap[optionName];
      const previousOptionKey =
        optionNameToIndexMap[inputWrappers[index - 1]?.getAttribute("name")];

      const previousOptionSelected =
        inputWrappers[index - 1]?.querySelector(":checked")?.value;

      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ];

      let availableOptionInputsValues = [];
      let existingOptionInputsValues = [];

      if (previousOptionSelected && previousOptionKey) {
        availableOptionInputsValues = variantsMatchingOptionOneSelected
          .filter(
            (variant) =>
              variant.available &&
              variant[previousOptionKey] === previousOptionSelected,
          )
          .map((variantOption) => variantOption[optionKey]);

        existingOptionInputsValues = variantsMatchingOptionOneSelected
          .filter(
            (variant) => variant[previousOptionKey] === previousOptionSelected,
          )
          .map((variantOption) => variantOption[optionKey]);
      } else {
        // Handle the first element separately if necessary
        availableOptionInputsValues = variantsMatchingOptionOneSelected
          .filter((variant) => variant.available)
          .map((variant) => variant[optionKey]);

        existingOptionInputsValues = variantsMatchingOptionOneSelected.map(
          (variant) => variant[optionKey],
        );
      }

      this.setInputAvailability(
        optionInputs,
        availableOptionInputsValues,
        existingOptionInputsValues,
      );
    });
  }

  setInputAvailability(
    optionInputs,
    availableOptionInputValues,
    existingOptionInputsValues,
  ) {
    optionInputs.forEach((input) => {
      if (availableOptionInputValues.includes(input.getAttribute("value"))) {
        if (this.pickerType == "select") {
          input.innerText = input.getAttribute("value");
          return;
        }
        input.classList.remove("disabled");
      } else {
        if (existingOptionInputsValues.includes(input.getAttribute("value"))) {
          if (this.pickerType == "select") {
            input.innerText = this.textStrings.soldOutVariantValueLabel.replace(
              "[value]",
              input.getAttribute("value"),
            );
            return;
          }
          input.classList.add("disabled");
        } else {
          if (this.pickerType == "select") {
            input.innerText =
              this.textStrings.unavailableVariantValueLabel.replace(
                "[value]",
                input.getAttribute("value"),
              );
            return;
          }
          input.classList.add("disabled");
        }
      }
    });
  }

  async swapProductInfo() {
    window.arctheme.helpers
      .fetchHTML(
        `${this.el.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.el.dataset.section}`,
      )
      .then((responseHTML) => {
        const priceSource = responseHTML.querySelector(
          this.selectors.priceContainer,
        );
        const priceTarget = this.el.querySelector(
          this.selectors.priceContainer,
        );
        const addButtonSource = responseHTML.querySelector(
          `${this.selectors.productForm} [name="add"]`,
        );
        const addButtonTarget = this.el.querySelector(
          `${this.selectors.productForm} [name="add"]`,
        );

        if (priceSource && priceTarget) {
          priceTarget.replaceWith(priceSource);
        }

        if (addButtonSource && addButtonTarget) {
          addButtonTarget.replaceWith(addButtonSource);
        }
      });

    // FIND IN STORE FUNCTIONALITY -- THIS IS CUSTOM WORK TO ADD TO PRODIFY
    if (document.querySelector("findinstore")) {
      findinstore.component().sku = this.currentVariant.sku;
      await findinstore.component().getStockForProduct(this.currentVariant.sku);
    }
  }

  getVariantData = () => {
    this.variantData =
      this.variantData ||
      JSON.parse(
        this.el.querySelector(this.selectors.variantsJson).textContent,
      );
    return this.variantData;
  };
}

window.prodify = new Prodify();
