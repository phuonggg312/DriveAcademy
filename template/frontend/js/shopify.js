import helpers from "./helpers";
import api from "./api";

export default {
  getProductQuery() {
    return `
      id
      title
      handle
      tags
      productType
      createdAt
      totalInventory
      vendor
      options {
        name,
        values
      }
      featuredImage {
        altText
        url
      }
      isGiftCard
      images(first: 2) {
        edges {
          node {
            altText
            url
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "bottle_siblings" },
        { namespace: "custom", key: "bottle_colour" },
        { namespace: "custom", key: "bottle_colour_name" }
      ]) {
        namespace
        key
        value
        type
        description
      }
     sellingPlanGroups(first: 5) {
      edges {
        node {
          name
          options {
            name
            values
          }
          sellingPlans(first: 5) {
            edges {
              node {
                id
                name
                description
                priceAdjustments {
                  adjustmentValue {
                    ... on SellingPlanFixedPriceAdjustment {
                      price {
                        amount
                        currencyCode
                      }
                    }
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
      priceRange {
        maxVariantPrice {
          amount
        }
        minVariantPrice {
          amount
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            availableForSale
            sku
            selectedOptions {
              value
            }
            compareAtPrice {
              amount
            }
            image {
              altText
              url
            }
          }
        }
      }
    `;
  },
  getRelatedProductsQuery(tags) {
    const tagQuery = tags.map((tag) => `tag:'${tag}'`).join(" OR ");
    return `
    query getRelatedProducts {
      products(first: 10, query: "(${tagQuery})") {
        edges {
          node {
            id
            title
            handle
            images(first: 10) {
              edges {
                node {
                  altText
                  src
                }
              }
            }
          }
        }
      }
    }
  `;
  },
  // Helper function to generate the GraphQL query
  getRelatedProductsByHandleQuery(handles) {
    const handlesString = handles.map((handle) => `'${handle}'`).join(" OR ");
    return `
        {
            products(first: 20, query: "(${handlesString})") {
                edges {
                    node {
                        id
                        title
                        handle
                        tags

                        priceRange {
                            maxVariantPrice {
                              amount
                            }
                            minVariantPrice {
                              amount
                            }
                        }
                        variants(first: 100) {
                            edges {
                              node {
                                id
                                availableForSale
                                selectedOptions {
                                  value
                                }
                                compareAtPrice {
                                  amount
                                }
                                image {
                                  altText
                                  url
                                }
                              }
                            }
                          }
                        images(first: 10) {
                            edges {
                                node {
                                    src
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
  },

  async getMetafieldsForProduct(ids) {
    const query = `
        query getProductMetafields($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              handle
              metafields(identifiers: [
                { namespace: "custom", key: "bottle_siblings" },
                { namespace: "custom", key: "bottle_colour" },
                { namespace: "custom", key: "bottle_colour_name" }
              ]) {
                namespace
                key
                value
                type
                description
              }
            }
          }
        }
      `;

    // Construct headers for the Storefront API
    const headers = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": `${api.getStorefrontToken()}`,
      // 'X-Shopify-Access-Token': `${api.getPublicAccessToken()}`, // This is not typically needed for Storefront API
    };

    // Send the request
    const response = await fetch(
      `${helpers.getDomain()}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          query: query,
          variables: { ids: ids },
        }),
      },
    );

    const jsonResponse = await response.json();

    // Extract products
    const products = jsonResponse.data?.nodes || [];

    // Transform the products as needed
    const transformedProducts = products.map((product) =>
      this.transformGraphqlProduct(product),
    );

    return transformedProducts;
  },
  async authenticatedFetch(fetchDetails) {
    fetchDetails.url = `${helpers.getDomain()}/admin/api/2024-01/graphql.json`;
    fetchDetails.shop_url = `${helpers.getDomain(false)}/admin/api/2024-01/graphql.json`;
    fetchDetails.key = "SHOPIFY_API_AUTHENTICATED_KEY";
    // fetchDetails.hash = sig;

    const response = await fetch(`${helpers.getDomain()}/apps/arctheme/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchDetails),
    });

    if (!response.ok) {
      console.error(`Error calling authenticated api: ${response.statusText}`);
    }
    return await response.json();
  },
  async unauthenticatedFetch(query, variables = null, storefront = false) {
    // Construct the URL based on the 'storefront' flag
    const apiPath = storefront ? "api" : "admin/api";
    const url = `${helpers.getDomain()}/${apiPath}/2024-01/graphql.json`;

    // Construct headers conditionally based on the 'storefront' flag
    let headers = {
      "Content-Type": "application/graphql",
    };

    if (storefront) {
      headers["X-Shopify-Storefront-Access-Token"] =
        `${api.getStorefrontToken()}`; // This key to be stored elsewhere
    } else {
      headers["X-Shopify-Access-Token"] = `${api.getPublicAccessToken()}`; // This key to be stored elsewhere (Can only be private app key, cannot be the public/custom app key)
    }

    // Perform the GraphQL request
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: query,
    });

    return await response.json();
  },
  async getStockForProducts(productData, storefront = false) {
    const data = `{
            nodes(ids: [${productData.reduce((filtered, id) => {
              filtered.push('"' + "gid://shopify/Product/" + id + '"');
              return filtered;
            }, [])}]) {
              id
              ... on Product {
                ${this.getProductQuery()}
              }
            }
          }`;

    // Construct headers conditionally based on the 'storefront' flag
    let headers = {
      "Content-Type": "application/graphql",
    };

    if (storefront) {
      headers["X-Shopify-Storefront-Access-Token"] =
        `${api.getStorefrontToken()}`; // This key to be stored elsewhere
    } else {
      headers["X-Shopify-Access-Token"] = `${api.getPublicAccessToken()}`; // This key to be stored elsewhere (Can only be private app key, cannot be the public/custom app key)
    }

    let transformedProducts = null;
    const response = await fetch(
      `${helpers.getDomain()}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: headers,
        body: data,
      },
    );
    const jsonResponse = await response.json();
  },
  async getShopifyArticleList(tags) {
    const tagQuery = tags.map((tag) => `tag:'${tag}'`).join(" OR ");
    const data = `{
        articles(first: 10, query: "(${tagQuery})") {
            edges {
                node {
                    id
                    title
                    tags
                    excerpt
                    publishedAt
                    handle
                    blog {
                        handle
                    }
                    image {
                        src
                        altText
                    }
                }
            }
        }
    }`;

    // Construct headers conditionally based on the 'storefront' flag
    let headers = {
      "Content-Type": "application/graphql",
    };
    headers["X-Shopify-Storefront-Access-Token"] =
      `${api.getStorefrontToken()}`; // This key to be stored elsewhere
    headers["X-Shopify-Access-Token"] = `${api.getPublicAccessToken()}`; // This key to be stored elsewhere (Can only be private app key, cannot be the public/custom app key)

    let transformedArticles = null;
    const response = await fetch(
      `${helpers.getDomain()}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: headers,
        body: data,
      },
    );

    const jsonResponse = await response.json();
    const articles = jsonResponse.data?.articles.edges.map((edge) => edge.node);

    console.log(articles);

    transformedArticles = articles.map((article) =>
      this.transformGraphqlArticle(article),
    );

    return transformedArticles;
  },

  transformGraphqlArticle(article) {
    return {
      id: article.id,
      title: article.title,
      url: article.url,
      handle: article.handle,
      tags: article.tags,
      excerpt: article.excerpt,
      publishedAt: article.publishedAt,
      blog: article.blog
        ? {
            handle: article.blog.handle,
          }
        : null,
      image: article.image
        ? {
            src: article.image.src,
            altText: article.image.altText,
          }
        : null,
    };
  },
  async getShopifyProductList(productData) {
    const data = `{
          nodes(ids: [${productData.reduce((filtered, id) => {
            filtered.push('"' + "gid://shopify/Product/" + id + '"');
            return filtered;
          }, [])}]) {
            id
            ... on Product {
              ${this.getProductQuery()}
            }
          }
        }`;

    // Construct headers conditionally based on the 'storefront' flag
    let headers = {
      "Content-Type": "application/graphql",
    };
    headers["X-Shopify-Storefront-Access-Token"] =
      `${api.getStorefrontToken()}`; // This key to be stored elsewhere
    headers["X-Shopify-Access-Token"] = `${api.getPublicAccessToken()}`; // This key to be stored elsewhere (Can only be private app key, cannot be the public/custom app key)

    let transformedProducts = null;
    const response = await fetch(
      `${helpers.getDomain()}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: headers,
        body: data,
      },
    );


    const jsonResponse = await response.json();

    const products = jsonResponse.data?.nodes.filter((node) => node);
    transformedProducts = products?.map((product) =>
      this.transformGraphqlProduct(product),
    );

    return transformedProducts;
  },
  async getRelatedProducts(products, checkTag = "colour:") {
    const tags = products.flatMap((product) =>
      product.tags.filter((tag) => tag.startsWith(checkTag)),
    );
    const uniqueTags = [...new Set(tags)];
    const relatedProductsQuery = this.getRelatedProductsQuery(uniqueTags);

    let headers = {
      "Content-Type": "application/graphql",
      "X-Shopify-Storefront-Access-Token": `${api.getStorefrontToken()}`,
      "X-Shopify-Access-Token": `${api.getPublicAccessToken()}`,
    };

    const response = await fetch(
      `${helpers.getDomain()}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: headers,
        body: relatedProductsQuery,
      },
    );

    const jsonResponse = await response.json();

    const relatedProducts = jsonResponse.data?.products?.edges.map(
      (edge) => edge.node,
    );

    return relatedProducts || [];
  },
async getRelatedProductsByTag(product, tagPrefix = "colour:") {
    // Extract handles from tags that start with the given prefix
    const tags = product.tags
        .filter((tag) => tag.startsWith(tagPrefix))
        .map((tag) => tag.replace(tagPrefix, "").trim());

    const uniqueTags = [...new Set(tags)]; // Get unique handles

    if (uniqueTags.length > 0) {
        const relatedProductsQuery =
            this.getRelatedProductsByHandleQuery(uniqueTags);

        let headers = {
            "Content-Type": "application/graphql",
            "X-Shopify-Storefront-Access-Token": `${api.getStorefrontToken()}`,
            "X-Shopify-Access-Token": `${api.getPublicAccessToken()}`,
        };

        const response = await fetch(
            `${helpers.getDomain()}/api/2024-07/graphql.json`,
            {
                method: "POST",
                headers: headers,
                body: relatedProductsQuery,
            },
        );

        const jsonResponse = await response.json();

        const relatedProducts = jsonResponse.data?.products?.edges.map(
            (edge) => edge.node,
        );
        const transformedRelatedProducts = relatedProducts?.map((product) =>
            this.transformGraphqlProduct(product),
        );
        return transformedRelatedProducts || [];
    }
    return [];
},
  async getRecommendedProducts(productId) {
    try {
      let headers = {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": `${api.getStorefrontToken()}`,
      };

      const response = await fetch(
        `${helpers.getDomain()}/recommendations/products.json?product_id=${productId}`,
        {
          method: "GET",
          headers: headers,
        },
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching recommendations: ${response.statusText}`,
        );
      }

      const jsonResponse = await response.json();

      console.log('Recommended response:', jsonResponse);
      return jsonResponse.products || [];
    } catch (error) {
      console.error("Failed to fetch product recommendations:", error);
    }
  },
  transformPrice(price) {
    return price / 100;
  },
  transformGraphqlProduct(productNode, collectionHandle = null) {
    const hasOnlyDefaultVariant =
      (productNode?.options?.[0]?.values?.[0] ?? "") === "Default Title";

    return productNode
      ? {
          objectType: "product",
          productType: productNode.productType,
          isGiftCard: productNode.isGiftCard,
          handle: productNode.handle,
          url: collectionHandle
            ? `/collections/${collectionHandle}/products/${productNode.handle}`
            : `/products/${productNode.handle}`,
          id: parseInt(productNode.id.replace("gid://shopify/Product/", "")),
          tags: productNode.tags?.map((tag) => tag.toLowerCase()),
          title: productNode.title,
          createdAt: productNode.createdAt,
          totalInventory: productNode.totalInventory,
          vendor: productNode.vendor,
          // metafield values are transformed into arrays for consistency
          metafields: productNode.metafields
            ?.filter((node) => node)
            .map((metafield) => {
              return {
                ...metafield,
                value: metafield.value.includes("[")
                  ? JSON.parse(metafield.value).flat()
                  : [metafield.value],
              };
            }),
          variants: productNode.variants?.edges.map(({ node }) => {
            return {
              id: parseInt(
                node.id.replace("gid://shopify/ProductVariant/", ""),
              ),
              available: node.availableForSale,
                sku: node.sku,
              compare_at_price: node.compareAtPrice?.amount * 100 || null,
              options: node.selectedOptions.map((option) => option.value),
              image: {
                alt: node?.image?.altText
                  ? node.image.altText
                  : productNode.title,
                media_type: "image",
                src: node?.image?.url ? node.image.url : null,
              },
            };
          }),
          selling_plan_groups: productNode.sellingPlanGroups?.edges.map(
            ({ node }) => {
              return {
                name: node.name,
                options: node.options.map((option) => option),
                selling_plans: node.sellingPlans.edges.map(({ node }) => {
                  return {
                    id: parseInt(
                      node.id.replace("gid://shopify/SellingPlan/", ""),
                    ),
                    name: node.name,
                    description: node.description,
                    price_adjustments: node.priceAdjustments.map(
                      ({ adjustmentValue }) => {
                        return {
                          value_type: "percentage",
                          value: adjustmentValue.adjustmentPercentage,
                        };
                      },
                    ),
                  };
                }),
              };
            },
          ),
          price_calculated: productNode.priceRange?.minVariantPrice.amount,
          compare_at_price_calculated:
            productNode.variants?.edges[0].node.compareAtPrice?.amount || null,
          price: productNode.priceRange?.minVariantPrice.amount * 100,
          compare_at_price:
            productNode.variants?.edges[0].node.compareAtPrice?.amount * 100 ||
            null,
          featuredImage: {
            alt: productNode?.featuredImage?.altText
              ? productNode.featuredImage.altText
              : productNode.title,
            media_type: "image",
            src: productNode?.featuredImage?.url
              ? productNode.featuredImage.url
              : null,
          },
          media: productNode.images?.edges.map((image) => {
            return {
              alt: image?.node?.altText
                ? image.node.altText
                : productNode.title,
              media_type: "image",
              src: image?.node?.url ? image.node.url : null,
            };
          }),
          has_only_default_variant: hasOnlyDefaultVariant,
          options: productNode.options?.map((option) => option.name),
          options_with_values: productNode.options?.map((option) => {
            return {
              name: option.name,
              position: productNode.options.indexOf(option) + 1,
              values: option.values,
            };
          }),
        }
      : null;
  },

  getShopifyImageUrl(
    originalUrl,
    width = null,
    height = null,
    customQueries = null,
  ) {
    const params = {
      width: width ? Math.ceil(width) : null,
      height: height ? Math.ceil(height) : null,
      ...customQueries,
    };

    const url = helpers.updateUrlParameters(originalUrl, params);
    return url;
  },

    // Convert Shopify richtext schema into HTML
    // Refer to https://github.com/TheBeyondGroup/shopify-rich-text-renderer#readme for more details
    renderRichText(schema, options) {
        return convertSchemaToHtml(schema, options);
    },

    // Decoding escaped string - Use for escaped HTML (ex. collection description)
    decodeLiquidEscape(input) {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent || '';
    },

    // Decoding and parsing escaped JSON string - Use for escaped object (ex. richtext)
    decodeAndParseLiquidEscapeObject(input) {
        return JSON.parse(this.decodeLiquidEscape(input));
    },

    getVideoSrc(video) {
        return video?.sources.find((source) => source.format === 'mp4');
    },

    interpolateLocale(str, data) {
        let result = str;
        const variables = Object.keys(data);
        variables.forEach((variable) => {
            result = result.replace(`{{ ${variable} }}`, data[variable]);
        });

        return result;
    },

    getShopifyFileUrl(handle, fileType) {
        return window.fileUrl.split('?')[0].replace('replace', `${handle}.${fileType}`);
    },

    async getCountries() {
        const data = await addressFormatter.getCountries();

        return data;
    },

    async getProvinces(countryCode) {
        const data = await addressFormatter.getCountry(countryCode);

        return data.zones;
    }
};
