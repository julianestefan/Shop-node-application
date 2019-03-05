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
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let updatedCart = { products: [], totalPrice: 0 };
      if (!err) {
        updatedCart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = updatedCart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = updatedCart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updateProduct(updatedCart, existingProduct, existingProductIndex ,prod => prod.qty = prod.qty + 1)
      } else {
        updatedProduct = { id: id, qty: 1 };
        updatedCart.products = [...updatedCart.products, updatedProduct];
      }
      updatedCart.totalPrice = updatedCart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }


  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) return;
      
      const updatedCart = { ...JSON.parse(fileContent) };

      const existingProductIndex = updatedCart.products.findIndex(prod => prod.id === id);
      const existingProduct = updatedCart.products[existingProductIndex];

      if (!existingProduct) return;

      let productQty = existingProduct.qty;

      if (productQty > 1 ){
        updateProduct(updatedCart, existingProduct, existingProductIndex, prod => prod.qty = prod.qty -1)
      } else {
        updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      }
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static deleteAllProducts(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find(prod => prod.id === id);
      if (!product) return;
      const productQty = product.qty;
      
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

};
