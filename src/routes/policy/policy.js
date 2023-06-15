const express = require('express');
const { getAllPolicy, findPolicy, addPolicy, changePolicyStatus, deletePolicy, uploadFiles, getFiles, updateEmail } = require('../../controllers/PolicyContoller');
const { authenticateToken } = require('../../middlewares/userAuth');

const { uploadPolicyFiles } = require('../../../config/fileUpload');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', addPolicy);
  router.get('/all', getAllPolicy);
  router.get('/latest/:policy_id', findPolicy);
  router.put('/email/:policy_id', updateEmail);
  router.get('/getfiles/:fields/:policy_id', getFiles);
  router.put('/upload/:field/:policy_id', uploadPolicyFiles.single('image'), uploadFiles);
  router.use('/files', express.static('src/uploads/policy/'));

  router.get('/:policy_id', authenticateToken, findPolicy);
  router.put('/status/:policy_id', authenticateToken, changePolicyStatus);
  router.put('/delete/:policy_id', authenticateToken, deletePolicy);

  return router;
};
