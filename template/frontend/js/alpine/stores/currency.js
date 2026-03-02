import api from "../../api";
import helpers from "../../helpers";

export const currency = {
    name: 'currency',
    store() {
        return {
            country: 'AU',
            currencyCode: "AUD",
            currencySymbol: "$",
            currentCurrency: null,
            enabledCurrencies: [],
            async initialise(isInternationalSite = false) {

                if (isInternationalSite) {
                    this.country = this.getCookie('localization');

                    const query = `query @inContext(country: ${this.country}) {
                      localization {
                        availableCountries {
                          currency {
                            isoCode
                            name
                            symbol
                          }
                          isoCode
                          name
                          unitSystem
                        }
                        country {
                          currency {
                            isoCode
                            name
                            symbol
                          }
                          isoCode
                          name
                          unitSystem
                        }
                      }
                    }
                    `;

                    let headers = {
                        "Content-Type": "application/graphql",
                        "X-Shopify-Storefront-Access-Token": `${api.getStorefrontToken()}`,
                    };

                    const response = await fetch(
                        `${helpers.getDomain()}/api/2024-07/graphql.json`,
                        {
                            method: "POST",
                            headers: headers,
                            body: query,
                        },
                    );

                    const jsonResponse = await response.json();


                    if (jsonResponse.data.localization) {
                        for (let country of jsonResponse.data.localization.availableCountries) {

                            this.addCurrency(
                                country.currency.isoCode,
                                country.currency.name,
                                country.currency.symbol,
                                country.isoCode
                            )

                        }
                    }

                    this.currentCurrency = this.findCurrencyByCode();
                    this.setCurrencySymbol(this.currentCurrency.symbol);
                }
            },
            getCookie(name) {
                // Create a regex to find the cookie by name
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);

                if (parts.length === 2) {
                    return parts.pop().split(';').shift();
                }

                return null; // Return null if the cookie is not found
            },

            findCurrencyByCode() {
                return this.enabledCurrencies.find(currency => currency.country === this.country);
            },
            addCurrency(name, code, symbol, country){
                this.enabledCurrencies.push({
                    name: name,
                    code: code,
                    symbol: symbol,
                    country: country
                });
            },
            getCountry(){
                return this.country;
            },
            setCurrencyCode(code){
                this.currencyCode = code;
            },
            setCurrencySymbol(symbol){
                this.currencySymbol = symbol;
            },
            getCurrencyCode(){
                return this.currencyCode;
            },
            getCurrencySymbol(){
                return this.currencySymbol;
            },
            getCurrentCurrency(){
                return this.currentCurrency;
            }
        }
    }
}
export default currency;
