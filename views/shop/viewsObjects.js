module.exports = {
    orders: orders => ({
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
    }),
    cart: products => ({
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
    }),
    products: (products, path = '/') => ({
        path: path,
        pageTitle: 'All Products',
        products: products
    }),
    product: product => ({
        path: 'products',
        pageTitle: product.title ,
        product: product
    })
}