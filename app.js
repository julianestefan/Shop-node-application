"use strict";
const express = require('express');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const setViewEngine = require('./views/views');
const setSession = require('./config/session');
const setRoutes = require('./routes/routes');
const setFilesManagment = require('./config/files');
const { publicPath, imagePath } = require('./utils/paths');
const multer = require('multer');



const app = express();

setViewEngine(app, 'ejs', 'views');
setFilesManagment(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.use( 'images' ,express.static(imagePath));
setSession(app);
app.use(flash());
setRoutes(app);

connectDB(() => app.listen(process.env.PORT));


