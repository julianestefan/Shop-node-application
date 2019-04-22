const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  },
  resetToken: String,
  resetTokenExpiration: Date
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }

  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.removeOneFromCart = function (productId) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === productId.toString());
  if (cartProductIndex === -1) return;

  const newQuantity = this.cart.items[cartProductIndex].quantity - 1;
  let updatedCartItems = null;
  if (newQuantity) {
    updatedCartItems = [...this.cart.items];
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems = [...this.cart.items.filter(item => item.productId.toString() !== productId.toString())];
  }

  this.cart = { items: updatedCartItems };
  return this.save();
}

userSchema.methods.removeAllFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearDeletedItemsfromCart = async function() {
  try{
    await this.populate('cart.items.productId').execPopulate();
    this.cart = { items: this.cart.items.filter(item => item.productId !== null) };
    return this.save();
  }catch(err){
    const error = new Error(err);
    error.httpStatusCode = 500;
    throw error;
  }
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.resetPassword = function(newPassword) {
  this.password = newPassword;
  this.resetToken = null;
  this.resetTokenExpiration = null;
  return this.save();
}

userSchema.methods.setResetToken = function(token) {
  this.resetToken = token;
  this.resetTokenExpiration = Date.now() + 3600000;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);