"use strict";

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

/* const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin'); */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/* app.use('/admin' , adminRoutes);
app.use(shopRoutes); */

app.use(errorController.get404);

connectDB( () => {
  app.listen(3000);
})
