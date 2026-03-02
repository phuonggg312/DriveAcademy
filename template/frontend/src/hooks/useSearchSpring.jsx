import { useState, useEffect, useCallback } from "react";
import shopify from "frontend/js/shopify";
import helpers from '../../js/helpers';
import { DEFAULT_TRENDING_QUERIES } from '../../js/alpine/components/search/searchspring/searchspring';

function useSearchSpring(collection = null) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsFacets, setSearchResultsFacets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestResults, setSuggestResults] = useState({});
  const [trendingResults, setTrendingResults] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [crossSellProducts, setCrossSellProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortingOptions, setSortingOptions] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const itemsPerPage = 13; // Number of items to load per page
  const searchSpring = window.searchSpring;

  const handleProductListing = useCallback(async (page = 1, filters = "") => {
    try {
      setLoading(true);
      const query = {
        resultsPerPage: itemsPerPage,
        page,
      };

      if (collection) {
        query['bgfilter.collection_handle'] = collection.handle;
      }

      if (sortOption) {
        const { field, direction } = sortOption;
        query[`sort.${field}`] = direction;
      }


      const productData = await searchSpring.fetchProductResults(query, filters);


      setTotalResults(productData?.pagination?.totalResults);
      setSortingOptions(productData?.sorting?.options || []);

      const transformedProducts = await transformProducts(productData?.results);

      if (page === 1) {
        setProducts(transformedProducts);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...transformedProducts]);
      }

      setFilters(productData?.facets);
    } catch (err) {
      console.error('Failed to fetch search results:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [collection, sortOption]);

  const handleAutocomplete = useCallback(async (q) => {
    try {
      setLoading(true);
      const query = { q };
      const searchData = await searchSpring.fetchAutocompleteResults(query);
      const transformedProducts = await transformProducts(searchData.results);

      setSearchResults(transformedProducts);
      setSearchResultsFacets(searchData.facets);

      window.dispatchEvent(new CustomEvent('searchrequest-products-complete', {
        detail: {
          query: q,
          products: transformedProducts,
          totalResults: searchData.pagination.totalResults,
          filters: filters,
          type: 'header',
          page: searchData.pagination.currentPage,
          isFiltering: false
        },
      }));

      return transformedProducts;
    } catch (err) {
      console.error('Failed to fetch autocomplete results:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSuggestResults = useCallback(async (q) => {
    try {
      const query = { q };
      const suggestData = await searchSpring.fetchSuggestResults(query);
      setSuggestResults(suggestData);
    } catch (err) {
      console.error('Failed to fetch suggest results:', err);
      setError(err);
    }
  }, []);

  const handleRecommendationListing = useCallback(async (productId, type) => {
    try {
      const productData = await searchSpring.fetchRecommendationResults(productId, type);
      const transformedProducts = await transformProducts(productData[0]?.results);
  
      if (type === 'similar') {
        setSimilarProducts(transformedProducts);
      } else if (type === 'cross-sell') {
        setCrossSellProducts(transformedProducts);
      }
    } catch (error) {
      console.error(`Error fetching ${type} products:`, error);
    }
  }, []);

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchResultsFacets([]);
    setSuggestResults({});
  };

  const transformProducts = useCallback(async (products) => {
    if (!products || products.length === 0) return [];

    const productIds = [...new Set(products.map(product => product.uid || product.mappings?.core?.uid))];

    try {
      const shopifyProducts = await shopify.getShopifyProductList(productIds);


      const productsWithColorPattern = await Promise.all(
        shopifyProducts.map(async (shopifyProduct) => {
          const { metafields } = shopifyProduct;
          const productSiblingsArr = metafields.find(item => item.key === "product_siblings");

          let colorPatterns = [];

          if (productSiblingsArr) {
            const siblingsRefArr = productSiblingsArr.references.edges;
            const productSiblingIds = siblingsRefArr.map(sibling => sibling.node.metafields[0].value);

            // Fetch color pattern data for each sibling
            colorPatterns = await Promise.all(productSiblingIds.map(async (id) => {
              const colorPatternQuery = shopify.getColorPatternQuery(helpers.cleanupGlobalId(id));
              const colorPatternData = await shopify.fetchGraphQL(colorPatternQuery);

              return colorPatternData?.metaobject?.fields || [];
            }));

            colorPatterns = colorPatterns.map((colorPatternArray, index) => {
              const colorPatternObject = {};
              colorPatternArray.forEach(item => {
                if (item.key === "image" && item.reference?.previewImage?.src) {
                  colorPatternObject[item.key] = item.reference.previewImage.src;
                } else {
                  colorPatternObject[item.key] = item.value;
                }
              });
              colorPatternObject['url'] = '/products/' + siblingsRefArr[index]?.node?.handle || '';

              return colorPatternObject;
            });
          }

          return {
            ...shopifyProduct,
            colorPatterns,
          };
        })
      );

      const productsWithTog = shopifyProducts.map(product => {
        const { metafields } = product;
        const productTogArr = metafields.find(item => item.key === "tog_rating");

        let productTogs = [];

        if (productTogArr) {
          const togRefArr = productTogArr.references.edges;

          productTogs = togRefArr.map(togNode => {
            const togObj = {};
            const node = togNode.node;

            // Extract the tog_title and tog_colour
            togObj['tog_colour'] = node.tog_colour?.value;
            togObj['tog_title'] = node.tog_title?.value;

            return togObj;
          });
        }

        return {
          ...product,
          productTogs,
        };
      });

      return products.map(product => ({
        ...product,
        ...productsWithColorPattern.find(shopifyProduct => shopifyProduct.id === parseInt(product.uid || product.mappings?.core?.uid)),
        ...productsWithTog.find(shopifyProduct => shopifyProduct.id === parseInt(product.uid || product.mappings?.core?.uid)),
      }));
    } catch (err) {
      console.error('Failed to transform products using Shopify:', err);
      return products;
    }
  }, []);

  const loadMoreProducts = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const changeSort = (sort) => {
    setSortOption(sort);
    setCurrentPage(1);
    setLoading(true);
  };

  const changeFilter = (filter) => {
    const queryStringUrl = helpers.updateUrlAndFilters(filter);
    setCurrentPage(1);
    setSelectedFilters(queryStringUrl);
  };

  const autocompleteSearch = (q) => {
    setSearchQuery(q);
    handleSuggestResults(q);
    handleAutocomplete(q);
  };

  const fetchSimilarProducts = (productId) => {
    handleRecommendationListing(productId, 'similar')
  }

  const fetchCrossSellProducts = (productId) => {
    handleRecommendationListing(productId, 'cross-sell');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialFilters = [];

    params.forEach((value, key) => {
      initialFilters.push(`${key}=${value}`);
    });

    const filterString = initialFilters.join("&");
    setSelectedFilters(`?${filterString}`);
    handleProductListing(currentPage, `?${filterString}`);
  }, [currentPage, sortOption]);

  useEffect(() => {
    if (selectedFilters) {
      handleProductListing(currentPage, selectedFilters);
    }
  }, [selectedFilters]);

  // useEffect(() => {
  //   if (searchQuery) {
  //     handleAutocomplete(searchQuery);
  //   }
  // }, [searchQuery, handleAutocomplete]);

  useEffect(() => {
    const handleTrendingResults = async () => {
      try {
        const trendingData = await searchSpring.fetchTrendingResults();
        let trendingQueries = trendingData?.trending?.queries || [];
        if (trendingQueries.length === 0) {
          trendingQueries = DEFAULT_TRENDING_QUERIES;
        }
        setTrendingResults(trendingQueries);
      } catch (error) {
        console.error('Failed to fetch trending results:', error);
        setTrendingResults([]);
      }
    };

    handleTrendingResults();
  }, []);

  return {
    products,
    filters,
    loading,
    error,
    totalResults,
    loadMoreProducts,
    sortingOptions,
    changeSort,
    changeFilter,
    autocompleteSearch,
    searchResults,
    searchResultsFacets,
    suggestResults,
    trendingResults,
    clearSearchResults,
    fetchSimilarProducts,
    similarProducts,
    fetchCrossSellProducts,
    crossSellProducts
  };
}

export default useSearchSpring;