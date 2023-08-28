const express = require('express');

const { login, getAll, getUserById, fogetPassword, restPassword, updateUserProfiles, addUser, updateUser, findUser, changePassword, changeStatus, deleteuser, changeUsername , deleteusers } = require('../../controllers/UserController');
const { authenticateToken, authorizeValidateUser, authorizeAccessControll } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();

    //no token authontication
    router.post('/login', login);
    router.post('/forget-password', fogetPassword);
    router.get('/verify/:token', restPassword);

    //user role permission authontication
    router.post('/create', authorizeAccessControll, addUser);
    router.get('/all', authorizeAccessControll, getAll);
    router.get('/:userid', authenticateToken, findUser);
    router.put('/status/:userid', authorizeAccessControll, changeStatus);
    router.put('/delete/:userid', authorizeAccessControll, deleteuser);
    router.put('/delete', authorizeAccessControll, deleteusers);
    router.put('/update/:userid', authorizeAccessControll, updateUser);

    //same user authontication
    router.get('/me/:userid', authorizeValidateUser, getUserById);
    router.put('/me/update/:userid', authorizeValidateUser, updateUserProfiles);
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeusername/:userid', authorizeValidateUser, changeUsername);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, updateUser);
    router.delete('/me/delete/:userid', authorizeValidateUser, deleteuser);

    return router;
};
