const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/policy',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize file upload
const policyupload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

const crImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/file');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadCRImage = multer({ storage: crImageStorage });

function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only images and PDFs are allowed!');
  }
}

module.exports = { policyupload, uploadCRImage };
