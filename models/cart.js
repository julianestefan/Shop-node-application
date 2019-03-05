const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

const updateProduct = (cart, product, index, callback) => {
  let updatedProduct = { ...product };
  callback(updatedProduct);
  cart.products = [...cart.products];
  cart.products[index] = updatedProduct;
}

module.exports = class Cart {

  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // Fetching the previous cart
      let updatedCart = { products: [], totalPrice: 0 };
      if (!err) updatedCart = JSON.parse(fileContent);

      // Analyzing the cart => Finding existing product
      const existingProductIndex = updatedCart.products.findIndex(prod => prod.id === id);
      const existingProduct = updatedCart.products[existingProductIndex];

      // Add new product/ increase quantity
      if (existingProduct) {
        updateProduct(updatedCart, existingProduct, existingProductIndex, prod => prod.qty = prod.qty + 1)
      } else {
        const updatedProduct = { id: id, qty: 1 };
        updatedCart.products = [...updatedCart.products, updatedProduct];
      }
      updatedCart.totalPrice = updatedCart.totalPrice + +productPrice;

      // Writing updated cart in the file
      fs.writeFile(p, JSON.stringify(updatedCart), err => { console.log(err) });
    });
  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      err ? callback(null) : callback(cart);
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // Fetching the previous cart
      if (err) return;
      const updatedCart = { ...JSON.parse(fileContent) };

      // Analyzing the cart => Finding existing product
      const existingProductIndex = updatedCart.products.findIndex(prod => prod.id === id);
      const existingProduct = updatedCart.products[existingProductIndex];
      if (!existingProduct) return;

      // Removing the product or decrease quantity depending of previous quantity
      const productQty = existingProduct.qty;
      if (productQty > 1) {
        updateProduct(updatedCart, existingProduct, existingProductIndex, prod => prod.qty = prod.qty - 1)
      } else {
        updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      }
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice;

      // Writing updated cart in the file
      fs.writeFile(p, JSON.stringify(updatedCart), err => { console.log(err) });
    });
  }

  static deleteAllProducts(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      // Fetching the previous cart
      if (err) return;
      const updatedCart = { ...JSON.parse(fileContent) };

      // Analyzing the cart => Finding existing product
      const product = updatedCart.products.find(prod => prod.id === id);
      if (!product) return;

      // Removing every product and updating total price depending of previous quantity
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      // Writing updated cart in the file
      fs.writeFile(p, JSON.stringify(updatedCart), err => { console.log(err); });
    });
  }

};
