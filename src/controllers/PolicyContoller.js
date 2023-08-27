const PolicyModel = require('../models/PolicyModel');
const DealerModel = require('../models/DealerModel');
const PaymentModel = require('../models/PaymentModel');
const path = require('path');
const fs = require('fs');
const { sendEmail, sendEmailWithAttachment } = require('../../config/mail');
const jwt = require('jsonwebtoken');

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

    let filePath = "";

    if (req.file && req.file.filename) {
        filePath = req.file.filename;
    } else {
        filePath = null; // Set filePath to null if no attachment
    }

    const policy = {
        policy_id: policy_id,
        commition_amount: commition_amount,
        policy_amount: policy_price
    };

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

            PaymentModel.getPaymentByPolicyId(policy_id, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length !== 0) {
                    res.status(404).send({ error: 'Payment Already Created!' });
                    return;
                }

                PolicyModel.addPolicyPayment(policy, policies[0].dealer_id, filePath, (error, paymentid) => {
                    if (error) {
                        res.status(500).send({ error: 'Error adding policy payment' });
                        return;
                    }

                    const { policy_id, policy_price } = req.body;

                    PolicyModel.updatePrice(policy_id, policy_price, (error, results) => {
                        if (error) {
                            res.status(500).send({ error: 'Error updating password in the database' });
                            return;
                        }

                        const verificationToken = generateVerificationToken(dealer[0].dealer_email, paymentid)

                        const verificationLink = `https://backend.policycollector.xyz/api/policy/verify/${verificationToken}`;

                        const emailContent = `
                        Hello,
    
                        Here is the payment update for policy ${policy_id}.
                        
                        Commission Amount: ${commition_amount}
                        Policy Price: ${policy_price}
                        Policy Price: ${verificationLink}
                    `;

                        if (req.file && req.file.filename) {
                            sendEmailWithAttachment(policies[0].customer_email, 'customer', emailContent, req.file);
                            sendEmailWithAttachment(dealer[0].dealer_email, 'dealer', emailContent, req.file);
                        } else {
                            sendEmail(policies[0].customer_email, 'customer', emailContent);
                            sendEmail(dealer[0].dealer_email, 'dealer', emailContent);
                        }

                        res.status(200).send({ message: 'Policy payment and status updated successfully' });

                        res.status(200).send({ success: true, policy_id });
                    });
                });
            });
        });
    });
};


function generateVerificationToken(email, paymentid) {
    return jwt.sign({ email, paymentid }, process.env.JWT_SECRET);
}

const verifyPolicy = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email; // Use the correct field name from the token
        const paymentid = decoded.paymentid; // Use the correct field name from the token

        DealerModel.getDealerByemail(email, async (error, existingDealer) => {
            if (error) {
                return res.status(500).send({ error: 'Error fetching data from the database' });
            }

            if (!existingDealer[0]) {
                return res.status(404).send({ error: 'Dealer not found' });
            }

            PaymentModel.updatePaymentStatus(decoded.paymentid, 2, (updateError, updateResult) => {
                if (updateError) {
                    return res.status(500).send({ error: 'Error updating dealer status' });
                } else {
                    // Prepare the HTML response
                    const redirectUrl = 'https://mail.google.com'; // Replace with the Gmail URL you want to redirect to
                    const htmlResponse = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Thank You for Email Verification</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    text-align: center;
                                    padding: 50px;
                                }
                                h1 {
                                    color: #333;
                                }
                                p {
                                    color: #777;
                                    margin-top: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>Thank You!</h1>
                            <p>Your Policy has been confirmed.</p>
                            <script>
                                setTimeout(function() {
                                    window.location.href = "${redirectUrl}";
                                }, 1000); // Adjust the delay time as needed
                            </script>
                        </body>
                        </html>
                    `;
                    return res.status(200).send(htmlResponse);
                }
            });
        });
    } catch (tokenError) {
        return res.status(400).send({ error: 'Token is invalid or expired' });
    }
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
    updatePrice,
    verifyPolicy
};
