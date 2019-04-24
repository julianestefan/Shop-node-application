"use strict";
const Product = require('../models/product');
const Order = require('../models/order');
const views = require('../views/shop/viewsObjects');
const invoicePdf = require('../utils/pdf');
const pagination = require('../utils/pagination');
const stripe = require('stripe')(process.env.STRIPE_APIKEY);

exports.getIndex = async (req, res, next) => {
    const page = +req.query.page || 1;
    try {
        const paginationData = await pagination(page, Product);
        res.render('shop/product-list', views.products(paginationData, page));
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    const page = +req.query.page || 1;
    try {
        const paginationData = await pagination(page, Product);
        res.render('shop/product-list', views.products(paginationData, page, '/products'));
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('shop/product-detail', views.product(product));
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await req.user.clearDeletedItemsfromCart();
        res.render('shop/cart', views.cart(user.cart.items));
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const product = await Product.findById(req.body.productId);
        await req.user.addToCart(product);
        res.redirect('/cart');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCartDeleteProduct = async (req, res, next) => {
    try {
        await req.user.removeOneFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.postCartDeleteAllProducts = async (req, res, next) => {
    try {
        await req.user.removeAllFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getCheckout = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        res.render('shop/checkout', views.checkout(user.cart.items));
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};


exports.postOrder = async (req, res, next) => {
    let totalSum = 0;
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        user.cart.items.forEach(p => {
            totalSum += p.quantity * p.productId.price;
            console.log(p.productId.price);
            console.log(p.quantity);
            console.log(totalSum);
        });
        const products = user.cart.items.map(i => ({
            quantity: i.quantity,
            product: { ...i.productId._doc }
        }));
        const order = new Order({ user: { email: req.user.email, userId: req.user }, products: products });
        const result = await order.save();;
        await stripe.charges.create({
            amount: totalSum * 100,
            currency: 'usd',
            description: 'Demo Order',
            source: req.body.stripeToken,
            metadata: { order_id: result._id.toString() }
        });
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id })
        res.render('shop/orders', views.orders(orders));
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return next(new Error('No order found.'));
        if (order.user.userId.toString() !== req.user._id.toString()) return next(new Error('Unauthorized'));
        await invoicePdf(res, order);
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
};


