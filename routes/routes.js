"use strict";
const shopRoutes = require('./shop');
const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const errorController = require('../controllers/error');
const {isAuth} = require('../utils/middleware');
const shopController = require('../controllers/shop');

const configureRoutes = (app) => {
    app.post('/create-order', isAuth, shopController.postOrder);
    require('../services/csrf')(app);
    app.use('/admin', adminRoutes);
    app.use(shopRoutes);
    app.use(authRoutes);
    app.use(errorController.get500);
    app.use(errorController.get404);
}

module.exports = configureRoutes;