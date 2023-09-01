const express = require('express');
const { 
    getAllPaymentAccounts,
    createPaymentAccount,
    updatePaymentAccount,
    getPaymentAccountByDealerId,
    deletePaymentAccount,
    updateIsDeleteFlag,
    updatePaymentAccountField,
    getPaymentAccountById
 } = require('../../controllers/BankController');
const { authorizeValidateDealer, authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    // Create a new bank
    router.post('/create', authorizeValidateDealer, createPaymentAccount);
    router.get('/all', authorizeValidateDealer, getAllPaymentAccounts);
    router.get('/:account_id', authorizeValidateDealer, getPaymentAccountById);
    router.get('/dealer/:dealerid', authorizeValidateDealer, getPaymentAccountByDealerId);
    router.put('/update/:account_id', authorizeValidateDealer, updatePaymentAccount);
    router.put('/update/single/:account_id/:field', authorizeValidateDealer, updatePaymentAccountField);
    router.delete('/delete/:account_id', authorizeValidateDealer, updateIsDeleteFlag);
    
    router.get('/dash/all', authenticateToken, getAllPaymentAccounts);
    router.get('/dash/:account_id', authenticateToken, getPaymentAccountById);
    router.get('/dash/dealer/:dealerid', authenticateToken, getPaymentAccountByDealerId);
    router.delete('/dash/delete/:account_id', authenticateToken, updateIsDeleteFlag);

    return router;
};
