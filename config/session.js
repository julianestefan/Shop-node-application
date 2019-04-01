"use strict";
const fs = require('fs');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

const User = require('../models/user');
const instancePath = require('../util/paths').instancePath;

const configureSessions = (app) => {
  const instance = JSON.parse(fs.readFileSync(instancePath));
  const uri = "mongodb+srv://" + instance.mongodb.user + ":" + instance.mongodb.password + "@" + instance.mongodb.host + "?retryWrites=true";

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

