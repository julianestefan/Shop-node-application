const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

productSchema.methods.updateProductWithRequestData = function (req) {
  this.title = req.body.title;
  this.price = req.body.price;
  this.description = req.body.description;
  if(req.file) this.imageUrl = req.file.path;
  return this.save();
}

module.exports = mongoose.model('Product', productSchema);
