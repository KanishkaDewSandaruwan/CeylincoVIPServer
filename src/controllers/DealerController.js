const DealerModel = require('../models/DealerModel');
const PaymentModel = require('../models/PaymentModel');
const dealerView = require('../views/dealerView');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { sendEmail, sendEmailWithAttachment } = require('../../config/mail');
require('dotenv').config(); // Load environment variables

const getDealerCount = async (req, res) => {
    try {
        const count = await DealerModel.getDealerCount();
        res.status(200).send({ count: count });
    } catch (error) {
        res.status(500).send({ error: 'Error fetching payment count' });
    }
};


const getCommisionByID = async (req, res) => {
    const { dealer_id } = req.params;

    try {
        const existingDealer = DealerModel.getDealerById(dealer_id);

        if (!existingDealer[0]) {
            return res.status(404).send({ error: 'Dealer not found' });
        }

        try {
            const [pendingCommision, paidCommision] = await Promise.all([
                PaymentModel.getDealerCommitionCompletedPaymentSum(dealer_id),
                PaymentModel.getDealerCommitionPendingPaymentSum(dealer_id),
            ]);

            return res.status(200).send({
                pendingCommision: pendingCommision,
                paidCommision: paidCommision,
                dealerName: existingDealer[0].dealer_fullname
            });
        } catch (error) {
            return res.status(500).send({ error: 'Error fetching payment sums' });
        }
    } catch (error) {
        return res.status(500).send({ error: 'Error fetching data from the database' });
    }
};

const login = (req, res) => {
    const { dealer_email, dealer_password } = req.body;
    console.log(dealer_email + ' ' + dealer_password);

    DealerModel.getDealerUserByUsernameAndPassword(dealer_email, dealer_password, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const dealer = results[0];

            if (dealer.status === 1) {
                const token = generateToken(dealer.dealer_email);

                if (token) {
                    dealerView.renderDealer(res, dealer, token);
                    return;
                }

                res.status(401).send({ error: 'Server error' });
                return;
            }

            res.status(401).send({ error: 'Account is not active' });
            return;
        }

        res.status(401).send({ error: 'Invalid email or password' });
    });
};



const getAll = (req, res) => {
    DealerModel.getAllDealer((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

getDealerById = (req, res) => {
    const { dealer_id } = req.params;
    DealerModel.getDealerById(dealer_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        res.status(200).send(results);
    });
}


const findDealer = (req, res) => {
    const { dealer_id } = req.params;
    DealerModel.getDealerById(dealer_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const validate = (req, res) => {
    const { field, value } = req.params;
    DealerModel.validate(field, value, (error, count) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send({ count });
    });
};

const addDealer = (req, res) => {
    const dealer = req.body; // Retrieve the user data from the request body

    DealerModel.getDealerByemail(dealer.dealer_email, async (error, existingDealer) => {
        if (error) {
            return res.status(500).send({ error: 'Error fetching data from the database' });
        }

        if (existingDealer[0]) {
            return res.status(404).send({ error: 'This Email is already exist' });
        }

        if (dealer.phonenumber && dealer.phonenumber !== existingDealer[0].phonenumber) {


            DealerModel.getUserByPhonenumber(dealer.phonenumber, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                addDealerReg(dealer);
            });
        } else {
            addDealerReg(dealer);
        }

    });
};

const addDealerReg = (dealer) => {

    DealerModel.addDealers(dealer, (error, dealer_id) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!dealer_id) {
            res.status(404).send({ error: 'Failed to create user' });
            return;
        }

        const verificationToken = generateVerificationToken(dealer.dealer_email);
        sendVerificationEmail(dealer.dealer_email, verificationToken);

        res.status(200).send({ message: 'Dealer created successfully', dealer_id });
    });
}


