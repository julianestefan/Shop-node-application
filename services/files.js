const multer = require('multer');

const FILE_TYPES = [
    'image/jpg',
    'image/jpeg',
    'image/png'
]

/**
* Set configuration to manage files  
* @param {String[]} filesTypes- The file types allowed to recieve by the app. 
* @param  {Object} app - An express app object. 
*/
module.exports = (app) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })

    const fileFilter = (req, file, cb) => {
        FILE_TYPES.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    };

    app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
}
