const express = require('express');
const {
    getPaymentById,
    updatePaymentStatus,
    deletePayment,
    getPayments,
    updatePayment,
    updatePaidAmount,
    updatedeletePayment,
    getPaymentsCompleted,
    getPaymentsPending
} = require('../../controllers/PaymentController');
const { authenticateToken, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    // Public APIs

    // Authorized APIs for specific roles
    router.get('/all', authenticateToken, getPayments);
    router.get('/all/completed', authenticateToken, getPaymentsCompleted);
    router.get('/all/pending', authenticateToken, getPaymentsPending);
    router.get('/:paymentid', authenticateToken, getPaymentById);
    router.put('/update/:paymentid', authenticateToken, updatePayment);
    router.put('/status/:paymentid', authenticateToken, updatePaymentStatus);
    router.delete('/delete/:paymentid', authorizeAccessControll, updatedeletePayment);
    router.put('/updatePaidAmount/:paymentid', authenticateToken, updatePaidAmount);

    return router;
};
