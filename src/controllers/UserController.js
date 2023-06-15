const UserModel = require('../models/UserModel');
const userView = require('../views/userView');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const login = (req, res) => {
    const { username, password } = req.body;

    UserModel.getUserByUsernameAndPassword(username, password, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const user = results[0];

            if (user.status === 1) {
                const token = generateToken(user.email, user.userrole);

                if (token) {
                    userView.renderUser(res, user, token);
                    return;
                }

                res.status(401).send({ error: 'Server error' });
                return;
            }

            res.status(401).send({ error: 'Account is not active' });
            return;
        }

        res.status(401).send({ error: 'Invalid username or password' });
    });
};



const getAll = (req, res) => {
    UserModel.getAll((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

getUserById = (req, res) => {
    const { userid } = req.params;
    UserModel.getUserById(userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(results);
    });
}

const findUser = (req, res) => {
    const { userid } = req.params;
    UserModel.getUserById(userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(results);
    });
};


const addUser = (req, res) => {
    const user = req.body; // Retrieve the user data from the request body

    UserModel.addUser(user, (error, userId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!userId) {
            res.status(404).send({ error: 'Failed to create user' });
            return;
        }

        res.status(200).send({ message: 'User created successfully', userId });
    });
};


const updateUser = (req, res) => {
    const { userid } = req.params;
    const user = req.body;

    UserModel.updateUser(user, userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'User not found or no changes made' });
            return;
        }

        res.status(200).send({ message: 'User updated successfully' });
    });
};

const changePassword = (req, res) => {
    const { userid } = req.params;
    const { currentPassword, newPassword } = req.body;

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (user[0].password !== currentPassword) {
            res.status(400).send({ error: 'Current password is incorrect' });
            return;
        }

        UserModel.updateUserPassword(userid, newPassword, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating password in the database' });
                return;
            }

            res.status(200).send({ message: 'Password changed successfully' });
        });
    });
};

const changeEmail = (req, res) => {
    const { userid } = req.params;
    const { currentEmail, newEmail } = req.body;

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (user[0].email !== currentEmail) {
            res.status(400).send({ error: 'Current email is incorrect' });
            return;
        }

        UserModel.changeEmail(userid, newEmail, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating email in the database' });
                return;
            }

            res.status(200).send({ message: 'Email changed successfully' });
        });
    });
};

const changeStatus = (req, res) => {
    const { userid } = req.params;
    const { status } = req.body;

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.updatestatus(userid, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status Updated successfully' });
        });
    });
};

const deleteuser = (req, res) => {
    const { userid } = req.params;

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.deleteuser(userid, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Deleteing in the database' });
                return;
            }

            res.status(200).send({ message: 'User Delete successfully' });
        });
    });
};

// Generate token using JWT
function generateToken(email, userrole) {
    const payload = { email, userrole };
    const options = { expiresIn: '5m' }; // Token expiration time

    // Sign the token with the secret key from the .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
}

module.exports = {
    login,
    getAll,
    getUserById,
    findUser,
    addUser,
    updateUser,
    changePassword,
    changeEmail,
    changeStatus,
    deleteuser
};
