const PolicyModel = require('../models/PolicyModel');
const DealerModel = require('../models/DealerModel');
const path = require('path');
const fs = require('fs');
const sendEmail  = require('../../config/mail');

const getAllPolicy = (req, res) => {
    PolicyModel.getAllPolicies((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const findPolicy = (req, res) => {
    const { policy_id } = req.params;
    PolicyModel.getPolicyById(policy_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addPolicy = (req, res) => {
    const policy = req.body;

    PolicyModel.addPolicy(policy, (error, policyId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policyId) {
            res.status(404).send({ error: 'Failed to create policy' });
            return;
        }

        res.status(200).send({ success: true, policyId });
    });
};

const changePolicyStatus = (req, res) => {
    const { policy_id } = req.params;
    const { status } = req.body;

    console.log(status);

    PolicyModel.getPolicyById(policy_id, (error, policy) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policy[0]) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        PolicyModel.updatePolicyStatus(policy_id, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating policy status in the database' });
                return;
            }

            res.status(200).send({ message: 'Policy status updated successfully' });
        });
    });
};

const updatePolicyPayment = (req, res) => {
    const { commition_amount, policy_id, policy_price } = req.body;

    const policy = {
        policy_id: policy_id,
        commition_amount: commition_amount,
        policy_amount: policy_price
    }

    PolicyModel.getPolicyById(policy_id, (error, policies) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policies[0]) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        DealerModel.getDealerById(policies[0].dealer_id, (error, dealer) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (!dealer[0]) {
                res.status(404).send({ error: 'Dealer not found' });
                return;
            }

            PolicyModel.addPolicyPayment(policy, policies[0].dealer_id, (error, paymentid) => {
                if (error) {
                    res.status(500).send({ error: 'Error adding policy payment' });
                    return;
                }

                const updatedPolicy = {
                    policy_id: policy.policy_id,
                    policy_price: policy.policy_amount
                };
                console.log(policies[0].customer_email)
                sendEmail(policies[0].customer_email, 'test', 'test');

                // PolicyModel.updatePrice(policy.policy_id, policy.policy_amount, (updateError, updateResults) => {
                //     if (updateError) {
                //         // If updating policy fails, delete the added payment
                //         PolicyModel.deletePayment(paymentid, (deleteError, deleteResults) => {
                //             if (deleteError) {
                //                 res.status(500).send({ error: 'Error updating policy and deleting payment' });
                //             } else {
                //                 res.status(500).send({ error: 'Error updating policy, payment deleted' });
                //             }
                //         });
                //     } else {
                //         PolicyModel.updatePolicyStatus(policy.policy_id, 2, (statusUpdateError, statusUpdateResults) => {
                //             if (statusUpdateError) {
                //                 res.status(500).send({ error: 'Error updating policy status' });
                //             } else {


                //                 sendppolicyEmail()
                //                 res.status(200).send({ message: 'Policy payment and status updated successfully' });
                //             }
                //         });
                //     }
                // });
            });
        });
    });
};



const updatePrice = (req, res) => {
    const { policy_id } = req.params;
    const { policy_price } = req.body;

    PolicyModel.getPolicyById(policy_id, (error, policy) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policy[0]) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        PolicyModel.updatePrice(policy_id, policy_price, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating password in the database' });
                return;
            }

            res.status(200).send({ success: true, policy_id });
        });
    });
};

const deletePolicy = (req, res) => {
    const { policy_id } = req.params;

    PolicyModel.getPolicyById(policy_id, (error, policy) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policy[0]) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        PolicyModel.deletePolicy(policy_id, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error deleting policy from the database' });
                return;
            }

            res.status(200).send({ message: 'Policy deleted successfully' });
        });
    });
};

const uploadFiles = (req, res) => {
    const { field, policy_id } = req.params;

    PolicyModel.getPolicyById(policy_id, (error, policy) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policy[0]) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        const filePath = req.file.filename; // Get the uploaded file filename

        PolicyModel.updateUpload(field, policy_id, filePath, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating policy in the database' });
                return;
            }

            res.status(200).send({ message: 'Policy updated successfully' });
        });
    });
};


const getFiles = (req, res) => {
    const { fields, policy_id } = req.params;

    PolicyModel.getPolicyById(policy_id, (error, policy) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!policy[0]) {
            res.status(404).send({ error: 'Policy not found' });
            return;
        }

        const requestedFields = fields.split(',');
        const responseData = {};

        // Initialize all fields with an empty string
        requestedFields.forEach((field) => {
            responseData[field] = '';
        });

        requestedFields.forEach((field) => {
            const filePath = policy[0][field];

            if (filePath) {
                const file = path.join(__dirname, '../uploads/policy/', filePath);
                if (fs.existsSync(file)) {
                    const fileName = path.basename(file);
                    responseData[field] = fileName;
                }
            }
        });

        res.status(200).send(responseData);
    });
};



module.exports = {
    getAllPolicy,
    findPolicy,
    addPolicy,
    changePolicyStatus,
    deletePolicy,
    uploadFiles,
    getFiles,
    updatePolicyPayment,
    updatePrice
};
