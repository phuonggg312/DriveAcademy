import shopifyHelper from "../../shopify";
import helpers from "../../helpers";
import api from "../../api";

export const wishlist = {
    name: 'wishlist',
    store() {
        return {
            open: false,
            response: null,
            products: Alpine.$persist([]).as('products'),
            init() {

            },
            toggle() {
                this.open = !this.open
            },
            close() {
                this.open = false
            },
            extractProductIds(responseData) {
                let fields = responseData.data.metaobject.fields;
                let productIds = [];

                fields.forEach(field => {
                    if (field.key === 'products') {
                        // Assuming the value is a JSON string of an array
                        let products = JSON.parse(field.value);
                        products.forEach(product => {
                            let matches = product.match(/Product\/(\d+)/);
                            if (matches) {
                                productIds.push(matches[1]);
                            }
                        });
                    }
                });

                return productIds;
            },
            async getMetaObject (metaobjectId) {
                console.log(this.products);
                console.log('Retrieving Metaobjects');
                return this.products;

                // create data query
                const data = `query {
                        metaobject(id: "gid://shopify/Metaobject/33694711961") {
                        id
                        handle
                        onlineStoreUrl
                        updatedAt
                        fields {
                            key
                            value
                        }
                      }
                    }
                `;

                const response =  await fetch(`${helpers.getDomain()}/api/2024-01/graphql.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/graphql',
                        'X-Shopify-Storefront-Access-Token': api.getStorefrontToken(),
                        'X-Shopify-Access-Token': api.getPublicAccessToken()
                    },
                    body: data
                })

                const jsonResponse = await response.json();
                let productIds = this.extractProductIds(jsonResponse);

                console.log('Retrieving from Shopify');
                const transformedProducts = await shopifyHelper.getShopifyProductList(productIds);
                this.products = transformedProducts;
                console.log('Products retrieved');
                console.log(transformedProducts);
                this.response = jsonResponse;
                return jsonResponse
            },
            isItemInWishlist(product_id){
                const doesExist = this.products.some(product => parseInt(product.id) === parseInt(product_id));
                return doesExist;
            },
            async addToWishlist(product_id){
                console.log('Adding to wishlist: ' + product_id );

                const transformedProduct = await shopifyHelper.getShopifyProductList([product_id]);
                console.log(transformedProduct);

                const isDuplicate = this.products.some(product => parseInt(product.id) === parseInt(transformedProduct[0].id));
                if (!isDuplicate) {
                    // If it's not a duplicate, concatenate the product to the products array
                    this.products = this.products.concat(transformedProduct);
                    console.log(this.products);
                } else {
                    console.log('Product with id ' + transformedProduct[0].id + ' already exists.');
                }

                return this.products;
            },
            async removeFromWishlist(id){
                console.log('Removing Metaobject');
                this.products = this.products.filter(element => element.id !== id);

                return true;
                const query = `mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
                    metaobjectUpdate(id: $id, metaobject: $metaobject) {
                        metaobject {
                            handle
                            season: field(key: "product") {
                                value
                            }
                        }
                        userErrors {
                            field
                            message
                            code
                        }
                    }
                }`

                const variables = `{
                  "id": "gid://shopify/Metaobject/33694711961",
                  "metaobject": {
                    "fields": [
                      {
                        "key": "products",
                        "value": "[\\"gid://shopify/Product/7802207338649\\"]"
                      }
                    ]
                  }
                }`

                const response = fetch(`${helpers.getDomain()}/api/2024-01/graphql.json`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/graphql',
                        'X-Shopify-Storefront-Access-Token': api.getStorefrontToken(),
                        'X-Shopify-Access-Token': api.getPublicAccessToken()
                    },
                    body: query
                })
                .then(response => response.json())
                .then(response => {
                    this.response = response;
                    return response
                });

            }
        }
    }
}

export default wishlist;
