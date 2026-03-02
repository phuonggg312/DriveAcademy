import shopifyHelper from "../../shopify";

export default {
    name: 'recentlyviewed',
    component() {
        return {
            recentlyviewedproducts: Alpine.$persist([]).as('recentlyviewedproducts'),
            init() {
                },
            async store(product_id){
                const transformedProduct = await shopifyHelper.getShopifyProductList([product_id]);
                if (transformedProduct){

                    const isDuplicate = this.recentlyviewedproducts.some(product => parseInt(product.id) === parseInt(transformedProduct[0].id));

                    if (!isDuplicate) {
                        this.recentlyviewedproducts = this.recentlyviewedproducts.concat(transformedProduct);
                        console.log(this.recentlyviewedproducts);
                    } else {
                        console.log('Product with id ' + product_id + ' already exists.');
                    }

                }
            },
            get() {
                const products = JSON.parse(localStorage.getItem("recentlyviewedproducts"));

                if (products) {
                    if (products[0]?.id) {
                        products.map((product, index) => {
                            product.image = product?.featuredImage?.src;
                        });
                    } else {
                        return [];
                    }
                }

                return products;
            },
        }
    }
}
