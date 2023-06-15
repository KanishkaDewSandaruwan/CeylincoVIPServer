const multer = require('multer');
const path = require('path');

const policyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/policy');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadPolicyFiles = multer({ storage: policyStorage });

module.exports = { uploadPolicyFiles };
