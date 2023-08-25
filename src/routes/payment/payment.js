const express = require('express');
const { getPaymentById, updatePaymentStatus, deletePayment, getPayments, updatePaidAmount } = require('../../controllers/PaymentController');
const { authenticateToken, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    // Public APIs
    router.get('/:paymentid', authenticateToken, getPaymentById);

    // Authorized APIs for specific roles
    router.get('/all', authenticateToken, getPayments);
    router.put('/status/:paymentid', authenticateToken, updatePaymentStatus);
    router.delete('/delete/:paymentid', authorizeAccessControll, deletePayment);
    router.put('/updatePaidAmount/:paymentid', authenticateToken, updatePaidAmount);

    return router;
};
