const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {

        const dateSufix = Date.now() + Math.floor(Math.random() * 9);
        const extension = path.extname(file.originalname);

        cb(null, `${dateSufix}-${extension}`);
    },
});

const upload = multer({ storage });

module.exports = {upload};