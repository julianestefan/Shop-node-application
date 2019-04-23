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
    products: (paginationData, page, path = '/') => {
        const [products, totalItems, ITEMS_PER_PAGE] = paginationData;
        return {
            path: path,
            pageTitle: 'All Products',
            products: products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        }
    },
    product: product => ({
        path: 'products',
        pageTitle: product.title,
        product: product
    })
}