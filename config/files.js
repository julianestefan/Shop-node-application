const multer = require('multer');

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
    /*     const fileFilter = (req, file, cb) => {
            filesTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
        }; */

    const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
}
