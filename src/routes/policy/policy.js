const express = require('express');
const { getAllPolicy, findPolicy, addPolicy, updatePolicyPayment, changePolicyStatus, deletePolicy, uploadFiles, getFiles, updatePrice } = require('../../controllers/PolicyContoller');
const { authenticateToken } = require('../../middlewares/userAuth');

const { uploadPolicyFiles } = require('../../../config/fileUpload');

module.exports = (config) => {
  const router = express.Router();

  router.post('/createpayment', updatePolicyPayment);

  router.post('/create', addPolicy);
  router.get('/all', getAllPolicy);
  router.get('/latest/:policy_id', findPolicy);
  router.put('/price/:policy_id', updatePrice);
  router.get('/getfiles/:fields/:policy_id', getFiles);
  router.put('/upload/:field/:policy_id', uploadPolicyFiles.single('image'), uploadFiles);
  router.use('/files', express.static('src/uploads/policy/'));

  router.get('/dash/all', authenticateToken, getAllPolicy);
  
  router.put('/appstatus/:policy_id', changePolicyStatus);

  router.get('/:policy_id', authenticateToken, findPolicy);
  router.put('/status/:policy_id', authenticateToken, changePolicyStatus);
  router.put('/delete/:policy_id', authenticateToken, deletePolicy);

  return router;
};
