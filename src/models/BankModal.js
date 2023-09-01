const { connection } = require('../../config/connection');

const PaymentAccountModel = {
    getAllPaymentAccounts(callback) {
        const query = 'SELECT * FROM paymentaccount';
        connection.query(query, callback);
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
        const query = 'SELECT * FROM paymentaccount WHERE dealerid = ?';
        connection.query(query, [dealerid], callback);
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
