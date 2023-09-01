const PaymentAccountModel = require('../models/BankModal');

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

    PaymentAccountModel.updatePaymentAccount(account_id, accountData, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating payment account in the database' });
            return;
        }

        res.status(200).send({ message: 'Payment account updated successfully' });
    });
};

const getPaymentAccountByDealerId = (req, res) => {
    const { dealerid } = req.params;

    PaymentAccountModel.getPaymentAccountByDealerId(dealerid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching payment accounts from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const deletePaymentAccount = (req, res) => {
    const { account_id } = req.params;

    PaymentAccountModel.deletePaymentAccount(account_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting payment account from the database' });
            return;
        }

        res.status(200).send({ message: 'Payment account deleted successfully' });
    });
};

const updateIsDeleteFlag = (req, res) => {
    const { account_id } = req.params;
    const { is_delete } = req.body;

    PaymentAccountModel.updateIsDeleteFlag(account_id, is_delete, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating is_delete flag in the payment account' });
            return;
        }

        res.status(200).send({ message: 'is_delete flag updated successfully' });
    });
};

const updatePaymentAccountField = (req, res) => {
    const { account_id, field } = req.params;
    const { value } = req.body;

    PaymentAccountModel.updatePaymentAccountField(account_id, field, value, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error updating payment account field in the database' });
            return;
        }

        res.status(200).send({ message: 'Payment account field updated successfully' });
    });
};

module.exports = {
    getAllPaymentAccounts,
    updatePaymentAccount,
    getPaymentAccountByDealerId,
    deletePaymentAccount,
    updateIsDeleteFlag,
    updatePaymentAccountField,
};