const validateDealer = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email; // Use the correct field name from the token

        DealerModel.getDealerByemail(email, async (error, existingDealer) => {
            if (error) {
                return res.status(500).send({ error: 'Error fetching data from the database' });
            }

            if (!existingDealer[0]) {
                return res.status(404).send({ error: 'Dealer not found' });
            }

            DealerModel.updatestatus(existingDealer[0].dealer_id, 1, (updateError, updateResult) => {
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
                            <title>Thank You for Join with Us</title>
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
                            <p>Your Account has been successfully verified.</p>
                            <script>
                                setTimeout(function() {
                                    window.location.href = "${redirectUrl}";
                                }, 2000); // Adjust the delay time as needed
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





async function simulateEmailVerification(email) {
    // Simulate the email verification process
    // Return true if the email is verified, false otherwise
    return true;
}

function generateVerificationToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Change expiresIn as needed
}

// Function to send verification email
const sendVerificationEmail = (email, verificationToken) => {
    console.log(email + verificationToken)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ceylincodk97@gmail.com', // Replace with your Gmail email
            pass: 'fltwiuttvqaykgok' // Replace with your Gmail password or app-specific password
        }
    });

    const verificationLink = `https://backend.policycollector.xyz/api/dealer/verify/${verificationToken}`;

    const mailOptions = {
        from: 'ceylincodk97@gmail.com', // Sender's email address
        to: email, // Receiver's email address (dealer's email)
        subject: 'Account Verification',
        text: `Thank you for register as a dealer with ceylinco genaral insurance.please verify your account by clicking the link ${verificationLink}. please contact us for any problem  or more information 0766 910710`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendMailToUsers = (req, res) => {
    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'ceylincodk97@gmail.com', // Replace with your Gmail email
            pass: 'fltwiuttvqaykgok' // Replace with your Gmail password or app-specific password
        }
    });

    const mailOptions = {
        from: 'ceylincodk97@gmail.com', // Sender's email address
        to: to, // Receiver's email address (provided in the request body)
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
};




// const addDealer = (req, res) => {
//     const dealer = req.body; // Retrieve the user data from the request body

//     DealerModel.addDealers(dealer, (error, dealer_id) => {
//         if (error) {
//             res.status(500).send({ error: 'Error fetching data from the database' });
//             return;
//         }

//         if (!dealer_id) {
//             res.status(404).send({ error: 'Failed to create user' });
//             return;
//         }

//         res.status(200).send({ message: 'Dealer created successfully', dealer_id });
//     });
// };


const updateDealer = (req, res) => {
    const { dealer_id } = req.params;
    const dealer = req.body;

    DealerModel.getDealerById(dealer_id, (error, existingDealer) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingDealer[0]) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        if (dealer.phonenumber && dealer.phonenumber !== existingDealer[0].phonenumber) {


            DealerModel.getUserByPhonenumber(dealer.phonenumber, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                updateExistingDealer(dealer, dealer_id);
            });
        } else {
            updateExistingDealer(dealer, dealer_id);
        }
    });

    function updateExistingDealer(dealer, dealerid) {
        DealerModel.updateDealer(dealer, dealerid, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'Dealer not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'Dealer updated successfully' });
        });
    }
};




const deleteDealers = (req, res) => {
    const { dealer_ids } = req.body;

    if (!Array.isArray(dealer_ids) || dealer_ids.length === 0) {
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const DealerId of dealer_ids) {
        DealerModel.getDealerById(DealerId, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                DealerModel.deletedealer(DealerId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === dealer_ids.length) {
                        const totalCount = dealer_ids.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all Dealer have been processed
            if (successCount + failCount === dealer_ids.length) {
                const totalCount = dealer_ids.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};

const changePassword = (req, res) => {
    const { dealer_id } = req.params;
    const { currentPassword, newPassword } = req.body;

    DealerModel.getDealerById(dealer_id, (error, dealer) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!dealer[0]) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        if (dealer[0].password !== currentPassword) {
            res.status(400).send({ error: 'Current password is incorrect' });
            return;
        }

        DealerModel.updateDealerPassword(dealer_id, newPassword, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating password in the database' });
                return;
            }

            res.status(200).send({ message: 'Password changed successfully' });
        });
    });
};

const changeEmail = (req, res) => {
    const { dealer_id } = req.params;
    const { currentEmail, newEmail } = req.body;

    DealerModel.getDealerById(dealer_id, (error, dealer) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!dealer[0]) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        if (dealer[0].email !== currentEmail) {
            res.status(400).send({ error: 'Current email is incorrect' });
            return;
        }

        DealerModel.changeEmail(dealer_id, newEmail, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating email in the database' });
                return;
            }

            res.status(200).send({ message: 'Email changed successfully' });
        });
    });
};

