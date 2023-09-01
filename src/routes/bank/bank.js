const express = require('express');
const { getAllBanks, findBank, addBank, updateBank, deleteBank } = require('../../controllers/BankController');
const { authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    // Create a new bank
    router.post('/create', authorizeAccessControll, addBank);

    // Get all banks
    router.get('/all', authorizeAccessControll, getAllBanks);

    // Get bank by ID
    router.get('/:bank_id', authorizeAccessControll, findBank);

    // Update bank by ID
    router.put('/:bank_id', authorizeAccessControll, updateBank);

    // Delete bank by ID
    router.delete('/:bank_id', authorizeAccessControll, deleteBank);

    return router;
};
