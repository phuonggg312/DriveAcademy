
export default {
    name: 'rebuy',
    component() {
        return {

            init() {

            },
            rebuyOrder(products){
                console.log('Rebuying order');
                console.log(products);

                document.getElementById('reorder-button').setAttribute('disabled', 'disabled');

                // Function to add products to the cart
                function addProductsToCart(products, index = 0) {
                    if (index < products.length) {
                        fetch('/cart/add.js', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: JSON.stringify({items: [{
                                id: products[index].id,
                                quantity: products[index].quantity
                            }]})
                        })
                            .then(response => response.json())
                            .then(data => {
                                // Add the next product in the array
                                addProductsToCart(products, index + 1);
                            })
                            .catch(error => {
                                document.getElementById('reorder-button').removeAttribute('disabled');
                                console.error('Error adding product to cart:', error);
                            });
                    } else {
                        // After all products are added, redirect to the cart page
                        window.location.href = '/cart';
                        document.getElementById('reorder-button').removeAttribute('disabled');
                    }
                }

                // Start adding products
                addProductsToCart(products);
            }
        }
    }
}
