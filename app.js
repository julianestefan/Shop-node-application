"use strict";
const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const setViewEngine = require('./views/views');
const setSession = require('./config/session');
const setRoutes = require('./routes/routes');
const publicPath = require('./util/paths').publicPath;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use(flash());
setViewEngine(app, 'ejs', 'views');
setSession(app);
setRoutes(app);

connectDB(() => app.listen(3000));


