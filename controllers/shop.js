"use strict";
const Product = require('../models/product');
const Order = require('../models/order');
const views = require('../views/shop/viewsObjects');

exports.getIndex = async (req, res, next) => {
    try{
        const products = await Product.find();
        res.render('shop/product-list', views.products(products));
    }catch (error) {
        console.log(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try{
        const products = await Product.find();
        res.render('shop/product-list', views.products(products, '/products'));
    }catch (error) {
        console.log(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try{
        const product = await Product.findById(req.params.id);
        res.render('shop/product-detail', views.product(product) );
    }catch(error){
        console.log(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        const products = await user.cart.items;
        res.render('shop/cart', views.cart(products));
    } catch (error) {
        console.log(error);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.productId);
        await req.user.addToCart(product);
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    try {
        await req.user.removeOneFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

exports.postCartDeleteAllProducts = async (req, res, next) => {
    try {
        await req.user.removeAllFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (error) {
        console.log(error);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        const products = user.cart.items.map(i => ({
            quantity: i.quantity,
            product: { ...i.productId._doc }
        }));
        const order = new Order({ user: { email: req.user.email, userId: req.user }, products: products });
        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (error) {
        console.log(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id })
        res.render('shop/orders', views.orders(orders));
    } catch (error) {
        console.log(error)
    }
};


