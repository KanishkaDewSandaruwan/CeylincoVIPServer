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

    updatedeletePayment(paymentid, callback) {
        const query = 'UPDATE payment SET is_delete = 1 WHERE paymentid = ?';
        const values = [ paymentid];

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

    getPaymentByPolicyId(policy_id, callback) {
        const query = 'SELECT * FROM payment WHERE policyid = ? AND is_delete = 0';
        connection.query(query, [policy_id], callback);
    },

    getPayments(callback) {
        connection.query('SELECT * FROM payment WHERE is_delete = 0', callback);
    },
    getPaymentsCompleted(callback) {
        connection.query('SELECT * FROM payment WHERE is_delete = 0 AND status = 3', callback);
    },
    getPaymentsConfirmed(callback) {
        connection.query('SELECT * FROM payment WHERE is_delete = 0 AND status = 2', callback);
    },
    getPaymentsPending(callback) {
        connection.query('SELECT * FROM payment WHERE is_delete = 0 AND status = 1', callback);
    },

    updatePaidAmount(paymentid, paid_amount, callback) {
        const query = 'UPDATE payment SET paid_amount = ? WHERE paymentid = ?';
        const values = [paid_amount, paymentid];

        connection.query(query, values, callback);
    },

    updatePaymentStatus(paymentid, status, callback) {
        const query = 'UPDATE payment SET status = ? WHERE paymentid = ?';
        const values = [status, paymentid];

        connection.query(query, values, callback);
    },

    updatePayment(paymentid, commition_amount, callback) {
        const query = 'UPDATE payment SET commition_amount = ? WHERE paymentid = ?';
        const values = [commition_amount, paymentid];

        connection.query(query, values, callback);
    },

};

module.exports = PaymentModel;
