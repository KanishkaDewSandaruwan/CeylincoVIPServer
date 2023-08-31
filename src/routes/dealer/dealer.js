const express = require('express');
const {
    login,
    getAll,
    getDealerById,
    validateDealer,
    deleteDealers,
    sendMailToUsers,
    addDealer,
    updateDealer,
    findDealer,
    changePassword,
    changeEmail,
    validate,
    changeStatus,
    deleteDealer,
    getCommisionByID,
    forgetPassword,
    restPassword,
    newPassword,
    updateDealerProfile,
    addaccount,
    //account
    addaccount,
    updateDealerProfile,
    updateaccount,
    getAllAccounts,
    getAccountById
} = require('../../controllers/DealerController');

const {
    authenticateTokenDealer,
    authorizeValidateDealer,
    authenticateToken,
    authorizeAccessControll,
} = require('../../middlewares/userAuth');

const { uploadDealer } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    router.get('/commision/:dealer_id', authenticateTokenDealer, getCommisionByID);

    // Public routes
    router.post('/create', addDealer);
    router.post('/mail', sendMailToUsers);
    router.post('/forget-password', forgetPassword);
    router.post('/login', login);
    router.get('/validate/:field/:value', validate);
    router.post('/check-otp', restPassword);
    router.post('/new-password', newPassword);

    // Private routes (require authentication)
    router.get('/all', authenticateTokenDealer, getAll);
    router.get('/:dealer_id', authenticateTokenDealer, getDealerById);
    
    router.get('/verify/:token', validateDealer);
    
    router.get('/dash/all', authenticateToken, getAll);
    router.get('/dash/:dealer_id', authorizeAccessControll, getDealerById);
    router.put('/dash/status/:dealer_id', authorizeAccessControll, changeStatus);
    router.put('/dash/delete/:dealer_id', authorizeAccessControll, deleteDealer);
    router.put('/dash/update/:dealer_id', authorizeAccessControll, updateDealer);
    router.put('/dash/deletes', authorizeAccessControll, deleteDealers);

    // Authorized and validated routes
    router.get('/me/:dealer_id', authorizeValidateDealer, getDealerById);
    router.put('/me/update/:dealer_id', authorizeValidateDealer, updateDealerProfile);
    router.put('/me/changePassword/:dealer_id', authorizeValidateDealer, changePassword);
    router.put('/me/changeEmail/:dealer_id', authorizeValidateDealer, changeEmail);
    router.put('/me/delete/:dealer_id', authorizeValidateDealer, deleteDealer);

    router.post('/me/account/create/:dealer_id', authorizeValidateDealer, addaccount);
    router.put('/me/account/update/:account_id', authorizeValidateDealer, updateaccount);
    router.get('/me/account/:account_id', authorizeValidateDealer, getAccountById);
    router.get('/me/account/all', authorizeValidateDealer, getAllAccounts);

    return router;
};
