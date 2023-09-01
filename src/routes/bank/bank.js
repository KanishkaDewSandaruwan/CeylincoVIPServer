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
const { authorizeAccessControll, authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    // Create a new bank
    router.post('/create', authorizeAccessControll, createPaymentAccount);
    router.get('/all', authorizeAccessControll, getAllPaymentAccounts);
    router.get('/:account_id', authorizeAccessControll, getPaymentAccountById);
    router.get('/dealer/:dealerid', authorizeAccessControll, getPaymentAccountByDealerId);
    router.put('/update/:account_id', authorizeAccessControll, updatePaymentAccount);
    router.put('/update/single/:account_id/:field', authorizeAccessControll, updatePaymentAccountField);
    router.delete('/delete/:account_id', authorizeAccessControll, updateIsDeleteFlag);
    
    router.get('/dash/all', authenticateToken, getAllPaymentAccounts);
    router.get('/dash/:account_id', authenticateToken, getPaymentAccountById);
    router.get('/dash/dealer/:dealerid', authenticateToken, getPaymentAccountByDealerId);
    router.delete('/dash/delete/:account_id', authorizeAccessControll, updateIsDeleteFlag);

    return router;
};
