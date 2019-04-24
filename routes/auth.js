const router = require('express').Router();

const authController = require('../controllers/auth');
const {authRules} = require('../services/validation');

router.get('/login', authController.getLogin);
router.post('/login', authRules.login ,authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', authRules.signUp, authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;