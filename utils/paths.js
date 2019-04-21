const path = require('path');

exports.publicPath = path.join(path.dirname(process.mainModule.filename), 'public');
exports.imagePath = path.join(path.dirname(process.mainModule.filename), 'images')