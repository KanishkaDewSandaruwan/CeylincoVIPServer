const express = require('express');
const path = require('path');

const userRoute = require('./user/user');
const policyRoute = require('./policy/policy');
const dealerRoute = require('./dealer/dealer');
const companyRoute = require('./company/company');
const paymentRoute = require('./payment/payment');
const getUserrole = require('./statistics/statistics');
const getBank = require('./bank/bank');

module.exports = (config) => {
  const router = express.Router();

  router.use('/user', userRoute(config));
  router.use('/policy', policyRoute(config));
  router.use('/dealer', dealerRoute(config));
  router.use('/company', companyRoute(config));
  router.use('/payment', paymentRoute(config));
  router.use('/statistics', getUserrole(config));
  router.use('/bank', getBank(config));

  return router;
};

