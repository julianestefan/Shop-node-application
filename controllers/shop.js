const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            products: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (product) {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        }
    });
};