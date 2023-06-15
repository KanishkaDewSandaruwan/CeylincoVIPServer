const express = require('express');
const userRoute = require('./user/user');
const policyRoute = require('./policy/policy');

module.exports = (config) => {
  const router = express.Router();

  router.use('/user', userRoute(config));
  router.use('/policy', policyRoute(config));

  return router;
};

