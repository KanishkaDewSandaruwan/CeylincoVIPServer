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

const dealerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/dealer');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadPolicyFiles = multer({ storage: policyStorage });
const uploadDealer = multer({ storage: dealerStorage });

module.exports = { uploadPolicyFiles, uploadDealer };
