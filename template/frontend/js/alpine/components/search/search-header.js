let searchedProducts = null;

export const searchheader = {
  name: "searchheader",
  component() {
    return {
      products: [],
      queryInput: "",
      // queryInput: Alpine.$persist([]).as('queryInput'),
      init() {
        window.addEventListener("products-results", (event) => {
          this.products = event.detail.products;
        });
      },
      subscribe(callback) {
        window.addEventListener("searchrequest-products-complete", callback);
        return () => {
          window.removeEventListener(
            "searchrequest-products-complete",
            callback,
          );
        };
      },
      getSearchedProducts() {
        return searchedProducts;
      },
      query(input) {
        // input = 'Suit
        const queryObj = {
          query: input,
          type: "header",
        };
        this.queryInput = input;
        dispatchEvent(new CustomEvent("searchrequest", { detail: queryObj }));
        const articleQueryObj = {
          query: input,
          type: "header",
          index: "articles",
        };
        dispatchEvent(
          new CustomEvent("searchrequest-articles", {
            detail: articleQueryObj,
          }),
        );

        const suggestionsQueryObj = {
          query: input,
          type: "header",
          index: ["suggestions", "collections"],
        };
        this.queryInput = input;

        window.dispatchEvent(
          new CustomEvent("show-spinner", {
            detail: {
              id: "spinner-search",
            },
          }),
        );

        dispatchEvent(
          new CustomEvent("searchrequest-suggestions", {
            detail: suggestionsQueryObj,
          }),
        );
        // dispatchEvent(new CustomEvent('searchrequest-keywords', { detail: queryObj }))
      },
      debouncedQuery: Alpine.debounce(function (input) {
        this.query(input);
      }, 300),
      getQuery() {
        return this.queryInput;
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
      },
      clearInput() {
        this.queryInput = "";
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
      },
    };
  },
};

export default searchheader;
