"use strict";

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const configureSession = require('./config/session');
const configureRoutes = require('./routes/routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
configureSession(app);
configureRoutes(app);

connectDB(() => { app.listen(3000); })


