const express = require('express');
const {
    getPaymentById,
    updatePaymentStatus,
    deletePayment,
    getPayments,
    updatePayment,
    updatePaidAmount
} = require('../../controllers/PaymentController');
const { authenticateToken, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    // Public APIs

    // Authorized APIs for specific roles
    router.get('/all', authenticateToken, getPayments);
    router.get('/:paymentid', authenticateToken, getPaymentById);
    router.put('/update/:paymentid', authenticateToken, updatePayment);
    router.put('/status/:paymentid', authenticateToken, updatePaymentStatus);
    router.delete('/delete/:paymentid', authorizeAccessControll, deletePayment);
    router.put('/updatePaidAmount/:paymentid', authenticateToken, updatePaidAmount);

    return router;
};
