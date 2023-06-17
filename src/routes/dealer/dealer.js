const express = require('express');
const { login, getAll, getDealerById, addDealer, updateDealer, findDealer, changePassword, changeStatus, deleteDealer } = require('../../controllers/DealerController');
const { authenticateTokenDealer } = require('../../middlewares/userAuth');

const { uploadDealer } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', uploadDealer.single('image'), addDealer);
    router.post('/login', login);

    router.get('/all', authenticateTokenDealer, getAll);
    router.get('/:userid', authenticateTokenDealer, findDealer);
    router.put('/status/:userid', authenticateTokenDealer, changeStatus);
    router.put('/delete/:userid', authenticateTokenDealer, deleteDealer);

    // router.get('/me/:userid', authorizeValidateUser, getDealerById);
    // router.put('/update/:userid', authorizeValidateUser, updateDealer);

    // router.put('/changePassword/:userid', authorizeValidateUser, changePassword);
    // router.put('/changeEmail/:userid', authorizeValidateUser, updateDealer);
    // router.put('/deleteme/:userid', authorizeValidateUser, deleteDealer);

    return router;
};
