const { connection } = require('../../config/connection');

const DealerModel = {
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
        connection.query('SELECT * FROM dealer WHERE dealer_id = ? AND is_delete = 0', [dealer_id], callback);
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


    addDealer(dealer, callback) {
        const { dealerFullname, dealerAddress, dealerNic, dealerPhone, dealerWhatsappNumber, dealerEmail, dealerPassword, pinNumber, companyId } = dealer;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultvalues = 0;

        
        const query = 'INSERT INTO dealer (dealer_fullname, dealer_address, dealer_nic, dealer_phone, dealer_whatsapp_number, dealer_email, dealer_password, status, is_delete , pin_number, reg_date, company_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        const values = [dealerFullname, dealerAddress, dealerNic, dealerPhone, dealerWhatsappNumber, dealerEmail, dealerPassword, defaultvalues, defaultvalues, pinNumber, trndate, defaultvalues];
        
        connection.query(query, values, (error, results) => {
            if (error) {
                callback(error, null);
                return;
            }
            
            console.log(results)
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
