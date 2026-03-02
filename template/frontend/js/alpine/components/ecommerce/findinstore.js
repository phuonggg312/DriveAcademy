import shopifyHelper from "../../../shopify";
import {hasher } from "../../stores/hasher";

import GET_INVENTORY_ITEMS from '../../../graphql/2024_01/inventory/get.graphql';

let inventoryLevels = null;
let deliveryMethods = null;
const useAuthenticated = true;

export const findinstore = {
    name: 'findinstore',
    component() {
        return {
            open: false,
            sku: '',
            inventoryLevels: [],
            deliveryMethods: [],
            async init() {
                window.findinstore = this;
            },
            subscribe(callback) {
                window.addEventListener('findinstore-search', callback);
                return () => {
                    window.removeEventListener('findinstore-search', callback);
                };
            },
            getInventoryLevels() {
                return inventoryLevels;
            },
            getDeliveryMethods() {
                return deliveryMethods;
            },
            async getDeliveryMethodsShopify(){
                console.log('Retrieving Delivery Methods');
                const deliveryMethodQuery = `query {
                  deliveryProfiles (first: 2) {
                    edges {
                      node {
                        name
                        profileLocationGroups {
                          locationGroupZones(first: 2) {
                            edges {
                              node {
                                methodDefinitions(first: 4) {
                                  edges {
                                    node {
                                        name
                                        description
                                        rateProvider {
                                        ... on DeliveryRateDefinition {
                                          id
                                          price {
                                            amount
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }`;

                const jsonResponse = await shopifyHelper.unauthenticatedFetch(deliveryMethodQuery);
                this.deliveryMethods = jsonResponse.data.deliveryProfiles.edges[0].node.profileLocationGroups[0].locationGroupZones.edges[0].node.methodDefinitions.edges;

                let methods = [];

                this.deliveryMethods.forEach((method) => {
                    const node = method.node;
                    methods.push({
                        name: node.name,
                        price: node.rateProvider.price.amount,
                        description: node.description
                    });
                });

                deliveryMethods = methods;
                this.response = jsonResponse;

                let clickEvent = new Event('findinstore-search', { bubbles: true });
                dispatchEvent(clickEvent);

                return jsonResponse
            },
            async getStockForProduct (sku) {
                console.log('Retrieving Product Stock');
                const body = JSON.stringify({
                    query: GET_INVENTORY_ITEMS.loc.source.body,
                    variables: {
                        query: `sku:'${sku}'`
                    }
                });
                let data = {
                    options: {
                        method: 'POST',
                        headers: {
                            'X-Shopify-Access-Token': '<SHOPIFY_API_AUTHENTICATED_KEY>',
                            'Content-Type': 'application/json',
                            'X-MindArc-Hash': hasher.store().getHash()
                        },
                        body: body,
                        request_body: GET_INVENTORY_ITEMS.loc.source.body,
                    }
                }

                let jsonResponse = null;
                if (useAuthenticated){
                    jsonResponse = await shopifyHelper.authenticatedFetch(data);
                } else {
                    jsonResponse = await shopifyHelper.unauthenticatedFetch(body)
                }

                this.inventoryLevels = jsonResponse.data.inventoryItems?.edges[0].node?.inventoryLevels.edges;

                let levels = [];
                this.inventoryLevels.forEach((inventoryLevel) => {
                    const node = inventoryLevel.node;
                    const location_name = node.location.name;
                    let qty = 0;
                    let stock_type = 'available';

                    node.quantities.forEach((quantity) => {
                        qty = quantity.quantity;
                        stock_type = quantity.name;
                    });

                    levels.push({
                        name: location_name,
                        qty: qty,
                        stock_type: stock_type,
                        stock_status: qty > 0,
                    });
                });

                inventoryLevels = levels;
                this.response = jsonResponse;

                let clickEvent = new Event('findinstore-search', { bubbles: true });
                dispatchEvent(clickEvent);

                return jsonResponse;
            }
        }
    }
}

export default findinstore;
