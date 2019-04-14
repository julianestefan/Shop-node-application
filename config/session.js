"use strict";
const session = require('express-session');
const csrf = require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('../models/user');

const configureSessions = (app) => {
  const uri = "mongodb+srv://" + process.env.MONGO_USER + ":" + process.env.MONGO_PASSWORD + "@" + process.env.MONGO_HOST + "?retryWrites=true";

  const store = new MongoDBStore({ uri: uri, collection: 'sessions' });
  const csrfProtection = csrf();

  app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  }));
  app.use(csrfProtection);

  app.use((req, res, next) => {
    if (!req.session.user) return next();

    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });
}

module.exports = configureSessions;

