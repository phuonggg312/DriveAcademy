import shopifyHelper from "../../../shopify";
import GET_ORDER_INFO from '../../../graphql/2024_01/order/get.graphql';
import hasher from "../../stores/hasher";
import GET_INVENTORY_ITEMS from "../../../graphql/2024_01/inventory/get.graphql";

let order = null;
const useAuthenticated = true;
let sig = '';

export const trackorder = {
    name: 'trackorder',
    component() {
        return {
            open: false,
            sku: '',
            order: null,
            async init() {},
            subscribe(callback) {
                window.addEventListener('trackorder-search', callback);
                return () => {
                    window.removeEventListener('trackorder-search', callback);
                };
            },
            getOrder() {
                return order;
            },
            async getOrderTrackingInfo(order_id){
                console.log('Retrieving Order Info');
                console.log(GET_ORDER_INFO);

                const body = JSON.stringify({
                    query: GET_ORDER_INFO.loc.source.body,
                    variables: {
                        id: `gid://shopify/Order/${order_id}`
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
                        request_body: GET_ORDER_INFO.loc.source.body,
                    }
                }

                let jsonResponse = null;
                if (useAuthenticated){
                    jsonResponse = await shopifyHelper.authenticatedFetch(data);
                } else {
                    jsonResponse = await shopifyHelper.unauthenticatedFetch(body)
                }

                let shippingLineType = null;
                let trackingInfo = null;

                if (jsonResponse.data.order){

                    jsonResponse.data.order.shippingLines.edges.forEach(node => {
                        shippingLineType = node.node.title
                    });
                    jsonResponse.data.order.fulfillments.forEach(fulfillment => {
                        trackingInfo = {
                            company: fulfillment.trackingInfo[0].company,
                            url: fulfillment.trackingInfo[0].url,
                            number: fulfillment.trackingInfo[0].number,
                        }
                    });

                    order = {
                        name: jsonResponse.data.order.name,
                        delivery_type: shippingLineType,
                        tracking: trackingInfo
                    };

                } else {
                    order = null;
                }

                let clickEvent = new Event('trackorder-search');
                dispatchEvent(clickEvent);

                return jsonResponse
            },
            hash(){
                sig = ''
            }
        }
    }
}

export default trackorder;
