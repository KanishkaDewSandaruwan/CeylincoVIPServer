const express = require('express');
const { login, getAll, getDealerById, addDealer, updateDealer, findDealer, changePassword, changeStatus, deleteDealer } = require('../../controllers/DealerController');
const { authenticateTokenDealer, authorizeValidateDealer } = require('../../middlewares/userAuth');

const { uploadDealer } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', uploadDealer.single('image'), addDealer);
    router.post('/login', login);

    router.get('/all', authenticateTokenDealer, getAll);
    router.get('/:dealer_id', authenticateTokenDealer, findDealer);
    router.put('/status/:dealer_id', authenticateTokenDealer, changeStatus);
    router.put('/delete/:dealer_id', authenticateTokenDealer, deleteDealer);

    router.get('/me/:dealer_id', authorizeValidateDealer, getDealerById);
    router.put('/update/:dealer_id', authorizeValidateDealer, updateDealer);

    router.put('/changePassword/:dealer_id', authorizeValidateDealer, changePassword);
    router.put('/changeEmail/:dealer_id', authorizeValidateDealer, updateDealer);
    router.put('/deleteme/:dealer_id', authorizeValidateDealer, deleteDealer);

    return router;
};
