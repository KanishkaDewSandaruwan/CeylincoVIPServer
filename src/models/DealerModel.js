const { connection } = require('../../config/connection');

const DealerModel = {

    getPaymentCount() { 
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM policy WHERE is_delete = 0 AND policy_status = 3';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count);
                }
            });
        });
    },

    getTodayPayments() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const query = 'SELECT * FROM policy WHERE policy_start_date >= ? AND policy_start_date < DATE_ADD(?, INTERVAL 1 DAY) AND is_delete = 0 AND policy_status = 3';
            connection.query(query, [today, today], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
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
    
            const query = 'SELECT * FROM policy WHERE policy_start_date >= ? AND policy_start_date <= ? AND is_delete = 0 AND policy_status = 3';
            connection.query(query, [startOfMonth, endOfMonth], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getPaymentsForYear(year) {
        return new Promise((resolve, reject) => {
            const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
            const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0];
    
            const query = 'SELECT * FROM policy WHERE policy_start_date >= ? AND policy_start_date <= ? AND is_delete = 0 AND policy_status = 3';
            connection.query(query, [startOfYear, endOfYear], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getDealerCount() { 
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM dealer WHERE is_delete = 0';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count); // Assuming you want to return the count value
                }
            });
        });
    },
    
    getDealerUserByUsernameAndPassword(dealer_email, dealer_password, callback) {
        connection.query('SELECT * FROM dealer WHERE dealer_email = ? AND dealer_password = ? AND is_delete = 0', [dealer_email, dealer_password], callback);
    },

    saveDealerToken(dealer_id, token, callback) {
        connection.query('UPDATE dealer SET apitoken = ? WHERE dealer_id = ?', [token, dealer_id], callback);
    },

    getAllDealer(callback) {
        connection.query('SELECT * FROM dealer WHERE is_delete = 0', callback);
    },

    getDealerById(dealer_id, callback) {
        connection.query('SELECT * FROM dealer WHERE dealer_id = ?', [dealer_id], callback);
    },

    getDealerByemail(email, callback) {
        connection.query('SELECT * FROM dealer WHERE dealer_email = ? AND is_delete = 0', [email], callback);
    },
    
    insertResetRequest(email, token, otp, callback) {
        const trndate = new Date();
        const accept = 0;
        const status = 0;
        const is_delete = 0;
    
        const query = `INSERT INTO resetRequest (email, token, otp, trndate, accept, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [email, token, otp, trndate, accept, status, is_delete];
    
        connection.query(query, values, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }

            const resetRequest_id = results.insertId;
            callback(null, resetRequest_id);
        });
    },

    getIsertRequest(resetRequest_id, callback) {
        connection.query('SELECT * FROM resetRequest WHERE resetRequest_id = ?', [resetRequest_id], callback);
    },

    deleteIsertRequest(email, callback) {
        connection.query('DELETE FROM resetRequest WHERE email = ?', [email], callback);
    },

    updateDealerPasswordByEmail(dealer_email, dealer_password, callback) {
        const query = 'UPDATE dealer SET dealer_password = ? WHERE dealer_email = ?';
        const values = [dealer_password, dealer_email];
    
        connection.query(query, values, callback);
      },

    validate(field, value, callback) {
        const query = 'SELECT COUNT(*) AS count FROM dealer WHERE ?? = ? AND is_delete = 0';
        const params = [field, value];

        connection.query(query, params, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }

            const count = results[0].count;
            callback(null, count);
        });
    },


    addDealers(dealer, callback) {
        const { dealer_fullname, dealer_address, dealer_nic, dealer_phone, dealer_whatsapp_number, dealer_email, dealer_password, company_id } = dealer;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultvalues = '0'; // Convert numeric default values to strings

        const query = 'INSERT INTO dealer (dealer_fullname, dealer_address, dealer_nic, dealer_phone, dealer_whatsapp_number, dealer_email, dealer_password, status, is_delete, reg_date, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            dealer_fullname,
            dealer_address,
            dealer_nic,
            dealer_phone,
            dealer_whatsapp_number,
            dealer_email,
            dealer_password,
            defaultvalues,
            defaultvalues,
            trndate,
            company_id
        ];

        connection.query(query, values, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }

            console.log(results.insertId);
            const dealer_id = results.insertId;
            callback(null, dealer_id);
        });
    },


    updateDealer(user, dealer_id, callback) {
        const { dealer_fullname, dealer_phone, dealer_address, dealer_nic, dealer_whatsapp_number, company_id, status } = user;
        const query = 'UPDATE dealer SET dealer_fullname = ?, dealer_phone = ?, dealer_address = ?, dealer_nic = ?, dealer_whatsapp_number = ?, company_id = ?, status = ? WHERE dealer_id = ?';
        const values = [dealer_fullname, dealer_phone, dealer_address, dealer_nic, dealer_whatsapp_number, company_id, status, dealer_id];

        connection.query(query, values, callback);
    },

    updateDealerPassword(dealer_id, newPassword, callback) {
        const query = 'UPDATE dealer SET dealer_password = ? WHERE dealer_id = ?';
        const values = [newPassword, dealer_id];

        connection.query(query, values, callback);
    },

    changeEmail(dealer_id, newEmail, callback) {
        const query = 'UPDATE dealer SET dealer_email = ? WHERE dealer_id = ?';
        const values = [newEmail, dealer_id];

        connection.query(query, values, callback);
    },

    updatestatus(dealer_id, status, callback) {
        const query = 'UPDATE dealer SET status = ? WHERE dealer_id = ?';
        const values = [status, dealer_id];

        connection.query(query, values, callback);
    },

    deletedealer(dealer_id, value, callback) {
        const query = 'UPDATE dealer SET is_delete = ? WHERE dealer_id = ?';
        const values = [value, dealer_id];

        connection.query(query, values, callback);
    },

    perma_deletedealer(dealer_id, callback) {
        const query = 'DELETE FROM dealer WHERE dealer_id = ?';
        const values = [dealer_id];

        connection.query(query, values, callback);
    },

    dealerById(dealer_id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM dealer WHERE dealer_id = ?', [dealer_id], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
};

module.exports = DealerModel;
