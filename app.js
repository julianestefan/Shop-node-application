"use strict";
const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const connectDB = require('./services/db');
const setViewEngine = require('./services/views');
const setSession = require('./services/session');
const setRoutes = require('./routes/routes');
const setFilesManagment = require('./services/files');
const { publicPath, imagePath } = require('./utils/paths');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use( '/images', express.static(imagePath));
app.use(flash());
setViewEngine(app, 'ejs', 'views');
setFilesManagment(app);
setSession(app);
setRoutes(app);

connectDB(() => app.listen(process.env.PORT));


