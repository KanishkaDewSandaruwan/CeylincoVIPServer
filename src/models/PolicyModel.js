const { connection } = require('../../config/connection');

const PolicyModel = {
    getAllPolicies(callback) {
        const query = 'SELECT * FROM policy WHERE is_delete = 0';
        connection.query(query, callback);
    },

    getPolicyCount() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) as count FROM policy WHERE is_delete = 0 AND policy_status = 3';
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0].count); // Assuming you want to return the count value
                }
            });
        });
    },
    
    getTodayPolicies() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const query = 'SELECT * FROM policy WHERE policy_start_date = ? AND is_delete = 0 AND policy_status = 3';
            connection.query(query, [today], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    getThisMonthPolicies() {
        return new Promise((resolve, reject) => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1; // JavaScript months are zero-based
    
            const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
            const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];
    
            const query = 'SELECT * FROM policy WHERE policy_start_date BETWEEN ? AND ? AND is_delete = 0 AND policy_status = 3';
            connection.query(query, [startOfMonth, endOfMonth], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    getPoliciesForYear(year) {
        return new Promise((resolve, reject) => {
            const startOfYear = new Date(year, 0, 1).toISOString().split('T')[0];
            const endOfYear = new Date(year, 11, 31).toISOString().split('T')[0];
    
            const query = 'SELECT * FROM policy WHERE policy_start_date BETWEEN ? AND ? AND is_delete = 0 AND policy_status = 3';
            connection.query(query, [startOfYear, endOfYear], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    getPolicyById(policy_id, callback) {
        const query = 'SELECT * FROM policy WHERE is_delete = 0 AND policy_id = ?';
        connection.query(query, [policy_id], callback);
    },

    addPolicy(policy, callback) {
        const defaultValue = 0;
        const policy_start_date = new Date();

        const {
            vehicle_type,
            customer_fullname,
            customer_address,
            customer_nic,
            customer_phone,
            vehicle_reg_no,
            engine_no,
            chassis_no,
            model,
            years_of_make,
            leasing_company,
            vehicle_color,
            horse_power,
            value_of_vehicle,
            use_perpose,
            cr_image,
            vehicle_image,
            previous_insurance_card_image,
            policy_price,
            policy_type,
            policy_status,
            customer_email,
            dealer_id
        } = policy;

        const query = `INSERT INTO policy(vehicle_type, customer_fullname, customer_address, customer_nic, customer_phone, vehicle_reg_no, engin_no, chassis_no, model, years_of_make, leasing_company, vehicle_color, horse_power, value_of_vehicle, use_perpose, cr_image, vehicle_image, privious_insurence_card_image, policy_price, policy_type, policy_status, policy_start_date, status, is_delete, customer_email, dealer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            vehicle_type,
            customer_fullname,
            customer_address,
            customer_nic,
            customer_phone,
            vehicle_reg_no,
            engine_no,
            chassis_no,
            model,
            years_of_make,
            leasing_company,
            vehicle_color,
            horse_power,
            value_of_vehicle,
            use_perpose,
            cr_image,
            vehicle_image,
            previous_insurance_card_image,
            policy_price,
            policy_type,
            policy_status,
            policy_start_date,
            defaultValue,
            defaultValue,
            customer_email,
            dealer_id
        ];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                const insertError = new Error('Error inserting data into the database');
                callback(insertError, null);
                return;
            }

            if (results.affectedRows === 0) {
                console.error('Failed to create policy');
                const insertError = new Error('Failed to create policy');
                callback(insertError, null);
                return;
            }

            const policyId = results.insertId;
            callback(null, policyId);
        });
    },


    addPolicyPayment(policy, dealer_id, filePath, callback) {
        const defaultValue = 0;
        const defaultValue1 = 1;
        const defaultValue2 = "";
        const policy_start_date = new Date();

        const {
            policy_id,
            policy_amount,
            commition_amount
        } = policy;

        const query = `INSERT INTO payment(dealerid, policyid, policy_amount, qutation, commition_amount, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            dealer_id,
            policy_id,
            policy_amount,
            filePath,
            commition_amount,
            policy_start_date,
            defaultValue1,
            defaultValue
        ];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
                const insertError = new Error('Error inserting data into the database');
                callback(insertError, null);
                return;
            }

            if (results.affectedRows === 0) {
                console.error('Failed to create Payment');
                const insertError = new Error('Failed to create payment');
                callback(insertError, null);
                return;
            }

            const paymentid = results.insertId;
            callback(null, paymentid);
        });
    },

    updatePolicy(policy, policy_id, callback) {
        const { vehicle_type, customer_fullname, customer_address, customer_nic, customer_phone, vehicle_reg_no, engine_no, chassis_no, model, years_of_make, leasing_company, vehicle_color, horse_power, value_of_vehicle, use_perpose, cr_image, vehicle_image, previous_insurance_card_image, policy_price, policy_type, policy_status, policy_start_date } = policy;

        const query = `UPDATE policy SET vehicle_type = ?, customer_fullname = ?, customer_address = ?, customer_nic = ?, customer_phone = ?, vehicle_reg_no = ?, engine_no = ?, chassis_no = ?, model = ?, years_of_make = ?, leasing_company = ?, vehicle_color = ?, horse_power = ?, value_of_vehicle = ?, use_perpose = ?, cr_image = ?, vehicle_image = ?, previous_insurance_card_image = ?, policy_price = ?, policy_type = ?, policy_status = ?, policy_start_date = ? WHERE policy_id = ?`;

        const values = [vehicle_type, customer_fullname, customer_address, customer_nic, customer_phone, vehicle_reg_no, engine_no, chassis_no, model, years_of_make, leasing_company, vehicle_color, horse_power, value_of_vehicle, use_perpose, cr_image, vehicle_image, previous_insurance_card_image, policy_price, policy_type, policy_status, policy_start_date, policy_id];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error updating policy:', error);
                const updateError = new Error('Error updating policy in the database');
                callback(updateError, null);
                return;
            }

            if (results.affectedRows === 0) {
                console.error('Failed to update policy');
                const updateError = new Error('Failed to update policy');
                callback(updateError, null);
                return;
            }

            callback(null, results);
        });
    },

    updateEmail(policy_id, customer_email, callback) {
        const query = 'UPDATE policy SET customer_email = ? WHERE policy_id = ?';
        const values = [customer_email, policy_id];

        connection.query(query, values, callback);
    },

    updatePrice(policy_id, policy_price, callback) {
        console.log(policy_price)
        const query = 'UPDATE policy SET policy_price = ? WHERE policy_id = ?';
        const values = [policy_price, policy_id];

        connection.query(query, values, callback);
    },


    updatePolicyStatus(policy_id, status, callback) {
        const query = 'UPDATE policy SET status = ? WHERE policy_id = ?';
        const values = [status, policy_id];

        connection.query(query, values, callback);
    },

    deletePolicy(policy_id, callback) {
        const query = 'DELETE FROM policy WHERE policy_id = ?';
        const values = [policy_id];

        connection.query(query, values, callback);
    },

    deletePolicyUpdate(policy_id, callback) {
        const query = 'UPDATE policy SET is_delete = 1 WHERE policy_id = ?';
        const values = [policy_id];

        connection.query(query, values, callback);
    },

    updateUpload(field, policy_id, filePath, callback) {
        const query = `UPDATE policy SET ${field} = ? WHERE policy_id = ?`;
        const values = [filePath, policy_id];

        connection.query(query, values, callback);
    },

    getVehicleTypeCounts() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT vehicle_type,
                       COUNT(*) as policy_count
                FROM policy
                WHERE is_delete = 0
                GROUP BY vehicle_type
            `;
            connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    const countsWithLabels = results.map((item) => ({
                        vehicleType: item.vehicle_type,
                        vehicleTypeLabel: getVehicleTypeLabel(item.vehicle_type),
                        policyCount: item.policy_count,
                    }));
                    resolve(countsWithLabels);
                }
            });
        });
    }
};

module.exports = PolicyModel;
