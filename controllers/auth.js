const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const mailTransporter = require('../config/mail');
const emailMessages = require('../utils/emails');
const views = require('../views/auth/viejsObject');

exports.getLogin = (req, res, next) => {
  const message = req.flash('error').length > 0 ? req.flash('error')[0] : null;
  res.render('auth/login', views.login(message));
};

exports.getSignup = (req, res, next) => {
  const message = req.flash('error').length > 0 ? req.flash('error')[0] : null;
  res.render('auth/signup', views.signUp(message));
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('auth/login', views.login(errors.array()[0].msg, email, password, errors.array()))

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(422).render('auth/login', views.login('Invalid email', email, password))
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(error => {
        if (error) return res.status(500).render('auth/login', views.login(error.toString(), email, password));
        res.redirect('/');
      });
    }
    res.status(422).render('auth/login', views.login('Invalid password', email, password));
  } catch (error) {
    console.log(error)
  }

};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).render('auth/signup', views.signUp(errors.array()[0].msg, email, password, req.body.confirmPassword, errors.array()))

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] }
    });
    await user.save();
    res.redirect('/login');
    await mailTransporter.sendMail(emailMessages.successfullSignUp(email));
    console.log('Mail sended')
  } catch (error) {
    console.log(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  const message = req.flash('error').length > 0 ? req.flash('error')[0] : null;
  res.render('auth/reset', views.resetPassword(message));
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      req.flash('error', 'Server error, Try it again');
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash('error', 'No account with that email found.');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      await mailTransporter.sendMail(emailMessages.newPasswordRequest(req.body.email, token));
      console.log('Mail sended')
    } catch (error) {
      console.log(error);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      req.flash('error', 'An error has occurred, Please ask for a new link')
      res.redirect('/reset');
    }
    const message = req.flash('error').length > 0 ? req.flash('error')[0] : null;
    res.render('auth/new-password', views.newPassword(message, user, token));
  } catch (error) {
    console.log(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetToken: req.body.passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: req.body.userId
    });
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await user.resetPassword(hashedPassword);
    res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
};