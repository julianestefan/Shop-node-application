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
    const productId = req.params.id;
    Product.findById(productId, prod =>{
        if (prod){
            res.render('shop/product-detail', {
                product:  prod,
                pageTitle: prod.title,
                path: '/products'
            });
        } else {
            res.redirect('/invalid');
        }
        
    })
}
