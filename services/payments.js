const stripe = require('stripe')(process.env.STRIPE_APIKEY);

module.exports = (token, order, products) => {
    let totalSum = 0;
    products.forEach(p => {
        totalSum += p.quantity * p.productId.price;
    });

    return stripe.charges.create({
        amount: totalSum * 100,
        currency: 'usd',
        description: 'Demo Order',
        source: token,
        metadata: { order_id: order._id.toString() }
    });
}