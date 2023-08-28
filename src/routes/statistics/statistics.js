const express = require('express');

const {
    getPolicyStatistics,
    getPolicyCart
} = require('../../controllers/PolicyContoller');
const {
    getPaymentCounts,
    getAllPaymentSums
} = require('../../controllers/PaymentController');

const {
    getDealerCount
} = require('../../controllers/DealerController');
const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.get('/payment/count', authenticateToken, getPaymentCounts);
    router.get('/payment/sum', authenticateToken, getAllPaymentSums);

    router.get('/policy/count', authenticateToken, getPolicyStatistics);
    router.get('/policy/chart', authenticateToken, getPolicyCart);
    router.get('/dealer/count', authenticateToken, getDealerCount);

    return router;
};
