const { connection } = require('../../config/connection');

const PolicyModel = {
    getAllPolicies(callback) {
        const query = 'SELECT * FROM policy';
        connection.query(query, callback);
    },

    getPolicyById(policy_id, callback) {
        const query = 'SELECT * FROM policy WHERE policy_id = ?';
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
            customer_email
        } = policy;

        const query = `INSERT INTO policy(vehicle_type, customer_fullname, customer_address, customer_nic, customer_phone, vehicle_reg_no, engin_no, chassis_no, model, years_of_make, leasing_company, vehicle_color, horse_power, value_of_vehicle, use_perpose, cr_image, vehicle_image, privious_insurence_card_image, policy_price, policy_type, policy_status, policy_start_date, status, is_delete, customer_email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
            customer_email
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

    updateUpload(field, policy_id, filePath, callback) {
        const query = `UPDATE policy SET ${field} = ? WHERE policy_id = ?`;
        const values = [filePath, policy_id];

        connection.query(query, values, callback);
    }
};

module.exports = PolicyModel;
