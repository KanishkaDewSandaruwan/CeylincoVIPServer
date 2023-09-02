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

    //statistics count
    getPaymentCount() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM payment WHERE is_delete = 0';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },

    getPendingPayments() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const query = 'SELECT COUNT(*) as count FROM payment WHERE is_delete = 0 AND status = 1';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },
    getConfirmPayments() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const query = 'SELECT COUNT(*) as count FROM payment WHERE is_delete = 0 AND status = 2';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },
    
    getCompletedPayments() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const query = 'SELECT COUNT(*) as count FROM payment WHERE is_delete = 0 AND status = 3';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },

    getThisMonthPayments() {
        return new Promise((resolve, reject) => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1; // JavaScript months are zero-based

            const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

            const query = 'SELECT COUNT(*) as count FROM payment WHERE trndate BETWEEN ? AND ? AND is_delete = 0 AND status = 3';
            connection.query(query, [startOfMonth, endOfMonth], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },

    getPaymentsForYear() {
        return new Promise((resolve, reject) => {
            const now = new Date();
            const year = now.getFullYear();

            const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
            const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0];

            const query = 'SELECT COUNT(*) as count FROM payment WHERE trndate BETWEEN ? AND ? AND is_delete = 0 AND status = 3';
            connection.query(query, [startOfYear, endOfYear], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },

    //single dealer

    getDealerCommitionCompletedPaymentSum(dealerid) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(commition_amount) as sum FROM payment WHERE is_delete = 0';
            connection.query(query, [dealerid] ,(error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
                }
            });
        });
    },

    getDealerCommitionPendingPaymentSum(dealerid) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(commition_amount) as sum FROM payment WHERE is_delete = 0';
            connection.query(query, [dealerid], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
                }
            });
        });
    },

    //dealer all
    getDealerCommitionCompletedPaymentSum() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(commition_amount) as sum FROM payment WHERE is_delete = 0 AND status = 3';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
                }
            });
        });
    },

    getDealerCommitionPendingPaymentSum() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(commition_amount) as sum FROM payment WHERE is_delete = 0 AND status = 2';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
                }
            });
        });
    },


    //statistics sum
    getPaymentSum() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(policy_amount) as sum FROM payment WHERE is_delete = 0 AND status = 2';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
                }
            });
        });
    },

    getTodayPaymentsSum() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            const query = 'SELECT SUM(policy_amount) as sum FROM payment WHERE DATE(trndate) = ?  AND is_delete = 0 AND status = 2';
            connection.query(query, [today], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
                }
            });
        });
    },

    getThisMonthPaymentsSum() {
        return new Promise((resolve, reject) => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // Months are 0-indexed, so add 1
        
            console.log(currentYear + ' ' + currentMonth)

            const query = 'SELECT SUM(policy_amount) as sum FROM payment WHERE YEAR(trndate) = ? AND MONTH(trndate) = ?  AND is_delete = 0 AND status = 2';
            connection.query(query, [currentYear, currentMonth], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum || 0); // Ensure a default value if sum is null
                }
            });
        });
    },

    getPaymentsForYearSum(year) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(policy_amount) as sum FROM payment WHERE YEAR(trndate) = ? AND is_delete = 0 AND status = 2';
            connection.query(query, [year], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].sum);
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
        const values = [paymentid];

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
