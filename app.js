"use strict";
const express = require('express');

const flash = require('connect-flash');

const connectDB = require('./config/db');
const setViewEngine = require('./views/views');
const setSession = require('./config/session');
const setRoutes = require('./routes/routes');
const publicPath = require('./util/paths').publicPath;

const app = express();

app.use(express.static(publicPath));
setViewEngine(app, 'ejs', 'views');
setSession(app);
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
setRoutes(app);

connectDB(() => app.listen(3000));


