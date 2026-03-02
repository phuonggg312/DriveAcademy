import helpers from "../../../../helpers";
import { v4 as uuidv4 } from 'uuid';

export const DEFAULT_TRENDING_QUERIES = [
    {
        searchQuery: "Cocoon Swaddle",
        popularity: 3
    },
    {
        searchQuery: "Jersey Sleeping Bag",
        popularity: 2
    },
    {
        searchQuery: "Butterfly Cardi",
        popularity: 2
    },
    {
        searchQuery: "Bodywear Singlet",
        popularity: 1
    }
]
let siteId = '';

export const searchspring = {
    name: "searchspring",
    component() {
        return {
            products: [],
            queryInput: "",
            siteId: "",
            searchSettings: null,
            productsPerPage: null,

            init(searchSettings, productsPerPage) {
                console.log('Search spring initialized', searchSettings);
                this.searchSettings = searchSettings;
                siteId = this.searchSettings?.site_id;
                this.productsPerPage = productsPerPage;

            },

            buildQueryParams(params) {
                return new URLSearchParams(params).toString();
            },

            async fetchProductResults(query, filterString = null) {
                const baseUrl = `https://${siteId}.a.searchspring.io/api/search/search.json`;
                let url = '';

                if (filterString.length > 0 && filterString !== '?') {
                    url = `${baseUrl}?${this.buildQueryParams({ ...query, ...this.getCommonParams() })}${filterString ? filterString : ''}`;
                } else {
                    url = `${baseUrl}?${this.buildQueryParams({ ...query, ...this.getCommonParams() })}`;
                }

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            },

            async fetchAutocompleteResults(query) {
                const autocompleteUrl = `https://${siteId}.a.searchspring.io/api/search/autocomplete.json`;
                const url = `${autocompleteUrl}?${this.buildQueryParams({ ...query, ...this.getCommonParams() })}`;

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching autocomplete results:', error);
                }
            },

            async fetchSuggestResults(query) {
                const suggestUrl = `https://${siteId}.a.searchspring.io/api/suggest/query`;
                const url = `${suggestUrl}?${this.buildQueryParams({ ...query, ...this.getCommonParams() })}`;

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching suggest results:', error);
                }
            },

            async fetchTrendingResults() {
                const trendingUrl = `https://${siteId}.a.searchspring.io/api/suggest/trending`;
                const url = `${trendingUrl}?${this.buildQueryParams(this.getCommonParams())}`;

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching trending results:', error);
                }
            },

            getSSCookieId(cookie) {
                // Helper function to read a cookie
                function getCookie(name) {
                    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
                    return match ? match[2] : null;
                }

                // Helper function to set a cookie with expiration and path
                function setCookie(name, value, days = 365) {
                    const expires = new Date(Date.now() + days * 86400000).toUTCString();
                    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
                }

                let ssId = getCookie(cookie);
                if (!ssId) {
                    ssId = uuidv4();
                    setCookie(cookie, ssId);
                }
                return ssId;
            },

            async fetchRecommendationResults(productId, tags) {
                const recsUrl = `https://${siteId}.a.searchspring.io/boost/${siteId}/recommend`;
                const url = `${recsUrl}?${this.buildQueryParams({ product: productId, tags, ...this.getCommonParams() })}`;

                try {
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                    return await response.json();
                } catch (error) {
                    console.error('Error fetching recommendation results:', error);
                }
            },

            getCommonParams() {
                return {
                    userId: this.getSSCookieId('ssUserId'),
                    sessionId: this.getSSCookieId('ssSessionIdNamespace'),
                    pageLoadId: uuidv4(),
                    domain: helpers.getDomain(),
                    redirectResponse: 'native',
                    resultsFormat: 'json',
                    siteId: siteId,
                };
            }
        };
    },
};
// Attach to the window
window.searchSpring = searchspring.component();

export default searchspring;
