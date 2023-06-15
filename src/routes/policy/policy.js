const express = require('express');
const { getAllPolicy, findPolicy, addPolicy, changePolicyStatus, deletePolicy } = require('../../controllers/PolicyContoller');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', addPolicy);
  router.get('/all', getAllPolicy);
  router.get('/:policy_id', authenticateToken, findPolicy);
  router.put('/status/:policy_id', authenticateToken, changePolicyStatus);
  router.put('/delete/:policy_id', authenticateToken, deletePolicy);

  return router;
};
