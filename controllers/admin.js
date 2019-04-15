const { validationResult } = require('express-validator/check');

const Product = require('../models/product');
const views = require('../views/admin/viewsObjects');
const {extractProductFromRequest} = require('../utils/helpers');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', views.products(products));
    })
    .catch(err => console.log(err));
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', views.addProduct());
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  const reqProduct = extractProductFromRequest(req);
  if (!errors.isEmpty()) return res.status(422).render('admin/add-product', views.addProduct(reqProduct, false, true, errors.array()[0].msg, errors.array()));

  const product = new Product({ ...reqProduct, userId: req.user });
  product.save()
    .then(result => {
      console.log('Product Created');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  if (!req.query.edit) return res.redirect('/');

  Product.findById(req.params.productId)
    .then(product => {
      if (!product) return res.redirect('/');
      res.render('admin/add-product', views.addProduct(product, true))
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(422).render('admin/add-product', views.addProduct( extractProductFromRequest(req), true, true,errors.array()[0].msg, errors.array()));
  
  Product.findById(req.body.productId)
    .then(product => {
      return product.updateProductWithRequestData(req);
    })
    .then(result => {
      console.log('Product updated');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findByIdAndRemove(req.body.productId)
    .then(() => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};


