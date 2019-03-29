"use strict";

const express = require('express');

const connectDB = require('./config/db');
const configureSession = require('./config/session');
const configureRoutes = require('./routes/routes');
const publicPath = require('./util/paths').publicPath;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(publicPath));
configureSession(app);
configureRoutes(app);

connectDB(() => app.listen(3000));


