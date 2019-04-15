module.exports = {
    products: products => ({
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
    }),
    addProduct: (product = null, editing = false, hasError = false, errorMessage = null, validationErrors = []) => {
        const title = editing ? 'Edit Product' : 'Add Product';
        return {
            pageTitle: title,
            path: '/admin/add-product',
            product: product,
            editing: editing,
            hasError: hasError,
            errorMessage: errorMessage,
            validationErrors: validationErrors
        };
    }
}