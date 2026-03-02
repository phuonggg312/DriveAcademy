import algoliasearch from 'algoliasearch';
import shopify from "../../../../shopify";
import cloneDeep from 'lodash/cloneDeep';

const DOMAIN = 'mj-bale-int-dev.myshopify.com';
const algoliaFacetOrder = null;

// Global settings
const configuredFacets = JSON.parse(algoliaFacetOrder);
const enabledFacets = configuredFacets ? configuredFacets.filter(facet => facet.enabled).map(facet => facet.name) : [];
let usedFacets = [];
let indexes = [];
const sortedFacets = enabledFacets.filter(facet => usedFacets.includes(facet));

const defaultSearchParams = {
    hitsPerPage: 0,
    distinct: 1,
    facetingAfterDistinct: true,
    attributesToHighlight: [],
    attributesToRetrieve: ['-*', 'id', 'query'],
    facets: sortedFacets,
};

export const algolia = {
    name: 'algolia',
    component() {
        return {
            open: false,
            config: {},
            client: null,
            isProcessingRequest: false,
            hasInit: false,
            requestType: '',
            currentRequest: null,
            headerResultsTotal: null,
            productsPerPageSetting: null,
            defaultSort: null,
            requestCountPromise: null,
            requestCountResolve: null,
            isFiltering: false,
            async init(settings, productsPerPage, headerResultsTotal) {
                if (this.hasInit) return;

                if (settings) {
                    usedFacets = settings?.facets?.replaceAll("\n", "").split(",");
                    defaultSearchParams.attributesToRetrieve = settings?.attributes?.replaceAll("\n", "").split(",");

                    this.productsPerPageSetting = productsPerPage;

                    this.headerResultsTotal = settings?.results_returned_header;

                    indexes = settings?.search_indexes?.split(',').reduce((acc, pair) => {
                        const [key, value] = pair.split(':').map(str => str.trim());
                        acc[key] = value;
                        return acc;
                    }, {});
                    this.config = {
                        app: settings.app_id || null,
                        key: settings.api_key || null,
                        index: indexes,
                    };

                    this.defaultSort = settings?.default_sort;

                    const attributes = settings?.attributes?.replaceAll("\n", "").split(",");
                    defaultSearchParams.attributesToRetrieve = attributes;

                    this.client = algoliasearch(this.config.app, this.config.key);
                    this.hasInit = true;

                    this.sortOptions = settings?.sort_indicies?.split(',').map(pair => {
                        const [key, value] = pair.split(':').map(str => str.trim());
                        return { key, value };
                    });

                    window.sortOptions = cloneDeep(this.sortOptions);
                    window.defaultSort = cloneDeep(this.defaultSort);

                    window.addEventListener('searchrequest', this.handleSearchRequest.bind(this));
                    window.addEventListener('searchrequest-articles', this.handleSearchRequest.bind(this));
                    window.addEventListener('searchrequest-suggestions', this.handleSuggestionSearchRequest.bind(this));
                    window.addEventListener('searchrequest-filter-applied', this.handleFilterRequest.bind(this));
                    window.addEventListener('searchrequest-sort-applied', this.handleSearchRequest.bind(this));
                    window.addEventListener('searchrequest-nextpage', this.handlePaginationRequest.bind(this));
                }
            },
            async handleSearchRequest(event) {
                const { query, type, filters, index, productsPerPage, isFiltering } = event.detail;

                if (this.isProcessingRequest) {
                    this.cancelCurrentRequest();
                }

                this.isProcessingRequest = true;
                this.requestType = type;

                if (isFiltering) {
                    this.isFiltering = isFiltering;
                }

                if (this.requestType === 'search') {
                    window.dispatchEvent(new CustomEvent('show-spinner', {
                        detail: {
                            id: 'spinner-search',
                        },
                    }));
                } else if (this.requestType === 'plp') {
                    window.dispatchEvent(new CustomEvent('show-spinner', {
                        detail: {
                            id: 'spinner-collection',
                        },
                    }));
                }
                let searchIndex = null

                if (this.requestType === 'header') {
                    searchIndex = this.config.index[index] ? index : 'default';
                } else {
                    searchIndex = this.config.index[index] ? index : this.defaultSort;
                }

                if (this.requestType === 'header') {
                    defaultSearchParams.hitsPerPage = this.headerResultsTotal;
                } else {
                    defaultSearchParams.hitsPerPage = productsPerPage
                        ? productsPerPage
                        : this.productsPerPageSetting;
                }

                const customSearchParams = this.buildCustomSearchParams(filters);
                let results = null;
                switch (searchIndex){
                    case 'articles':
                        results = await this.algoliaArticleSearch(query, customSearchParams, {}, searchIndex);
                        break;
                    default:
                        results = await this.algoliaProductSearch(query, customSearchParams, {}, searchIndex);
                        break
                }
                window.dispatchEvent(new CustomEvent('loading', {
                    detail: {
                        value: false,
                    },
                }));
            },
            async handleSuggestionSearchRequest(event) {
                const { query, type, filters, index } = event.detail;
                if (this.isProcessingRequest) {
                    this.cancelCurrentRequest();
                }

                const customSearchParams = this.buildCustomSearchParams(filters);

                const suggestionsQuery = [];
                index.forEach(indexKey => {
                    suggestionsQuery.push({
                        indexName: this.config.index[indexKey],
                        query: query,
                        params: {
                            ...defaultSearchParams,
                            facets: usedFacets,
                            ...customSearchParams,
                        }
                    })
                })

                this.isProcessingRequest = true;
                this.requestType = type;

                let results = null;
                results = await this.algoliaSuggestionsSearch(suggestionsQuery);
            },
            async handleFilterRequest(event) {
                const { query, type, filters, index, isFilteringRequest } = event.detail;

                this.requestCountPromise = new Promise((resolve) => {
                    this.requestCountResolve = resolve;
                });

                if (this.isProcessingRequest) {
                    this.cancelCurrentRequest();
                }
                this.isProcessingRequest = true;
                this.requestType = type;

                this.isFiltering = isFilteringRequest;

                const searchIndex = this.config.index[index] ? index : this.defaultSort;

                if (this.requestType === 'search') {
                    window.dispatchEvent(new CustomEvent('show-spinner', {
                        detail: {
                            id: 'spinner-search',
                        },
                    }));
                } else if (this.requestType === 'plp') {
                    window.dispatchEvent(new CustomEvent('show-spinner', {
                        detail: {
                            id: 'spinner-collection',
                        },
                    }));
                }
                const customSearchParams = this.buildCustomSearchParams(filters);
                await this.algoliaProductSearch(query, customSearchParams, {}, searchIndex, true);
            },
            buildCustomSearchParams(filters, page) {
                let customSearchParams = {};
                if (filters) {
                    if (filters.collection) {
                        // customSearchParams.filters = `collections:${filters.collection}`;
                    } else {
                        // customSearchParams.filters = filters;
                    }
                }
                if (page) {
                    customSearchParams.page = page;
                }
                return customSearchParams;
            },
            cancelCurrentRequest() {
                if (this.currentRequest && typeof this.currentRequest.cancel === 'function') {
                    this.currentRequest.cancel();
                }
                this.isProcessingRequest = false;
            },
            async transformProducts(algoliaResults) {
                const productIdsList = [...new Set(algoliaResults.hits.map(product => product.id))];
                const transformedProducts = await shopify.getShopifyProductList(productIdsList);
                const output = {
                    products: transformedProducts,
                    page: algoliaResults.page,
                    filters: null,
                    total_results: null,
                    pages: null,
                };

                if (algoliaResults.facets) {
                    output.filters = this.transformFacets(algoliaResults.facets);
                }

                if (algoliaResults.nbHits > -1) {
                    output.total_results = algoliaResults.nbHits;
                }

                if (algoliaResults.nbPages > -1) {
                    output.pages = algoliaResults.nbPages;
                }

                return output;
            },
            transformFacets(facets) {
                let acc = []

                return Object.entries(facets).reduce((accumulator, [facetKey, facetValues]) => {
                    let facetLabel = facetKey.split('.').pop();
                    if (facetLabel === 'inventory_available') {
                        facetLabel = 'availability';
                    } else if (facetLabel === 'price_range') {
                        facetLabel = 'price';
                    }

                    const values = Object.entries(facetValues).reduce((acc, [valueKey, valueCount]) => {
                        let valueLabel = valueKey;
                        if (valueLabel === 'true') {
                            valueLabel = 'available';
                        } else if (valueLabel === 'false') {
                            valueLabel = 'unavailable';
                        }
                        acc.push({ key: valueKey, label: valueLabel, count: valueCount });
                        return acc;
                    }, []).sort((a, b) => {
                        if (facetLabel === 'price') {
                            return parseFloat(a.label.split(':')[0]) - parseFloat(b.label.split(':')[0]);
                        }
                        return a.label.localeCompare(b.label);
                    });

                    acc.push({ label: facetLabel, key: facetKey, values });
                    return acc;
                }, []).sort((a, b) => sortedFacets.indexOf(a.key) - sortedFacets.indexOf(b.key));
            },
            async algoliaProductSearch(searchQuery = '', customSearchParams = {}, requestOptions = {}, indexKey) {
                const index = this.client.initIndex(this.config.index[indexKey]);
                const searchParams = {
                    ...defaultSearchParams,
                    facets: usedFacets,
                    ...customSearchParams,
                };

                try {
                    const algoliaResults = await index.search(searchQuery, searchParams, requestOptions);
                    const results = await this.transformProducts(algoliaResults);

                    window.dispatchEvent(new CustomEvent('searchrequest-products-complete', {
                        detail: {
                            query: searchQuery,
                            products: results.products,
                            totalResults: results.total_results,
                            filters: results.filters,
                            type: this.requestType,
                            page: results.page,
                            isFiltering: this.isFiltering
                        },
                    }));
                    console.log('Algolia search finished', results);
                    this.isProcessingRequest = false;
                    return results;
                } catch (err) {
                    console.log('ERROR: ', err);
                    this.isProcessingRequest = false;
                    return null;
                }
            },
            async algoliaArticleSearch(searchQuery = '', customSearchParams = {}, requestOptions = {}, indexKey) {
                const index = this.client.initIndex(this.config.index[indexKey]);
                const searchParams = {
                    ...defaultSearchParams,
                    facets: usedFacets,
                    ...customSearchParams,
                };
                try {
                    const algoliaResults = await index.search(searchQuery, searchParams, requestOptions);

                    window.dispatchEvent(new CustomEvent('searchrequest-articles-complete', {
                        detail: {
                            articles: algoliaResults.hits,
                            totalResults: algoliaResults.nbHits,
                            type: this.requestType,
                        },
                    }));
                    this.isProcessingRequest = false;
                    return algoliaResults;
                } catch (err) {
                    console.log('ERROR: ', err);
                    this.isProcessingRequest = false;
                    return null;
                }
            },
            async algoliaSuggestionsSearch(queries) {
                try {
                    const eventDetails = {
                        type: this.requestType,
                    };
                    const algoliaResults = await this.client.multipleQueries(queries);
                    Object.keys(this.config.index).forEach((key) => {
                        const indexName = this.config.index[key];
                        const matchingResults = algoliaResults.results.find((result) => result.index.includes(indexName))?.hits || [];
                        if (matchingResults.length > 0) {
                            eventDetails[key] = matchingResults;
                        }
                    });
                    window.dispatchEvent(new CustomEvent('searchrequest-suggestions-complete', {
                        detail: { ...eventDetails },
                    }));
                    this.isProcessingRequest = false;
                    return algoliaResults;
                } catch (err) {
                    console.log('ERROR: ', err);
                    this.isProcessingRequest = false;
                    return null;
                }
            },
            async algoliaGenericSearch(searchQuery = '', customSearchParams = {}, requestOptions = {}, indexKey) {
                const index = this.client.initIndex(this.config.index[indexKey]);
                const searchParams = {
                    ...defaultSearchParams,
                    facets: ['vendor', 'meta.information.range'],
                    ...customSearchParams,
                };

                try {
                    const algoliaResults = await index.search(searchQuery, searchParams, requestOptions);
                    return algoliaResults;
                } catch (err) {
                    console.log('ERROR: ', err);
                    return null;
                }
            },
            async algoliaGetProduct(id, indexKey) {
                const index = this.client.initIndex(this.config.index[indexKey]);
                const searchParams = { ...defaultSearchParams };

                try {
                    const result = await index.search(`${id}`, searchParams, {});
                    if (!result.hits) return null;
                    return result.hits[0].objectID;
                } catch (err) {
                    console.log('ERROR: ', err);
                    return null;
                }
            },
            async algoliaGetRelatedProducts(objectID, customSearchParams = {}, indexKey, count) {
                const indexName = config.index[indexKey];
                const searchParams = { ...customSearchParams };

                try {
                    const relatedProducts = await recommendClient.getRelatedProducts([
                        {
                            indexName,
                            objectID,
                            maxRecommendations: count,
                            queryParameters: searchParams,
                        },
                    ]);
                    if (!relatedProducts.length || !relatedProducts[0].hits) return null;
                    return await this.transformProducts(relatedProducts[0]);
                } catch (err) {
                    console.log('ERROR: ', err);
                    return null;
                }
            },
            async handlePaginationRequest(event) {
                const { query, type, filters, page, index, productsPerPage } = event.detail;
                console.log('Search', 'Request for search', productsPerPage);

                if (this.isProcessingRequest) {
                    this.cancelCurrentRequest();
                }
                this.isProcessingRequest = true;
                this.requestType = type;

                if (this.requestType === 'search') {
                    window.dispatchEvent(new CustomEvent('show-spinner', {
                        detail: {
                            id: 'spinner-search',
                        },
                    }));
                } else if (this.requestType === 'plp') {
                    window.dispatchEvent(new CustomEvent('show-spinner', {
                        detail: {
                            id: 'spinner-collection',
                        },
                    }));
                }

                if (this.requestType === 'header') {
                    defaultSearchParams.hitsPerPage = this.headerResultsTotal;
                } else {
                    defaultSearchParams.hitsPerPage = productsPerPage
                        ? productsPerPage
                        : this.productsPerPageSetting;
                }

                const searchIndex = this.config.index[index] ? index : this.defaultSort;

                const customSearchParams = this.buildCustomSearchParams(filters, page);
                const results = await this.algoliaProductSearch(query, customSearchParams, {}, searchIndex);
                // console.log('Filter results:', results);
            }
        };
    },
};

export default algolia;
