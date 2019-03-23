const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.id)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    Product.findById(req.body.productId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        res.redirect('/cart');
      });
  };

  exports.postCartDeleteProduct = (req, res, next) => {
    req.user
      .removeOneFromCart(req.body.productId)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };

  exports.postCartDeleteAllProducts = (req, res, next) => {
    req.user
      .removeAllFromCart(req.body.productId)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };

  

