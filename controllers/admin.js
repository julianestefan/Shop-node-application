const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(null, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/');

  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) return res.redirect('/');

    res.render('admin/add-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = new Product(req.body.productId, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postEditProduct = (req, res, next) => {
  const updatedProduct = new Product(req.body.productId, req.body.title, req.body.imageUrl, req.body.description, req.body.price);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};