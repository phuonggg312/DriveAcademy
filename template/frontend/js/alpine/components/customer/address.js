import { AddressForm } from "@shopify/theme-addresses";

const selectors = {
  customerAddresses: "[data-customer-addresses]",
  addressCountrySelect: "[data-address-country-select]",
  addressContainer: "[data-address]",
};

const attributes = {
  expanded: "aria-expanded",
  confirmMessage: "data-confirm-message",
};

export default {
  name: "address",
  component() {
    return {
      formId: "",
      initialiseAddress(formId) {
        this.formId = formId;
        this.elements = this.getElements(this.formId);
        if (Object.keys(this.elements).length === 0) return;
        this.setupCountries(this.formId);
      },
      getElements(formId) {
        const container = document.querySelector(`.form-${formId}`);
        const containerAddress = container.querySelector(
          selectors.addressContainer,
        );
        const countrySelects = container.querySelector(
          selectors.addressCountrySelect,
        );

        return container
          ? {
              container,
              addressContainer: containerAddress,
              countrySelects: countrySelects,
            }
          : {};
      },
      setupCountries() {
        if (Shopify && Shopify.CountryProvinceSelector) {
          new Shopify.CountryProvinceSelector(
            `AddressCountry_${this.formId}`,
            `AddressProvince_${this.formId}`,
            {
              hideElement: `AddressProvinceContainer_${this.formId}`,
            },
          );
        }
      },
    };
  },
};
