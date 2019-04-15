const router = require('express').Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const validation = require('../config/validation/adminValidation');

router.get('/products', isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, validation.product,  adminController.postAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, validation.product, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct); 

module.exports = router;
