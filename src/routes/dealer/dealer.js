const express = require('express');
const { login, getAll, getDealerById, sendMailToUsers, addDealer, updateDealer, findDealer, changePassword, changeEmail, validate, changeStatus, deleteDealer } = require('../../controllers/DealerController');
const { authenticateTokenDealer, authorizeValidateDealer, authorizeAccessControll } = require('../../middlewares/userAuth');

const { uploadDealer } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', addDealer);
    router.post('/mail', sendMailToUsers);
    router.post('/login', login);
    router.get('/validate/:field/:value', validate);

    router.get('/all', authenticateTokenDealer, getAll);
    router.get('/:dealer_id', authenticateTokenDealer, findDealer);
    
    
    router.get('/dash/all', authorizeAccessControll, getAll);
    router.put('/dash/status/:dealer_id', authorizeAccessControll, changeStatus);
    router.put('/dash/delete/:dealer_id', authorizeAccessControll, deleteDealer);
    router.put('/dash/update/:dealer_id', authorizeAccessControll, updateDealer);

    //this api can change only for them. 
    router.get('/me/:dealer_id', authorizeValidateDealer, getDealerById);
    router.put('/me/update/:dealer_id', authorizeValidateDealer, updateDealer);
    router.put('/me/changePassword/:dealer_id', authorizeValidateDealer, changePassword);
    router.put('/me/changeEmail/:dealer_id', authorizeValidateDealer, changeEmail);
    router.put('/me/delete/:dealer_id', authorizeValidateDealer, deleteDealer);

    return router;
};
