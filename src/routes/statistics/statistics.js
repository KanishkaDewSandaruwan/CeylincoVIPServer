const express = require('express');

const { 
    getPolicyCount,
    getPolicyCountToday,
    getPolicyCountThisMonth,
    getPolicyCountThisYear,
    getPolicyCart
 } = require('../../controllers/PolicyContoller');
const {
    getPaymentCountThisYear,
    getPaymentCountThisMonth,
    getPaymentCountToday,
    getPaymentCount } = require('../../controllers/PaymentController');

const { 
    getDealerCount
 } = require('../../controllers/DealerController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.get('/payment/count', authenticateToken, getPaymentCount);
    router.get('/payment/today', authenticateToken, getPaymentCountToday);
    router.get('/payment/month', authenticateToken, getPaymentCountThisMonth);
    router.get('/payment/year', authenticateToken, getPaymentCountThisYear);

    router.get('/policy/count', authenticateToken, getPolicyCount);
    router.get('/policy/today', authenticateToken, getPolicyCountToday);
    router.get('/policy/month', authenticateToken, getPolicyCountThisMonth);
    router.get('/policy/year', authenticateToken, getPolicyCountThisYear);
    router.get('/policy/chart', authenticateToken, getPolicyCart);

    router.get('/dealer/count', authenticateToken, getDealerCount);

    return router;
};
