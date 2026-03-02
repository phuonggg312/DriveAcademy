import cloneDeep from "lodash/cloneDeep";
import helpers from "../../../helpers";
let filters = {};
let sortBy = null;

export const searchproductlist = {
  name: "searchproductlist",
  component() {
    return {
      collection: null,
      isCollection: null,
      filters: {},
      filterString: null,
      products: [],
      totalResults: null,
      currentResults: null,
      currentResultsCount: 0,
      collectionSize: 0,
      startingPage: 0,
      page: 0,
      isInit: false,
      queryInput: null,
      sortBy: cloneDeep(window.defaultSort),
      haveLoadedAllProducts: false,
      init() {
        this.extractFiltersFromURL();
      },
      initialise(collectionHandle = null, isCollection, collectionSize = null) {
        if (isCollection) {
          console.log(
            `Arctheme PLP/Search Component Initialized Size:(${collectionSize}).`,
          );
          this.collection = collectionHandle;
          this.isCollection = isCollection;
          this.collectionSize = collectionSize;

          if (this.filterString) {
            window.dispatchEvent(
              new CustomEvent("searchrequest", {
                detail: {
                  type: "plp",
                  index: this.sortBy,
                  filters: this.filterString
                    ? `collections:${this.collection} AND ${this.filterString}`
                    : `collections:${this.collection}`,
                  filters_object: this.filters,
                  collection: this.collection,
                  collectionSize: this.collectionSize,
                  isFiltering: true,
                },
              }),
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("searchrequest", {
                detail: {
                  type: "plp",
                  index: this.sortBy,
                  filters_object: this.filters,
                  collection: this.collection,
                  collectionSize: this.collectionSize,
                  filters: this.filterString
                    ? `collections:${this.collection} AND ${this.filterString}`
                    : `collections:${this.collection}`,
                },
              }),
            );
          }
        } else {
          this.collectionSize = collectionSize;
          const urlParams = new URLSearchParams(window.location.search);
          const queryFromParams = urlParams.get("q");
          this.query(queryFromParams, null);
          console.log("SPL: Query exists, searching for products");
        }

        // searchrequest-sortchanged
        window.addEventListener(
          "collection-search-loaded",
          this.handleCollectionSearchLoad(this),
        );
        window.addEventListener("sort-products", this.sort.bind(this));
        window.addEventListener("apply-filters", this.apply.bind(this));
        window.addEventListener(
          "searchrequest-products-complete",
          this.handleSearchComplete.bind(this),
        );
        window.addEventListener("nextpage", this.handleNextPage.bind(this));
      },
      subscribe(callback) {
        window.addEventListener("products-results", callback);
        return () => {
          window.removeEventListener("products-results", callback);
        };
      },
      handleCollectionSearchLoad() {
        if (filters) {
          if (this.isCollection) {
            this.isCollection = true;
            console.log("SPL: Collection Loaded");
            window.dispatchEvent(
              new CustomEvent("active-filters", {
                detail: {
                  type: "plp",
                  activeFilters: filters,
                },
              }),
            );
          } else {
            console.log("SPL: Search Loaded");
            this.isCollection = false;
            window.dispatchEvent(
              new CustomEvent("active-filters", {
                detail: {
                  type: "search",
                  activeFilters: filters,
                },
              }),
            );
          }
        }
      },
      query(input, lastQuery = localStorage.getItem("queryInput")) {
        if (lastQuery) {
          console.log("SPL: Using last query, sending request for products");
          this.query = lastQuery;
          const queryObj = {
            query: lastQuery,
            type: "search",
            index: this.sortBy,
            collectionSize: this.collectionSize,
            filters: this.filterString ? this.filterString : "",
          };
          dispatchEvent(new CustomEvent("searchrequest", { detail: queryObj }));
        } else {
          console.log("SPL: Using query, sending request for products");
          this.query = input;
          const queryObj = {
            query: input,
            type: "search",
            index: this.sortBy,
            collectionSize: this.collectionSize,
            filters: this.filterString ? this.filterString : "",
          };
          dispatchEvent(new CustomEvent("searchrequest", { detail: queryObj }));
        }
      },
      filter(filterKey, valueKey) {
        if (filters[filterKey] && filters[filterKey]?.length > 0) {
          if (filters[filterKey]?.includes(valueKey)) {
            console.log(filters[filterKey]);

            // Remove the filter if it already exists
            filters[filterKey] = filters[filterKey].filter(
              (value) => value !== valueKey,
            );

            // Remove the filterKey if there are no values left
            if (filters[filterKey].length === 0) {
              delete filters[filterKey];
            }
          } else {
            // Add the filter if it doesn't exist
            filters[filterKey].push(valueKey);
          }
        } else {
          // Initialize the filter if it doesn't exist
          filters[filterKey] = [valueKey];
        }

        if (this.isCollection) {
          console.log(`SPL: Filtering Collection`, filters);
          window.dispatchEvent(
            new CustomEvent("active-filters", {
              detail: {
                type: "plp",
                activeFilters: filters,
              },
            }),
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("active-filters", {
              detail: {
                type: "search",
                activeFilters: filters,
              },
            }),
          );
        }

        this.filterString = Object.keys(filters)
          .map((key) =>
            filters[key].map((value) => `${key}:'${value}'`).join(" AND "),
          )
          .filter(Boolean)
          .join(" AND ");

        console.log(`SPL: Filtering (${this.filterString})`);
        this.updateUrl();

        if (this.isCollection) {
          if (this.filterString) {
            window.dispatchEvent(
              new CustomEvent("searchrequest-filter-applied", {
                detail: {
                  type: "plp",
                  index: this.sortBy,
                  filters: this.filterString
                    ? `collections:${this.collection} AND ${this.filterString}`
                    : `collections:${this.collection}`,
                  filters_object: filters,
                  reset: true,
                  isFilteringRequest: true,
                },
              }),
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("searchrequest-filter-applied", {
                detail: {
                  type: "plp",
                  index: this.sortBy,
                  filters: this.filterString
                    ? `collections:${this.collection} AND ${this.filterString}`
                    : `collections:${this.collection}`,
                  filters_object: filters,
                  reset: true,
                  isFilteringRequest: false,
                },
              }),
            );
          }
        } else {
          window.dispatchEvent(
            new CustomEvent("searchrequest-filter-applied", {
              detail: {
                type: "search",
                index: this.sortBy,
                query: this.query,
                filters: this.filterString ? `${this.filterString}` : "",
              },
            }),
          );
        }

        this.totalResults = 0;
        this.currentResults = null;
        this.currentResultsCount = 0;
        this.page = this.startingPage;
      },
      sort(event) {
        console.log(`SPL: Sort request received (${this.isCollection})`);
        this.sortBy = event.detail.sortOption;
        sortBy = this.sortBy;

        this.updateUrl();

        if (this.isCollection) {
          window.dispatchEvent(
            new CustomEvent("searchrequest-sort-applied", {
              detail: {
                type: "plp",
                index: this.sortBy,
                sortOption: this.sortBy,
                filters: this.filterString
                  ? `collections:${this.collection} AND ${this.filterString}`
                  : `collections:${this.collection}`,
                reset: true,
              },
            }),
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("searchrequest-sort-applied", {
              detail: {
                type: "search",
                index: this.sortBy,
                query: this.query,
                filters: this.filterString ? `${this.filterString}` : "",
              },
            }),
          );
        }

        this.totalResults = 0;
        this.currentResults = null;
        this.currentResultsCount = 0;
        this.page = this.startingPage;
      },
      handleSearchComplete(event) {
        const { type, page, isFiltering } = event.detail;
        if (type === "plp" || type == "search") {
          console.log("Current Page count", this.page);
          if (this.page > 0) {
            this.products = [
              ...this.currentResults,
              ...event.detail.products,
            ].reduce((uniqueProducts, product) => {
              if (!uniqueProducts.some((p) => p.id === product.id)) {
                uniqueProducts.push(product);
              }
              return uniqueProducts;
            }, []);
            this.currentResults = this.products;
            this.currentResultsCount = this.currentResults.length;
          } else {
            this.products = event.detail.products;
            this.currentResults = event.detail.products;
            this.currentResultsCount = this.currentResults.length;
          }

          if (this.isCollection) {
            window.dispatchEvent(
              new CustomEvent("filter-list", {
                detail: {
                  type: "plp",
                  filters: event.detail.filters,
                },
              }),
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("filter-list", {
                detail: {
                  type: "search",
                  filters: event.detail.filters,
                },
              }),
            );
          }
          this.filters = event.detail?.filters?.reduce((acc, filter) => {
            acc[filter.key] = [];
            return acc;
          }, {});

          this.totalResults = event.detail.totalResults;
          this.haveLoadedAllProducts =
            this.totalResults === this.currentResults.length;

          if (this.isCollection) {
            window.dispatchEvent(
              new CustomEvent("product-list", {
                detail: {
                  type: "plp",
                  products: this.products,
                  filters: this.filters,
                  totalResults: this.totalResults,
                  page: page,
                  isFiltering: isFiltering,
                },
              }),
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("product-list", {
                detail: {
                  type: "search",
                  products: this.products,
                  filters: this.filters,
                  query: this.query,
                  totalResults: this.totalResults,
                },
              }),
            );
          }
        }
      },
      handleNextPage(event) {
        const { page } = event.detail;

        if (this.haveLoadedAllProducts) {
          window.dispatchEvent(
            new CustomEvent("product-list", {
              detail: {
                type: "plp",
                products: this.products,
                filters: this.filters,
                totalResults: this.totalResults,
                page,
                isFiltering: false,
              },
            }),
          );

          return;
        }

        this.page = event.detail.page;

        if (this.isCollection) {
          window.dispatchEvent(
            new CustomEvent("searchrequest-nextpage", {
              detail: {
                type: "plp",
                filters: this.filterString
                  ? `collections:${this.collection} AND ${this.filterString}`
                  : `collections:${this.collection}`,
                index: this.sortBy,
                page: this.page,
              },
            }),
          );
        } else {
          const queryObj = {
            query: this.query,
            type: "search",
            filters: this.filterString ? `${this.filterString}` : "",
            index: this.sortBy,
            page: this.page,
          };
          dispatchEvent(
            new CustomEvent("searchrequest-nextpage", { detail: queryObj }),
          );
        }
      },
      extractFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterString = urlParams.get("filters");
        const sortBy = urlParams.get("sort_by");

        if (filterString) {
          const decodedParams = decodeURIComponent(filterString);
          decodedParams.split(" AND ").forEach((pair) => {
            const [key, value] = pair.split(":");
            if (filters[key]) {
              filters[key].push(value);
            } else {
              filters[key] = [value];
            }
          });

          this.filterString = Object.keys(filters)
            .map((key) =>
              filters[key].map((value) => `${key}:'${value}'`).join(" AND "),
            )
            .filter(Boolean)
            .join(" AND ");
        }

        if (sortBy) {
          this.sortBy = sortBy;
          window.extractedSortBy = cloneDeep(sortBy);
        }

        window.dispatchEvent(
          new CustomEvent("extracted-params", {
            detail: {
              index: this.sortBy,
            },
          }),
        );

        this.handleCollectionSearchLoad();
      },
      updateUrl() {
        const filterStringUrl = Object.keys(filters)
          .map((key) =>
            filters[key].map((value) => `${key}:${value}`).join(" AND "),
          )
          .filter(Boolean)
          .join(" AND ");

        const url = new URL(window.location);
        const encodedFilterString = encodeURIComponent(filterStringUrl);

        url.searchParams.set("filters", encodedFilterString);

        if (sortBy) {
          url.searchParams.set("sort_by", sortBy);
        }

        window.history.pushState({}, "", url);
      },
      apply(event) {
        console.log("Apply filters");

        const filtersToApply = event.detail.filters;
        console.log(filtersToApply);

        filters = filtersToApply;
        if (this.isCollection) {
          console.log("Filter Collection", filters);

          window.dispatchEvent(
            new CustomEvent("active-filters", {
              detail: {
                type: "plp",
                activeFilters: filters,
              },
            }),
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("active-filters", {
              detail: {
                type: "search",
                activeFilters: filters,
              },
            }),
          );
        }

        this.filterString = Object.keys(filters)
          .map((key) =>
            filters[key].map((value) => `${key}:'${value}'`).join(" AND "),
          )
          .filter(Boolean)
          .join(" AND ");

        console.log("Filter String", this.filterString);

        this.updateUrl();

        if (this.isCollection) {
          if (this.filterString) {
            window.dispatchEvent(
              new CustomEvent("searchrequest-filter-applied", {
                detail: {
                  type: "plp",
                  index: this.sortBy,
                  filters: this.filterString
                    ? `collections:${this.collection} AND ${this.filterString}`
                    : `collections:${this.collection}`,
                  filters_object: filters,
                  reset: true,
                  isFilteringRequest: true,
                },
              }),
            );
          } else {
            window.dispatchEvent(
              new CustomEvent("searchrequest-filter-applied", {
                detail: {
                  type: "plp",
                  index: this.sortBy,
                  filters: this.filterString
                    ? `collections:${this.collection} AND ${this.filterString}`
                    : `collections:${this.collection}`,
                  filters_object: filters,
                  reset: true,
                  isFilteringRequest: false,
                },
              }),
            );
          }
        } else {
          window.dispatchEvent(
            new CustomEvent("searchrequest-filter-applied", {
              detail: {
                type: "search",
                index: this.sortBy,
                query: this.query,
                filters: this.filterString ? `${this.filterString}` : "",
                filters_object: filters,
              },
            }),
          );
        }

        this.totalResults = 0;
        this.currentResults = null;
        this.currentResultsCount = 0;
        this.page = this.startingPage;
      },
      clear() {
        filters = {};
        let filterString = "";

        this.currentResults = null;
        this.currentResultsCount = 0;
        this.page = this.startingPage;

        if (this.isCollection) {
          window.dispatchEvent(
            new CustomEvent("searchrequest-filter-applied", {
              detail: {
                type: "plp",
                index: this.sortBy,
                filters: filterString
                  ? `collections:${this.collection} AND ${filterString}`
                  : `collections:${this.collection}`,
                filters_object: filters,
                reset: true,
                isFilteringRequest: false,
              },
            }),
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("searchrequest-filter-applied", {
              detail: {
                type: "search",
                query: this.query,
                index: this.sortBy,
                filters: filterString ? `${filterString}` : "",
                filters_object: filters,
              },
            }),
          );
        }

        this.filters = {};
        this.filterString = "";

        if (this.isCollection) {
          window.dispatchEvent(
            new CustomEvent("active-filters", {
              detail: {
                type: "plp",
                activeFilters: filters,
              },
            }),
          );
        } else {
          window.dispatchEvent(
            new CustomEvent("active-filters", {
              detail: {
                type: "search",
                activeFilters: filters,
              },
            }),
          );
        }

        this.updateUrl();
      },
    };
  },
};

export default searchproductlist;
