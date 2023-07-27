const DealerModel = require('../models/DealerModel');
const dealerView = require('../views/dealerView');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const login = (req, res) => {
    const { dealer_email, dealer_password } = req.body;
    console.log(dealer_email + ' ' + dealer_password);

    DealerModel.getDealerUserByUsernameAndPassword(dealer_email, dealer_password, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const dealer = results[0];

            if (dealer.status === 1) {
                const token = generateToken(dealer.dealer_email);

                if (token) {
                    dealerView.renderDealer(res, dealer, token);
                    return;
                }

                res.status(401).send({ error: 'Server error' });
                return;
            }

            res.status(401).send({ error: 'Account is not active' });
            return;
        }

        res.status(401).send({ error: 'Invalid email or password' });
    });
};



const getAll = (req, res) => {
    DealerModel.getAllDealer((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

getDealerById = (req, res) => {
    const { dealer_id } = req.params;
    DealerModel.getDealerById(dealer_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        res.status(200).send(results);
    });
}

const findDealer = (req, res) => {
    const { dealer_id } = req.params;
    DealerModel.getDealerById(dealer_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const validate = (req, res) => {
    const { field, value } = req.params;
    DealerModel.validate(field, value, (error, count) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      res.status(200).send({ count });
    });
  };


const addDealer = (req, res) => {
    const dealer = req.body; // Retrieve the user data from the request body

    DealerModel.addDealers(dealer, (error, dealer_id) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!dealer_id) {
            res.status(404).send({ error: 'Failed to create user' });
            return;
        }

        res.status(200).send({ message: 'Dealer created successfully', dealer_id });
    });
};


const updateDealer = (req, res) => {
    const { dealer_id } = req.params;
    const dealer = req.body;

    DealerModel.updateDealer(dealer, dealer_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Dealer not found or no changes made' });
            return;
        }

        res.status(200).send({ message: 'Dealer updated successfully' });
    });
};

const changePassword = (req, res) => {
    const { dealer_id } = req.params;
    const { currentPassword, newPassword } = req.body;

    DealerModel.getDealerById(dealer_id, (error, dealer) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!dealer[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (dealer[0].password !== currentPassword) {
            res.status(400).send({ error: 'Current password is incorrect' });
            return;
        }

        DealerModel.updateDealerPassword(dealer_id, newPassword, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating password in the database' });
                return;
            }

            res.status(200).send({ message: 'Password changed successfully' });
        });
    });
};

const changeEmail = (req, res) => {
    const { dealer_id } = req.params;
    const { currentEmail, newEmail } = req.body;

    DealerModel.getDealerById(dealer_id, (error, dealer) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!dealer[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (dealer[0].email !== currentEmail) {
            res.status(400).send({ error: 'Current email is incorrect' });
            return;
        }

        DealerModel.changeEmail(dealer_id, newEmail, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating email in the database' });
                return;
            }

            res.status(200).send({ message: 'Email changed successfully' });
        });
    });
};

const changeStatus = (req, res) => {
    const { dealer_id } = req.params;
    const { status } = req.body;

    DealerModel.getDealerById(dealer_id, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        DealerModel.updatestatus(dealer_id, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status Updated successfully' });
        });
    });
};

const deleteDealer = (req, res) => {
    const { dealer_id } = req.params;

    DealerModel.getDealerById(dealer_id, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        DealerModel.deletedealer(dealer_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Deleteing in the database' });
                return;
            }

            res.status(200).send({ message: 'User Delete successfully' });
        });
    });
};

// Generate token using JWT
function generateToken(email) {
    const payload = { email};
    const options = { expiresIn: '1h' }; // Token expiration time

    // Sign the token with the secret key from the .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
}

module.exports = {
    login,
    getAll,
    getDealerById,
    findDealer,
    addDealer,
    updateDealer,
    changePassword,
    changeEmail,
    changeStatus,
    deleteDealer,
    validate
};
