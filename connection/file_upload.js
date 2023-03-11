const multer = require('multer');
const path = require('path');

const policy_upload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/policy');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const policyupload = multer({
    storage: policy_upload,
    // Only allow images and PDFs
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images and PDFs are allowed!');
        }
    }
});

module.exports = policyupload;
