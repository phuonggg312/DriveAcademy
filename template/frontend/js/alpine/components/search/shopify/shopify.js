import shopify from "../../../../shopify";
import helpers from "../../../../shopify";
import GET_COLLECTION_REQUEST from "../../../../graphql/2024_01/collection/get.graphql";
import GET_SEARCH_REQUEST from "../../../../graphql/2024_01/search/get.graphql";
import api from "../../../../api";
import cloneDeep from 'lodash/cloneDeep';

export default {
    name: "shopify",
    component() {
        return {
            open: false,
            initialised: false,
            productsPerPageSetting: null,
            currentSort: null,
            currentDirection: "DESC",
            currentFilters: [],
            currentPage: 1,
            currentCollectionSize: 0,
            currentCollection: "all",
            lastCursor: null,
            currentResults: 0,
            searchQuery: "",
            defaultSort: null,
            init(search_settings, products_per_page) {
                // console.log("Shopify Search Filters Component Initialized.");
                // console.log(`Search settings`, search_settings);
                // console.log(`Products per page: ${products_per_page}`);

                // Set the products per page from the settings
                this.productsPerPageSetting = products_per_page || 8;

                this.currentSort = search_settings?.default_sort;
                window.defaultSort = cloneDeep(this.getSortLabel(this.currentSort));

                if (!this.initialised) {
                    window.addEventListener(
                        "searchrequest",
                        this.debounce((event) => {
                            this.getSearchResults(event.detail.query);
                        }, 300).bind(this),
                    );
                    window.addEventListener("searchrequest", this.request.bind(this));

                    window.addEventListener(
                        "searchrequest-sort-applied",
                        this.handleSortChange.bind(this),
                    );
                    window.addEventListener(
                        "searchrequest-filter-applied",
                        this.handleFilterApplied.bind(this),
                    );
                    window.addEventListener("nextpage", this.handleNextPage.bind(this));

                    this.initialised = true;
                }
                this.debouncedMakeGraphRequest = this.debounce(
                    this.makeCollectionGraphRequest.bind(this),
                    300,
                );
                this.debouncedMakeSearchGraphRequest = this.debounce(
                    this.makeSearchGraphRequest.bind(this),
                    300,
                );
            },
            toggle() {
                this.open = !this.open;
            },
            close() {
                this.open = false;
            },
            openDropdown() {
                this.open = true;
            },
            async request(event) {
                if (event.detail.type != "search") {
                    console.log(`SHOPIFY: REQUEST COLLECTION RECEIVED`, event);
                    this.currentCollection = event.detail.collection;
                    this.currentCollectionSize = event.detail.collectionSize;
                    console.log(
                        `SHOPIFY: Requesting products for: ${this.currentCollection}`,
                    );
                    console.log(
                        `SHOPIFY: Collection size: ${this.currentCollectionSize}`,
                    );
                    await this.debouncedMakeGraphRequest();
                } else {
                    this.searchQuery = event.detail.query;
                    this.currentCollectionSize = event.detail.collectionSize;
                    await this.debouncedMakeSearchGraphRequest();
                }
            },
            async handleNextPage(event) {

                this.currentPage += 1;
                if (this.searchQuery == "") {
                    await this.debouncedMakeGraphRequest();
                } else {
                    await this.debouncedMakeSearchGraphRequest();
                }
            },
            async handleFilterApplied(event) {
                let filters = [];
                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Room") {
                        value.forEach((room) => {
                            filters.push({
                                tag: `${room}`,
                            });
                        });
                    }
                });

                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Category") {
                        value.forEach((value) => {
                            filters.push({
                                productMetafield: {
                                    namespace: "shopify",
                                    key: "category",
                                    value: `${value}`,
                                },
                            });
                        });
                    }
                });

                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Price") {
                        value.forEach((value) => {
                            filters.push({
                                price: { min: 5, max: 15 },
                            });
                        });
                    }
                });

                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Brand") {
                        value.forEach((value) => {
                            filters.push({
                                productVendor: `${value}`,
                            });
                        });
                    }
                });

                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Product type") {
                        value.forEach((value) => {
                            filters.push({
                                productType: `${value}`,
                            });
                        });
                    }
                });

                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Availability") {
                        value.forEach((value) => {
                            let availability = true;
                            if (value == "In stock") {
                                availability = true;
                            } else {
                                availability = false;
                            }
                            filters.push({
                                available: availability,
                            });
                        });
                    }
                });

                Object.entries(event.detail.filters_object).forEach(([key, value]) => {
                    if (key == "Variant") {
                        value.forEach((value) => {
                            filters.push({
                                variantOption: { name: "color", value: "red" },
                            });
                        });
                    }
                });

                this.currentFilters = filters;

                this.currentPage = 1; // Reset to first page on filter change
                this.lastCursor = null; // Reset cursor when filters are applied

                if (event.detail.type != "search") {
                    await this.debouncedMakeGraphRequest();
                } else {
                    await this.debouncedMakeSearchGraphRequest();
                }
            },
            async handleSortChange(event) {
                const sortOption = event.detail.sortOption;
                let direction = "ASC";
                let sort = "MANUAL";

                switch (sortOption) {
                    case "Newest":
                        sort = "CREATED";
                        break;
                    case "Popular":
                        sort = "BEST_SELLING";
                        break;
                    case "LowToHigh":
                        sort = "PRICE";
                        direction = "DESC";
                        break;
                    case "HighToLow":
                        sort = "PRICE";
                        direction = "ASC";
                        break;
                    case "Featured":
                        sort = "MANUAL";
                        direction = "DESC";
                        break;
                }
                this.currentSort = sort;
                this.currentDirection = direction;

                this.currentPage = 1; // Reset to first page on sort change
                this.lastCursor = null; // Reset cursor when sorting is changed

                if (event.detail.type != "search") {
                    await this.debouncedMakeGraphRequest();
                } else {
                    await this.debouncedMakeSearchGraphRequest();
                }
            },
            async fetchProductsFromCollection(
                handle,
                first,
                after = null,
                filters = [],
                sort = this.currentSort,
                direction = "ASC",
            ) {
                window.dispatchEvent(
                    new CustomEvent("show-spinner", {
                        detail: {
                            id: "spinner-collection",
                        },
                    }),
                );
                const endpoint = "/api/2023-01/graphql.json";
                const accessToken = api.getStorefrontToken();

                // GraphQL query
                const query = GET_COLLECTION_REQUEST.loc.source.body;
                // Convert direction to boolean: true for ASC, false for DESC
                const directionBoolean = direction === "ASC";

                const variables = {
                    handle: handle,
                    first: first,
                    after: after, // Use the cursor for pagination
                    sort: sort,
                    direction: directionBoolean,
                    productFilters: filters,
                };

                // Execute the query
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Storefront-Access-Token": accessToken,
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables,
                    }),
                });

                const result = await response.json();
                return result?.data?.collectionByHandle?.products;
            },

            async fetchProductsFromSearch(
                handle,
                first,
                after = null,
                filters = [],
                sort = "MANUAL",
                direction = "ASC",
            ) {
                window.dispatchEvent(
                    new CustomEvent("show-spinner", {
                        detail: {
                            id: "spinner-collection",
                        },
                    }),
                );
                const endpoint = "/api/2023-01/graphql.json";
                const accessToken = api.getStorefrontToken();

                // GraphQL query
                const query = GET_SEARCH_REQUEST.loc.source.body;
                // Convert direction to boolean: true for ASC, false for DESC
                const directionBoolean = direction === "ASC";

                const variables = {
                    query: this.searchQuery,
                    first: first,
                    after: after, // Use the cursor for pagination
                    sort: "RELEVANCE",
                    direction: directionBoolean,
                    productFilters: filters,
                };

                // Execute the query
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Storefront-Access-Token": accessToken,
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables,
                    }),
                });

                const result = await response.json();
                return result.data.search.edges;
            },
            async makeSearchGraphRequest() {
                const productsData = await this.fetchProductsFromSearch(
                    this.currentCollection,
                    this.productsPerPageSetting,
                    this.lastCursor, // Pass the cursor for the next set of products
                    this.currentFilters,
                    this.currentSort,
                    this.currentDirection,
                );

                // Extract product nodes and the last cursor
                const productNodes = productsData
                    .filter((product) => product.node.id.includes("Product"))
                    .map((product) => shopify.transformGraphqlProduct(product.node));

                this.lastCursor =
                    productsData.length > 0
                        ? productsData[productsData.length - 1].cursor
                        : null;

                // Adjust the collection size if filters are applied
                let paginationTotal = this.currentCollectionSize;
                if (this.currentFilters.length > 0) {
                    paginationTotal = productNodes.length;
                    console.log('SHOPIFY: SEARCH RESULTS PAGINATION', paginationTotal);
                } else {
                    console.log('SHOPIFY: SEARCH RESULTS PAGINATION COLLECTION SIZE', paginationTotal);
                }

                console.log(
                    `SHOPIFY: SEARCH RESULTS (${paginationTotal})`,
                    productNodes,
                );

                const eventDetail = {
                    type: "search",
                    page: this.currentPage, // Current page
                    products: productNodes, // Array of product nodes
                    totalResults: paginationTotal, // Total number of products
                };

                // Dispatch the custom event with the correct product data
                window.dispatchEvent(
                    new CustomEvent("searchrequest-products-complete", {
                        detail: eventDetail,
                    }),
                );
            },
            async makeCollectionGraphRequest() {
                const productsData = await this.fetchProductsFromCollection(
                    this.currentCollection,
                    this.productsPerPageSetting,
                    this.lastCursor, // Pass the cursor for the next set of products
                    this.currentFilters,
                    this.currentSort,
                    this.currentDirection,
                );
                console.log('sort', this.currentSort)

                // Extract product nodes and the last cursor
                const productNodes = productsData?.edges?.map((edge) =>
                    shopify.transformGraphqlProduct(edge.node),
                );
                this.lastCursor =
                    productsData?.edges?.length > 0
                        ? productsData.edges[productsData?.edges?.length - 1].cursor
                        : null;

                // Adjust the collection size if filters are applied
                let paginationTotal = this.currentCollectionSize;
                if (this.currentFilters.length > 0) {
                    paginationTotal = productNodes.length;
                }

                const eventDetail = {
                    type: "plp",
                    page: this.currentPage, // Current page
                    products: productNodes, // Array of product nodes
                    totalResults: paginationTotal, // Total number of products
                };

                // Dispatch the custom event with the correct product data
                window.dispatchEvent(
                    new CustomEvent("searchrequest-products-complete", {
                        detail: eventDetail,
                    }),
                );
            },
            async getSearchResults(searchTerm) {
                if (searchTerm) {
                    console.log(`SHOPIFY: REQUEST SEARCH RECEIVED`, searchTerm);
                    this.searchQuery = searchTerm;
                    const productsData = await this.fetchProductsFromSearch(
                        this.currentCollection,
                        24,
                        null, // Pass the cursor for the next set of products
                        this.currentFilters,
                        this.currentSort,
                        this.currentDirection,
                    );

                    // Extract product nodes and the last cursor
                    const productNodes = productsData
                        .filter((product) => product.node.id.includes("Product"))
                        .map((product) => shopify.transformGraphqlProduct(product.node));

                    const articleNodes = productsData
                        .filter((product) => product.node.id.includes("Article"))
                        .map((product) => shopify.transformGraphqlArticle(product.node));

                    this.lastCursor =
                        productsData.length > 0
                            ? productsData[productsData.length - 1].cursor
                            : null;

                    console.log(`SHOPIFY: SEARCH RESULTS COUNT (${this.currentCollectionSize})`);
                    // Adjust the collection size if filters are applied
                    let paginationTotal = this.currentCollectionSize;
                    if (this.currentFilters.length > 0) {
                        paginationTotal = productNodes.length;
                    }

                    console.log(
                        `SHOPIFY: SEARCH RESULTS (${paginationTotal})`,
                        productNodes,
                    );

                    const articleListEvent = new CustomEvent(
                        "searchrequest-articles-complete",
                        {
                            detail: {
                                query: searchTerm,
                                type: "header",
                                articles: articleNodes?.slice(0, 4),
                                totalResults: articleNodes.length,
                            },
                        },
                    );
                    window.dispatchEvent(articleListEvent);

                    const productListEvent = new CustomEvent(
                        "searchrequest-products-complete",
                        {
                            detail: {
                                query: searchTerm,
                                type: "header",
                                products: productNodes.slice(0, 4),
                                totalResults: productNodes.length,
                            },
                        },
                    );
                    window.dispatchEvent(productListEvent);
                } else {
                    console.log("SHOPIFY", "EMPTY SEARCH");
                    const productListEvent = new CustomEvent(
                        "searchrequest-products-complete",
                        {
                            detail: {
                                query: "",
                                type: "header",
                                products: [],
                                totalResults: 0,
                            },
                        },
                    );
                    window.dispatchEvent(productListEvent);
                }
            },
            debounce(fn, wait) {
                let t;
                return (...args) => {
                    clearTimeout(t);
                    t = setTimeout(() => fn.apply(this, args), wait);
                };
            },
            getSortLabel(defaultSort) {
                let sort = "";
                switch (defaultSort) {
                    case "CREATED":
                        sort = "Newest";
                        break;
                    case "BEST_SELLING":
                        sort = "Popular";
                        break;
                    case "PRICE_DESC":
                        sort = "LowToHigh";
                        break;
                    case "PRICE_ASC":
                        sort = "HighToLow";
                        break;
                    case "MANUAL":
                        sort = "Featured";
                        break;
                }
                return sort;
            }
        };
    },
};
