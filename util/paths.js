const path = require('path');

exports.instancePath = path.join(path.dirname(process.mainModule.filename), 'config', 'instance.json');
exports.publicPath = path.join(path.dirname(process.mainModule.filename), 'public');