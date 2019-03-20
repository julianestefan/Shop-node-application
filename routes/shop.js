const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct );
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
/* 
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post('/cart-delete-all', shopController.postCartDeleteAllProducts);
 */

module.exports = router;