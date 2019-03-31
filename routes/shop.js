const express = require('express');

const shopController = require('../controllers/shop');
const isauth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct );
router.get('/cart', isauth, shopController.getCart);
router.post('/cart', isauth, shopController.postCart);
router.post('/cart-delete-item', isauth, shopController.postCartDeleteProduct);
router.post('/cart-delete-all', isauth, shopController.postCartDeleteAllProducts); 
router.get('/orders', isauth, shopController.getOrders);
router.post('/create-order', isauth, shopController.postOrder);

module.exports = router;