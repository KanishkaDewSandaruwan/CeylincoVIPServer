const CompanyModel = require('../models/CompanyModel');

const getAllCompanies = (req, res) => {
    CompanyModel.getAllCompanies((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const findCompany = (req, res) => {
    const { company_id } = req.params;
    CompanyModel.getCompanyById(company_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Company not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addCompany = (req, res) => {
    const company = req.body;

    CompanyModel.addCompany(company, (error, companyId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!companyId) {
            res.status(404).send({ error: 'Failed to create company' });
            return;
        }

        res.status(200).send({ success: true, companyId });
    });
};

const updateCompany = (req, res) => {
    const { company_id } = req.params;
    const company = req.body;

    CompanyModel.getCompanyById(company_id, (error, companyData) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!companyData[0]) {
            res.status(404).send({ error: 'Company not found' });
            return;
        }

        CompanyModel.updateCompany(company, company_id, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating company in the database' });
                return;
            }

            res.status(200).send({ message: 'Company updated successfully' });
        });
    });
};

const deleteCompany = (req, res) => {
    const { company_id } = req.params;

    CompanyModel.getCompanyById(company_id, (error, companyData) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!companyData[0]) {
            res.status(404).send({ error: 'Company not found' });
            return;
        }

        CompanyModel.deleteCompany(company_id, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting company from the database' });
                return;
            }

            res.status(200).send({ message: 'Company deleted successfully' });
        });
    });
};

module.exports = {
    getAllCompanies,
    findCompany,
    addCompany,
    updateCompany,
    deleteCompany,
};
