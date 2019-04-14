"use strict";

const shopRoutes = require('./shop');
const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const errorController = require('../controllers/error');

const configureRoutes = (app) => {
    app.use('/admin', adminRoutes);
    app.use(shopRoutes);
    app.use(authRoutes);
    app.use(errorController.get404);
}

module.exports= configureRoutes;