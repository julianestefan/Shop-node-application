const router = require('express').Router();

const shopController = require('../controllers/shop');
const isauth = require('../middleware/isAuth');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:id', shopController.getProduct );
router.get('/cart', isauth, shopController.getCart);
router.post('/cart', isauth, shopController.postCart);
router.post('/cart-delete-item', isauth, shopController.postCartDeleteProduct);
router.post('/cart-delete-all', isauth, shopController.postCartDeleteAllProducts); 
router.get('/orders', isauth, shopController.getOrders);
router.get('/orders/:orderId', isauth, shopController.getInvoice);
router.post('/create-order', isauth, shopController.postOrder);

module.exports = router;