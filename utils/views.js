exports.shopViews = {
    checkout: products => {
        let total = 0;
        products.forEach(p => {
            total += p.quantity * p.productId.price;
        });
        return {
            path: '/checkout',
            pageTitle: 'Checkout',
            products: products,
            totalSum: total
        };
    },
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

exports.authViews = {
    login: (message, email = '', password = '', validationErrors = []) => ({
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        input: {
            email: email,
            password: password
        },
        validationErrors: validationErrors
    }),
    signUp: (message, email = '', password = '', confirmPassword = '', validationErrors = []) => ({
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        input: {
            email: email,
            password: password,
            confirmPassword: confirmPassword
        },
        validationErrors: validationErrors
    }),
    resetPassword: message => ({
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    }),
    newPassword: (message, user, token) => ({
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
    })
}

exports.adminViews = {
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