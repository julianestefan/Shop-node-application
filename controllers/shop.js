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