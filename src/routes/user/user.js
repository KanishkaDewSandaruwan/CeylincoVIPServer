const express = require('express');

const { login, getAll, getUserById, addUser, updateUser, findUser, changePassword, changeStatus, deleteuser } = require('../../controllers/UserController');
const { authenticateToken, authorizeValidateUser, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    router.post('/create', addUser);
    router.post('/login', login);

    router.get('/all', authorizeAccessControll, getAll);
    router.get('/:userid', authorizeAccessControll, findUser);
    router.put('/status/:userid', authorizeAccessControll, changeStatus);
    router.put('/delete/:userid', authorizeAccessControll, deleteuser);
    router.put('/update/:userid', authorizeAccessControll, updateUser);

    router.get('/me/:userid', authorizeValidateUser, getUserById);
    router.put('/me/update/:userid', authorizeValidateUser, updateUser);
    
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, updateUser);
    router.put('/me/delete/:userid', authorizeValidateUser, deleteuser);

    return router;
};
