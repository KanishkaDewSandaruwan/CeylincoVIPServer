const { connection } = require('../../config/connection');

const PaymentAccountModel = {
    getAllPaymentAccounts(callback) {
        const query = 'SELECT * FROM paymentaccount WHERE is_delete = 0';
        connection.query(query, callback);
    },

    createPaymentAccount(accountData, callback) {

        const trndate = new Date();
        const status = 0;
        const is_delete = 0;


        const {
            dealerid,
            account_name,
            account_number,
            account_bank,
            account_bank_branch,
        } = accountData;

        const query = `INSERT INTO paymentaccount 
                       (dealerid, account_name, account_number, account_bank, account_bank_branch, trndate, status, is_delete) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            dealerid,
            account_name,
            account_number,
            account_bank,
            account_bank_branch,
            trndate,
            status,
            is_delete
        ];

        connection.query(query, values, callback);
    },

    updatePaymentAccount(account_id, accountData, callback) {
        const {
            dealerid,
            account_name,
            account_number,
            account_bank,
            account_bank_branch,
            trndate,
            status,
            is_delete
        } = accountData;

        const query = `UPDATE paymentaccount 
                       SET dealerid = ?, 
                           account_name = ?, 
                           account_number = ?, 
                           account_bank = ?, 
                           account_bank_branch = ?, 
                           trndate = ?, 
                           status = ?, 
                           is_delete = ? 
                       WHERE account_id = ?`;

        const values = [
            dealerid,
            account_name,
            account_number,
            account_bank,
            account_bank_branch,
            trndate,
            status,
            is_delete,
            account_id
        ];

        connection.query(query, values, callback);
    },

    getPaymentAccountByDealerId(dealerid, callback) {
        const query = 'SELECT * FROM paymentaccount WHERE dealerid = ? AND is_delete = 0';
        connection.query(query, [dealerid], callback);
    },

    getPaymentAccountByAccountNumber(account_number, callback) {
        const query = 'SELECT * FROM paymentaccount WHERE account_number = ? AND is_delete = 0';
        connection.query(query, [account_number], callback);
    },

    getPaymentAccountById(account_id, callback) {
        const query = 'SELECT * FROM paymentaccount WHERE account_id = ? AND is_delete = 0';
        connection.query(query, [account_id], callback);
    },


    deletePaymentAccount(account_id, callback) {
        const query = 'DELETE FROM paymentaccount WHERE account_id = ?';
        connection.query(query, [account_id], callback);
    },

    updateIsDeleteFlag(account_id, is_delete, callback) {
        const query = 'UPDATE paymentaccount SET is_delete = ? WHERE account_id = ?';
        connection.query(query, [is_delete, account_id], callback);
    },

    updatePaymentAccountField(account_id, field, value, callback) {
        // Ensure that the field name is a valid column name in the paymentaccount table to prevent SQL injection.
        const validFields = ['dealerid', 'account_name', 'account_number', 'account_bank', 'account_bank_branch', 'trndate', 'status', 'is_delete'];

        if (!validFields.includes(field)) {
            const error = new Error(`Invalid field name: ${field}`);
            return callback(error, null);
        }

        const query = `UPDATE paymentaccount SET ${field} = ? WHERE account_id = ?`;
        connection.query(query, [value, account_id], callback);
    }
};

module.exports = PaymentAccountModel;
