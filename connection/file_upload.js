const multer = require('multer');
const path = require('path');

const policy = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'policy');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const policyupload = multer({ storage: policy })

module.exports = [
    policyupload
]