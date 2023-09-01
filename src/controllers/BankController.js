const PaymentAccountModel = require('../models/BankModal');
const DealerModel = require('../models/DealerModel');

const getAllPaymentAccounts = (req, res) => {
    PaymentAccountModel.getAllPaymentAccounts((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment accounts from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const updatePaymentAccount = (req, res) => {
    const { account_id } = req.params;
    const accountData = req.body;

    PaymentAccountModel.getPaymentAccountById(account_id, (error, payment) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!payment[0]) {
            res.status(404).send({ error: 'Account not found' });
            return;
        }

        PaymentAccountModel.updatePaymentAccount(account_id, accountData, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating payment account in the database' });
                return;
            }

            res.status(200).send({ message: 'Payment account updated successfully' });
        });
    });
};

const getPaymentAccountByDealerId = (req, res) => {
    const { dealerid } = req.params;

    DealerModel.getDealerById(dealerid, (error, existingDealer) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingDealer[0]) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        PaymentAccountModel.getPaymentAccountByDealerId(dealerid, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching payment accounts from the database' });
                return;
            }

            res.status(200).send(results);
        });
    });
};

const getPaymentAccountById = (req, res) => {
    const { account_id } = req.params;

    PaymentAccountModel.getPaymentAccountById(account_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment accounts from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const createPaymentAccount = (req, res) => {
    const accountData = req.body;

    DealerModel.getDealerById(accountData.dealerid, (error, existingDealer) => {
        if (error) {
            return res.status(500).send({ error: 'Error fetching data from the database' });
        }

        if (!existingDealer[0]) {
            return res.status(404).send({ error: 'Dealer not found' });
        }

        console.log(accountData.account_bank)

        PaymentAccountModel.getPaymentAccountByAccountNumber(accountData.account_bank, (error, existingAccount) => {
            if (error) {
                return res.status(500).send({ error: 'Error fetching data from the database' });
            }

            

            if (existingAccount.length !== 0) {
                return res.status(400).send({ error: 'Bank Account Already Created, please try again or contact us' });
            }

            PaymentAccountModel.getPaymentAccountByDealerId(accountData.dealerid, (error, existingDealerBankAccount) => {
                if (error) {
                    return res.status(500).send({ error: 'Error fetching data from the database' });
                }

                if (existingDealerBankAccount[0]) {
                    return res.status(400).send({ error: 'Bank Account Already Created, please try again or contact us' });
                }

                PaymentAccountModel.createPaymentAccount(accountData, (error, result) => {
                    if (error) {
                        return res.status(500).send({ error: 'Error creating payment account' });
                    }

                    // Assuming that 'result' contains the ID of the newly created payment account
                    const accountId = result.insertId;

                    return res.status(201).send({ success: true, accountId });
                });
            });
        });
    });
};


const deletePaymentAccount = (req, res) => {
    const { account_id } = req.params;

    PaymentAccountModel.getPaymentAccountById(account_id, (error, payment) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!payment[0]) {
            res.status(404).send({ error: 'Account not found' });
            return;
        }

        PaymentAccountModel.deletePaymentAccount(account_id, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting payment account from the database' });
                return;
            }

            res.status(200).send({ message: 'Payment account deleted successfully' });
        });
    });
};

const updateIsDeleteFlag = (req, res) => {
    const { account_id } = req.params;

    PaymentAccountModel.getPaymentAccountById(account_id, (error, payment) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!payment[0]) {
            res.status(404).send({ error: 'Account not found' });
            return;
        }

        PaymentAccountModel.updateIsDeleteFlag(account_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating is_delete flag in the payment account' });
                return;
            }

            res.status(200).send({ message: 'is_delete flag updated successfully' });
        });
    });
};

const updatePaymentAccountField = (req, res) => {
    const { account_id, field } = req.params;
    const { value } = req.body;

    PaymentAccountModel.getPaymentAccountById(account_id, (error, payment) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!payment[0]) {
            res.status(404).send({ error: 'Account not found' });
            return;
        }

        PaymentAccountModel.updatePaymentAccountField(account_id, field, value, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating payment account field in the database' });
                return;
            }

            res.status(200).send({ message: 'Payment account field updated successfully' });
        });
    });
};

module.exports = {
    getAllPaymentAccounts,
    updatePaymentAccount,
    getPaymentAccountByDealerId,
    deletePaymentAccount,
    updateIsDeleteFlag,
    updatePaymentAccountField,
    createPaymentAccount,
    getPaymentAccountById
};
