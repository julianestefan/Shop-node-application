const router = require('express').Router();

const adminController = require('../controllers/admin');
const {isAuth} = require('../utils/middleware');
const {adminRules}  = require('../services/validation');

router.get('/products', isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminRules.product,  adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminRules.product, adminController.postEditProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
