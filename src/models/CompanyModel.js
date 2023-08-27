
const { connection } = require('../../config/connection');

const CompanyModel = {
    getAllCompanies(callback) {
        const query = 'SELECT * FROM finance_company WHERE is_delete = 0';
        connection.query(query, callback);
    },

    getCompanyById(company_id, callback) {
        const query = 'SELECT * FROM finance_company WHERE is_delete = 0 AND company_id = ?';
        connection.query(query, [company_id], callback);
    },

    addCompany(company, callback) {
        const defaultValue = 0;

        const {
            company_name,
            company_branch,
            company_address,
            company_phone,
            company_email
        } = company;

        const query = `INSERT INTO finance_company(company_name, company_branch, company_address, company_phone, company_email, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            company_name,
            company_branch,
            company_address,
            company_phone,
            company_email,
            defaultValue,
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
                console.error('Failed to create company');
                const insertError = new Error('Failed to create company');
                callback(insertError, null);
                return;
            }

            const companyId = results.insertId;
            callback(null, companyId);
        });
    },

    updateCompany(company, company_id, callback) {
        const { company_name, company_branch, company_address, company_phone, company_email, status } = company;

        const query = `UPDATE finance_company SET company_name = ?, company_branch = ?, company_address = ?, company_phone = ?, company_email = ? , status = ? WHERE company_id = ?`;

        const values = [company_name, company_branch, company_address, company_phone, company_email, status, company_id];

        connection.query(query, values, (error, results) => {
            if (error) {
                console.error('Error updating company:', error);
                const updateError = new Error('Error updating company in the database');
                callback(updateError, null);
                return;
            }

            if (results.affectedRows === 0) {
                console.error('Failed to update company');
                const updateError = new Error('Failed to update company');
                callback(updateError, null);
                return;
            }

            callback(null, results);
        });
    },

    deleteCompany(company_id, callback) {
        const query = 'UPDATE finance_company SET is_delete = 1  WHERE company_id = ?';
        const values = [company_id];

        connection.query(query, values, callback);
    }
};

module.exports = CompanyModel;
