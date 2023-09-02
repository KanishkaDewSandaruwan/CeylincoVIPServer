const { connection } = require('../../config/connection');

const DealerModel = {

    getDealerCount() { 
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM dealer WHERE is_delete = 0 AND status = 1';
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
        connection.query('SELECT * FROM dealer WHERE dealer_email = ? AND dealer_password = ? AND is_delete = 0 AND status = 1', [dealer_email, dealer_password], callback);
    },

    saveDealerToken(dealer_id, token, callback) {
        connection.query('UPDATE dealer SET apitoken = ? WHERE dealer_id = ?', [token, dealer_id], callback);
    },

    getAllDealer(callback) {
        connection.query('SELECT * FROM dealer WHERE is_delete = 0 ', callback);
    },

    getDealerById(dealer_id, callback) {
        connection.query('SELECT * FROM dealer WHERE dealer_id = ?', [dealer_id], callback);
    },

    getDealerByemail(email, callback) {
        connection.query('SELECT * FROM dealer WHERE dealer_email = ? AND is_delete = 0', [email], callback);
    },

    getDealerByPhonenumber(dealer_phone, callback) {
        connection.query('SELECT * FROM dealer WHERE dealer_phone = ? AND is_delete = 0', [dealer_phone], callback);
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


    deleteIsertRequest_id(resetRequest_id, callback) {
        connection.query('DELETE FROM resetRequest WHERE resetRequest_id = ?', [resetRequest_id], callback);
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
        console.log("insertId", dealer_fullname);

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

            console.log("insertId", results.insertId);
            const dealer_id = results.insertId;
            callback(null, dealer_id);
        });
    },

    //bank
    addDealerAccount(account, callback) {
        const { dealerid, account_name, account_number, account_bank, account_bank_branch } = account;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0; // Convert numeric default values to numbers
    
        const query = 'INSERT INTO paymentaccount (dealerid, account_name, account_number, account_bank, account_bank_branch, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            dealerid,
            account_name,
            account_number,
            account_bank,
            account_bank_branch,
            trndate,
            defaultValues,
            defaultValues
        ];
    
        connection.query(query, values, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
    
            console.log(results.insertId);
            const account_id = results.insertId;
            callback(null, account_id);
        });
    },    

    updatePaymentAccount(accountId, updatedAccount, callback) {
        const { account_name, account_number, account_bank, account_bank_branch } = updatedAccount;
    
        const query = 'UPDATE paymentaccount SET account_name = ?, account_number = ?, account_bank = ?, account_bank_branch = ? WHERE account_id = ?';
        const values = [account_name, account_number, account_bank, account_bank_branch, accountId];
    
        connection.query(query, values, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
    
            callback(null, results.affectedRows);
        });
    },
    
    getAllPaymentAccounts(callback) {
        const query = 'SELECT * FROM paymentaccount WHERE is_delete = 0 AND status = 1';
        connection.query(query, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
    
            callback(null, results);
        });
    },

    getPaymentAccountById(accountId, callback) {
        const query = 'SELECT * FROM paymentaccount WHERE account_id = ? AND is_delete = 0 AND status = 1';
        connection.query(query, [accountId], (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
    
            if (results.length === 0) {
                callback('Payment account not found', null);
                return;
            }
    
            callback(null, results[0]);
        });
    },
    
    

    //dealer

    updateDealer(dealer, dealer_id, callback) {
        const { dealer_fullname, dealer_phone, dealer_address, dealer_nic, dealer_whatsapp_number, company_id, status } = dealer;
        const query = 'UPDATE dealer SET dealer_fullname = ?, dealer_phone = ?, dealer_address = ?, dealer_nic = ?, dealer_whatsapp_number = ?, company_id = ?, status = ? WHERE dealer_id = ?';
        const values = [dealer_fullname, dealer_phone, dealer_address, dealer_nic, dealer_whatsapp_number, company_id, status, dealer_id];

        connection.query(query, values, callback);
    },

    updateDealerProfile(dealer, dealer_id, callback) {
        const { dealer_fullname, dealer_phone, dealer_address, dealer_nic, dealer_whatsapp_number } = dealer;
        const query = 'UPDATE dealer SET dealer_fullname = ?, dealer_phone = ?, dealer_address = ?, dealer_nic = ?, dealer_whatsapp_number = ? WHERE dealer_id = ?';
        const values = [dealer_fullname, dealer_phone, dealer_address, dealer_nic, dealer_whatsapp_number, dealer_id];

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
