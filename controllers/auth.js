const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const mailTransporter = require('../config/mail');
const emailMessages = require('../util/emails');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/signup');
      }
      return bcrypt.hash(req.body.password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          console.log("User created");
          res.redirect('/login');
          return mailTransporter.sendMail(emailMessages.createdUser(email));
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  message = message.length > 0 ? message[0] : null;

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash('error', 'Server error, Try it again');
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        mailTransporter.sendMail(emailMessages.newPasswordRequest(email, token));
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        req.flash('error', 'An error has occurred, Please ask for a new link')
        res.redirect('/reset');
      }
      let message = req.flash('error');
      message = message.length > 0 ? message[0] : null;

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetToken: req.body.passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: req.body.userId
    });
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.log(err);
  }
};