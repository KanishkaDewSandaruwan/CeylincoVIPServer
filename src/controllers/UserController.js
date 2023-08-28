const UserModel = require('../models/UserModel');
const userView = require('../views/userView');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../config/mail');
require('dotenv').config(); // Load environment variables

const login = (req, res) => {
    const { username, password } = req.body;

    UserModel.getUserByUsernameAndPassword(username, password, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const user = results[0];

            if (user.status === 1) {
                const token = generateToken(user.email, user.userrole);

                if (token) {
                    userView.renderUser(res, user, token);
                    return;
                }

                res.status(401).send({ error: 'Server error' });
                return;
            }

            res.status(401).send({ error: 'Account is not active' });
            return;
        }

        res.status(401).send({ error: 'Invalid username or password' });
    });
};



const getAll = (req, res) => {
    UserModel.getAll((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

getUserById = (req, res) => {
    const { userid } = req.params;
    UserModel.getUserById(userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(results);
    });
}

const fogetPassword = (req, res) => {
    const { email } = req.body;

    UserModel.getUserByEmail(email, (error, user) => {
        if (error) {
            return res.status(500).send({ error: 'Error fetching data from the database' });
        }

        if (!user[0]) {
            return res.status(404).send({ error: 'User not found' });
        }

        const verificationToken = generateVerificationToken(email);
        const verificationLink = `https://backend.policycollector.xyz/api/user/verify/${verificationToken}`;
        const emailContent = `
        Hi, ${user[0].fullname}
        
        Your Password reset link is ${verificationLink}. click here to reset password
        `;

        sendEmail(email, 'Reset Password', emailContent);
        res.status(200).send({ message: 'Policy payment and status updated successfully' });


    });
};

function generateVerificationToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' }); // Change expiresIn as needed
}

const restPassword = async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const email = decoded.email; // Use the correct field name from the token

        UserModel.getUserByEmail(email, async (error, existingUser) => {
            if (error) {
                return res.status(500).send({ error: 'Error fetching data from the database' });
            }

            if (!existingUser[0]) {
                return res.status(404).send({ error: 'User not found' });
            }

            // Render a form for the user to reset the password
            const formHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: left;
                        padding: 50px;
                        background-color: #f5f5f5;
                    }
                    h1 {
                        color: #333;
                    }
                    form {
                        max-width: 400px;
                        margin: 0 auto;
                        background-color: #fff;
                        border-radius: 8px;
                        padding: 20px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    }
                    label {
                        display: block;
                        margin-bottom: 6px;
                        font-weight: bold;
                    }
                    input[type="password"] {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        margin-bottom: 12px;
                    }
                    button {
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                        margin-top: 15px;
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
                <h1>Reset Your Password</h1>
                <form action="/reset-password/${token}" method="post">
                    <label for="newPassword">New Password:</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                    <br>
                    <label for="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                    <br>
                    <button type="submit">Reset Password</button>
                </form>
                <a href="http://ceylincocollection.dashboard.s3-website-us-east-1.amazonaws.com">Back to Site</a>
            </body>
            </html>
            `;

            return res.status(200).send(formHtml);
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

        // Update the user's password in the database
        UserModel.updatePasswordByEmail(email, newPassword);

        // Redirect the user to a success page
        const redirectUrl = 'http://ceylincocollection.dashboard.s3-website-us-east-1.amazonaws.com';
        return res.redirect(redirectUrl);
    } catch (tokenError) {
        return res.status(400).send({ error: 'Token is invalid or expired' });
    }
}

const findUser = (req, res) => {
    const { userid } = req.params;
    UserModel.getUserById(userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(results);
    });
};


const addUser = (req, res) => {
    const user = req.body; // Retrieve the user data from the request body

    // Email validation regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Phone number validation regular expression
    const phoneRegex = /^\d{12}$/;

    // Check if email is valid
    if (!emailRegex.test(user.email)) {
        res.status(400).send({ error: 'Invalid email format' });
        return;
    }

    UserModel.getUserByEmail(user.email, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length > 0) {
            res.status(409).send({ error: 'Email already exists' });
            return;
        }

        UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'Phone number already exists' });
                return;
            }

            UserModel.addUser(user, (error, userId) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (!userId) {
                    res.status(500).send({ error: 'Failed to create user' });
                    return;
                }

                res.status(200).send({ message: 'User created successfully', userId });
            });
        });
    });
};



const updateUser = (req, res) => {
    const { userid } = req.params;
    const user = req.body;

    UserModel.getUserById(userid, (error, existingUser) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingUser[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        // Check if the provided phone number is already associated with another user
        if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) {
            UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                updateExistingUser(user, userid);
            });
        } else {
            updateExistingUser(user, userid);
        }
    });

    function updateExistingUser(user, userid) {
        UserModel.updateUser(user, userid, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'User not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'User updated successfully' });
        });
    }
};

const updateUserProfiles = (req, res) => {
    const { userid } = req.params;
    const { fullname, phonenumber, address, email } = req.body;

    UserModel.getUserById(userid, (error, existingUser) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingUser[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        // Check if the provided phone number is already associated with another user
        if (phonenumber && phonenumber !== existingUser[0].phonenumber) {
            UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                updateExistingUserProfile(fullname, phonenumber, address, email, userid);
            });
        } else {
            updateExistingUserProfile(fullname, phonenumber, address, email, userid);
        }
    });

    function updateExistingUserProfile(fullname, phonenumber, address, email, userid) {
        UserModel.updateUserProfile(fullname, phonenumber, address, email, userid, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'User not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'User updated successfully' });
        });
    }
};


const changePassword = (req, res) => {
    const { userid } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Check if current password is empty
    if (!currentPassword) {
        res.status(400).send({ error: 'Current password is required' });
        return;
    }

    // Check if new password is empty
    if (!newPassword) {
        res.status(400).send({ error: 'New password is required' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (user[0].password !== currentPassword) {
            res.status(400).send({ error: 'Current password is incorrect' });
            return;
        }

        UserModel.updateUserPassword(userid, newPassword, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating password in the database' });
                return;
            }

            res.status(200).send({ message: 'Password changed successfully' });
        });
    });
};


const changeEmail = (req, res) => {
    const { userid } = req.params;
    const { currentEmail, newEmail } = req.body;

    // Email validation regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if current email is empty or not in the correct format
    if (!currentEmail || !emailRegex.test(currentEmail)) {
        res.status(400).send({ error: 'Invalid or missing current email' });
        return;
    }

    // Check if new email is empty or not in the correct format
    if (!newEmail || !emailRegex.test(newEmail)) {
        res.status(400).send({ error: 'Invalid or missing new email' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (user[0].email !== currentEmail) {
            res.status(400).send({ error: 'Current email is incorrect' });
            return;
        }

        UserModel.getUserByEmail(newEmail, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'New email already exists' });
                return;
            }

            UserModel.changeEmail(userid, newEmail, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error updating email in the database' });
                    return;
                }

                res.status(200).send({ message: 'Email changed successfully' });
            });
        });
    });
};



const changeUsername = (req, res) => {
    const { userid } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
        res.status(400).send({ error: 'New username is required' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.getUserByUsername(newUsername, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'New username already exists' });
                return;
            }

            UserModel.changeUsername(userid, newUsername, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error updating username in the database' });
                    return;
                }

                res.status(200).send({ message: 'Username changed successfully' });
            });
        });
    });
};



const changeStatus = (req, res) => {
    const { userid } = req.params;
    const { status } = req.body;

    // Check if status is empty
    if (!status) {
        res.status(400).send({ error: 'Status is required' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.updatestatus(userid, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status updated successfully' });
        });
    });
};


const deleteuser = (req, res) => {
    const { userid } = req.params;

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.deleteuser(userid, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Deleteing in the database' });
                return;
            }

            res.status(200).send({ message: 'User Delete successfully' });
        });
    });
};

const deleteusers = (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).send({ error: 'Invalid User IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const userid of userIds) {
        UserModel.getUserById(userid, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                UserModel.deleteuser(userid, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === userIds.length) {
                        const totalCount = userIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all suppliers have been processed
            if (successCount + failCount === userIds.length) {
                const totalCount = userIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};

// Generate token using JWT
function generateToken(email, userrole) {
    const payload = { email, userrole };
    const options = { expiresIn: '1h' }; // Token expiration time

    // Sign the token with the secret key from the .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
}

module.exports = {
    login,
    getAll,
    getUserById,
    findUser,
    addUser,
    updateUser,
    changePassword,
    changeEmail,
    changeStatus,
    deleteuser,
    changeUsername,
    deleteusers,
    updateUserProfiles,
    fogetPassword,
    restPassword,
    newPassword
};                                                                                                                                            
