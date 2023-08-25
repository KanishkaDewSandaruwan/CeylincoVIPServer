const { connection } = require('../../config/connection');

const PaymentModel = {

    getPaymentById(paymentid) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM payment WHERE paymentid = ?';
            connection.query(query, [paymentid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    updatePaymentStatus(paymentid, status, callback) {
        const query = 'UPDATE payment SET status = ? WHERE paymentid = ?';
        const values = [status, paymentid];

        connection.query(query, values, callback);
    },

    deletePayment(paymentid, callback) {
        const query = 'DELETE FROM payment WHERE paymentid = ?';
        connection.query(query, [paymentid], callback);
    },

    getPaymentById(paymentid, callback) {
        const query = 'SELECT * FROM payment WHERE paymentid = ?';
        connection.query(query, [paymentid], callback);
    },

    getPayments(callback) {
        connection.query('SELECT * FROM payment WHERE is_delete = 0', callback);
    },

    updatePaidAmount(paymentid, paid_amount, callback) {
        const query = 'UPDATE payment SET paid_amount = ? WHERE paymentid = ?';
        const values = [paid_amount, paymentid];

        connection.query(query, values, callback);
    },

    updatePayment(paymentid, paid_amount, status, callback) {
        const query = 'UPDATE payment SET paid_amount = ?, status = ? WHERE paymentid = ?';
        const values = [paid_amount, status, paymentid];

        connection.query(query, values, callback);
    },

};

module.exports = PaymentModel;