const changeStatus = (req, res) => {
    const { dealer_id } = req.params;
    const { status } = req.body;

    DealerModel.getDealerById(dealer_id, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        DealerModel.updatestatus(dealer_id, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status Updated successfully' });
        });
    });
};

const deleteDealer = (req, res) => {
    const { dealer_id } = req.params;

    DealerModel.getDealerById(dealer_id, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'Dealer not found' });
            return;
        }

        DealerModel.deletedealer(dealer_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Deleteing in the database' });
                return;
            }

            res.status(200).send({ message: 'User Delete successfully' });
        });
    });
};


// Generate token using JWT
function generateToken(email) {
    const payload = { email };
    const options = { expiresIn: '1h' }; // Token expiration time

    // Sign the token with the secret key from the .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
}

const forgetPassword = (req, res) => {
    const { email } = req.body;

    DealerModel.getDealerByemail(email, (error, dealer) => {
        if (error) {
            return res.status(500).send({ error: 'Error fetching data from the database' });
        }

        if (!dealer[0]) {
            return res.status(404).send({ error: 'Email not found. Please check your email and try again!' });
        }

        // Generate a random OTP
        function generateOTP() {
            const otpLength = 6;
            const digits = '0123456789';
            let OTP = '';

            for (let i = 0; i < otpLength; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }

            return OTP;
        }

        const verificationCode = generateOTP();
        const verificationToken = generateVerificationTokenQuick(email); // Make sure this function is defined

        DealerModel.insertResetRequest(email, verificationToken, verificationCode, (error, resetRequest_id) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }
    
            if (!resetRequest_id) {
                res.status(404).send({ error: 'Failed to create user' });
                return;
            }
    
            const emailContent = `
                Hi, ${dealer[0].fullname}
                
                Your verification code is: ${verificationCode}
                You have 15 minutes to reset your password.
            `;

            // Assuming you have a sendEmail function
            sendEmail(email, 'Reset Password', emailContent);

            // Send response back with token, message, and inserted ID
            res.status(200).send({
                message: 'Verification code sent successfully. Please check your email.',
                token: verificationToken,
                insertedId: insertId
            });
            
        });
    });
};



const restPassword = async (req, res) => {
    const { token, otp, insertedId } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email; // Use the correct field name from the token

        DealerModel.getDealerByemail(email, async (error, existingDealer) => {
            if (error) {
                return res.status(500).send({ error: 'Error fetching data from the database' });
            }

            if (!existingDealer[0]) {
                return res.status(404).send({ error: 'Password reset fail try again' });
            }

            DealerModel.getIsertRequest(insertedId, async (error, existingRequest) => {
                if (error) {
                    return res.status(500).send({ error: 'Error fetching data from the database' });
                }

                if (!existingRequest[0]) {
                    return res.status(404).send({ error: 'Password reset fail try again' });
                }

                if (existingRequest[0].otp === otp) {
                    const token = generateToken(existingRequest[0].email);

                    res.status(200).send({
                        message: 'Verification success. Now you can add new password.',
                        token: token,
                    });
                }

            });
        });
    } catch (tokenError) {
        return res.status(400).send({ error: 'Token is invalid or expired' });
    }
};

const newPassword = (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email; // Use the correct field name from the token

        if (newPassword !== confirmPassword) {
            return res.status(400).send({ error: 'Passwords do not match' });
        }

        DealerModel.getDealerByemail(decoded.email, async (error, existingDealer) => {
            if (error) {
                return res.status(500).send({ error: 'Error fetching data from the database' });
            }

            if (!existingDealer[0]) {
                return res.status(404).send({ error: 'Password reset fail try again' });
            }

            DealerModel.updateDealerPasswordByEmail(decoded.email, newPassword, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error updating email in the database' });
                    return;
                }

                res.status(200).send({ message: 'Password Reset successfully Completed' });
            });
        });
    } catch (tokenError) {
        return res.status(400).send({ error: 'Token is invalid or expired' });
    }
}

function generateVerificationTokenQuick(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

module.exports = {
    login,
    getAll,
    getDealerById,
    findDealer,
    addDealer,
    updateDealer,
    changePassword,
    changeEmail,
    changeStatus,
    deleteDealer,
    validate,
    sendMailToUsers,
    deleteDealers,
    validateDealer,
    getDealerCount,
    getCommisionByID,
    forgetPassword,
    restPassword,
    newPassword
};
