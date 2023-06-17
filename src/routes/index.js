const express = require('express');
const path = require('path');

const userRoute = require('./user/user');
const policyRoute = require('./policy/policy');
const dealerRoute = require('./dealer/dealer');

module.exports = (config) => {
  const router = express.Router();

  router.use('/user', userRoute(config));
  router.use('/policy', policyRoute(config));
  router.use('/dealer', dealerRoute(config));

  return router;
};

