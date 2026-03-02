export const hasBodyClass = (className) => {
  return document.body.classList.contains(className)
}

export function formatPrice(priceInCents) {
  const price = priceInCents / 100;
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(price);
}

export function formatPriceWithoutTrailingZeros(price) {
  let formattedPrice = formatPrice(price);

  if (price % 1 === 0) {
    formattedPrice = formattedPrice.replace('.00', '');
  }

  return formattedPrice;
}

export function interpolateTranslation (translations, key, variable, value) {
  if (!translations) return value;
  return translations[key].replace(`{{ ${variable} }}`, value)
}

export default {
  /**
   * Emit a custom event
   * @param  {String} type   The event type
   * @param  {Object} detail Any details to pass along with the event
   * @param  {Node}   elem   The element to attach the event to
   */
  emitEvent(type, detail = {}, elem = document) {
    if (!type) return;

    let event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail
    });

    return elem.dispatchEvent(event);
  },

  getShopDomain() {
    return Shopify.shop;
  },

    getDomain(use_local = true) {
        if (use_local) {
            if (
                location.origin.includes("127.0.0.1") ||
                location.origin.includes("localhost")
            ) {
                return location.origin;
            }
        }
        return `https://${window.location.host}`;
    },

  randomNumber(min = 0, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  debounce(callback, wait) {
    let timeoutId = null;

    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  },

  truncateLongTitle(input) {
    return input.length > 5 ? `${input.substring(0, 18)}...` : input;
  },

  async fetchHTML(endpoint) {
    return await fetch(endpoint)
      .then((response) => response.text())
      .then((responseText) => {
        return new DOMParser().parseFromString(responseText, 'text/html');
      });
  },

  updateUrlParameters(originalUrl, params) {
    const url = new URL(originalUrl.toString());

    for (const [key, value] of Object.entries(params)) {
      if (!value) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value.toString());
      }
    }

    return url.toString();
  },
dispatchCustomEvent(eventName, detail = { message: '' }) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  },

  setCSSVariable(attr, val) {
    document.querySelector(':root').style.setProperty(attr, val);
  },

  getImageSize(originalUrl, width, height = null, queries = null) {
    const params = {
      width: Math.ceil(width),
      height: Math.ceil(height),
      ...queries
    };

    if (!originalUrl.startsWith('https:')) {
      originalUrl = `https:${originalUrl}`;
    }

    return this.updateUrlParameters(originalUrl, params);
  },

  generateUUID() {
    return uuidv4();
  },

  isVideo(mediaSrc) {
    return mediaSrc?.includes('mp4');
  },

  appendUrlParam(key, val) {
    const url = new URL(window.location);
    url.searchParams.set(key, val);
    window.history.pushState({}, '', url);
  },

  removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url);
  },

  currencyFromCents(val, digits = 2) {
    return `$${(val / 100).toFixed(digits)}`;
  },

  getDayName(dateStr, locale) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
  },

  arrayToEnum(array, keyField) {
    return array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {})
  },

  isValidEmail(email) {
    // Define a regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
  },

  isValidPhoneNumber(phoneNumber) {
    // Define a regular expression for validating a phone number with spaces, dashes, or parentheses
    const phoneRegex = /^\+?([0-9]{1,3})?[\s\-]?[1-9][0-9\s\-\(\)]{6,}$/;

    // Test the phone number against the regular expression
    return phoneRegex.test(phoneNumber);
  },
    leastCommonMultiple(min, max) {
    function range(min, max) {
      let arr = [];
      for (let i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    }

    function gcd(a, b) {
      return !b ? a : gcd(b, a % b);
    }

    function lcm(a, b) {
      return (a * b) / gcd(a, b);
    }

    let multiple = min;
    range(min, max).forEach(function (n) {
      multiple = lcm(multiple, n);
    });

    return multiple;
  },

  isActiveLink(link) {
    return window.location.href.includes(link);
  },

  getObjectFromKeyAndValue(array, key, value) {
    return array.find((obj) => obj[key] === value);
  },

  // Only work with strings or numbers
  twoArraysWithSameValues(arr1, arr2) {
    return [...arr1].sort().join(',') === [...arr2].sort().join(',');
  },

  formatTimestamp(dateString) {
    const date = new Date(dateString);

    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDay();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  },

  toggleClass(el, className, isAdd) {
    if (isAdd) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  },

  updateUrlAndFilters(filters) {
        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        let queryStringUrl = ""

        if (searchParams.has('q')) {
            const currentQValue = searchParams.get('q');
            queryStringUrl = `?q=${currentQValue}&${filters}`
        } else {
            queryStringUrl = `?${filters}`
        }

        const newUrl = `${queryStringUrl}`;

        window.history.pushState(null, "", newUrl);

        return newUrl;
    }

};
