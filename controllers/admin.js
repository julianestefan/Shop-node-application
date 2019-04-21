"use strict";
const { validationResult } = require('express-validator/check');

const Product = require('../models/product');
const views = require('../views/admin/viewsObjects');
const { extractProductFromRequest } = require('../utils/helpers');
const {deleteFile} = require('../utils/helpers');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('admin/products', views.products(products));
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', views.addProduct());
};

exports.postAddProduct = async (req, res, next) => {
  const reqProduct = extractProductFromRequest(req);
  if (!req.file) return res.status(422).render('admin/edit-product', views.addProduct(reqProduct, false, true, 'Attached files is not an image'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('admin/add-product', views.addProduct(reqProduct, false, true, errors.array()[0].msg, errors.array()));
  const product = new Product({ ...reqProduct, userId: req.user });
  try {
    await product.save();
    console.log('Product Created');
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  if (!req.query.edit) return res.redirect('/');
  try {
    const product = await Product.findById(req.params.productId);
    console.log(product.title )
    if (!product) return res.redirect('/');
    res.render('admin/add-product', views.addProduct(product, true))
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('admin/add-product', views.addProduct(extractProductFromRequest(req), true, true, errors.array()[0].msg, errors.array()));
  try {
    const product = await Product.findById(req.body.productId);
    const oldeImage =product.imageUrl;
    await product.updateProductWithRequestData(req);
    deleteFile(oldeImage);
    console.log('Product updated');
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndRemove(req.body.productId);
    deleteFile(product.imageUrl);
    console.log('Product deleted');
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};


