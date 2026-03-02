export default {
  name: "addresses",
  component() {
    return {
      openAddressId: null,
      isNewAddressFormShown: false,
      newOpen: false,
      addressToggles: {},
      init(formId) {
      },
      toggleEditAddressForm(index) {
        if (this.isNewAddressFormShown) {
          this.isNewAddressFormShown = false;
        }
        if (this.addressToggles.hasOwnProperty(index)) {
          this.addressToggles[index] = !this.addressToggles[index];
        } else {
          this.addressToggles[index] = true;
        }
      },
      toggleNewAddressForm() {
        for (let key in this.addressToggles) {
          if (this.addressToggles.hasOwnProperty(key)) {
            this.addressToggles[key] = false;
          }
        }

        this.isNewAddressFormShown = !this.isNewAddressFormShown;

        if (this.isNewAddressFormShown) {
          const form = document.querySelector("#new-address");
          setTimeout(() => {
            form.scrollIntoView({
              behavior: "smooth",
              inline: "start",
              block: "start",
            });
          }, 100);
        }
      },
      deleteAddress(event) {
        const confirmMessage = event.target.getAttribute(
          "data-confirm-message",
        );

        if (
          !window.confirm(
            confirmMessage || "Are you sure you wish to delete this address?",
          )
        ) {
          event.preventDefault();
        }
      },
    };
  },
};

if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}
Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  };
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback);
};

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options,
) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid,
  );

  console.log("Shopify Country", this.countryEl);

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this),
  );

  this.initCountry();
  this.initProvince();
};

Shopify.setSelectorByValue = function (selector, value) {
  for (let i = 0, count = selector.options.length; i < count; i++) {
    const option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      // this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option");
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      // this.provinceContainer.style.display = '';
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option");
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  },
};
