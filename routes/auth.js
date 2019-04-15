const router = require('express').Router();

const authController = require('../controllers/auth');
const validation = require('../config/validation/authValidation');

router.get('/login', authController.getLogin);
router.post('/login', validation.login ,authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', validation.signUp, authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;