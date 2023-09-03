const { connection } = require('../../config/connection');
const bcrypt = require('bcrypt');

const UserModel = {
  getUserByUsernameAndPassword(username, password, callback) {
    connection.query('SELECT * FROM user WHERE username = ? AND is_delete = 0 AND status = 1', [username], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (results.length === 0) {
        // User with the provided username not found
        callback(null, null);
        return;
      }

      const storedPasswordHash = results[0].password;

      // Compare the provided password with the stored password hash using bcrypt
      bcrypt.compare(password, storedPasswordHash, (err, isMatch) => {
        if (err) {
          callback(err, null);
          return;
        }

        if (isMatch) {
          // Passwords match, return the user's data
          const user = results[0];
          callback(null, user);
        } else {
          // Passwords do not match
          callback(null, null);
        }
      });
    });
  },

  saveUserToken(userId, token, callback) {
    connection.query('UPDATE user SET apitoken = ? WHERE userid = ?', [token, userId], callback);
  },

  getAll(callback) {
    connection.query('SELECT * FROM user WHERE is_delete = 0 AND username != "admin"', callback);
  },

  getUserById(userid, callback) {
    connection.query('SELECT * FROM user WHERE userid = ? AND is_delete = 0', [userid], callback);
  },

  getUserByEmail(email, callback) {
    connection.query('SELECT * FROM user WHERE email = ? AND is_delete = 0', [email], callback);
  },

  getUserByPhonenumber(phonenumber, callback) {
    connection.query('SELECT * FROM user WHERE phonenumber = ? AND is_delete = 0', [phonenumber], callback);
  },

  getUserByUsername(username, callback) {
    connection.query('SELECT * FROM user WHERE username = ? AND is_delete = 0', [username], callback);
  },

  addUser(user, callback) {
    const { fullname, phonenumber, address, email, username, password, userrole } = user;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultvalues = 0;

    // Hash the password before inserting it into the database
    bcrypt.hash(password, 10, (err, hash) => { // 10 is the number of bcrypt salt rounds
      if (err) {
        callback(err, null);
        return;
      }

      const query = 'INSERT INTO user (fullname, phonenumber, address, email, username, password, userrole, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [fullname, phonenumber, address, email, username, hash, userrole, trndate, defaultvalues, defaultvalues];

      connection.query(query, values, (error, results) => {
        if (error) {
          callback(error, null);
          return;
        }

        const userId = results.insertId;
        callback(null, userId);
      });
    });
  },

  updateUser(user, userid, callback) {
    const { fullname, phonenumber, address, userrole, status } = user;
    console.log(fullname)
    const query = 'UPDATE user SET fullname = ?, phonenumber = ?, address = ?, userrole = ?, status = ? WHERE userid = ?';
    const values = [fullname, phonenumber, address, userrole, status, userid];

    connection.query(query, values, callback);
  },

  updateUserProfile(fullname, phonenumber, address, email, userid, callback) {

    const query = 'UPDATE user SET fullname = ?, phonenumber = ?, address = ?, email = ? WHERE userid = ?';
    const values = [fullname, phonenumber, address, email, userid];

    connection.query(query, values, callback);
  },

  updateUserPassword(userid, newPassword, callback) {
    const query = 'UPDATE user SET password = ? WHERE userid = ?';
    const values = [newPassword, userid];

    connection.query(query, values, callback);
  },

  updatePasswordByEmail(email, newPassword, callback) {
    const query = 'UPDATE user SET password = ? WHERE email = ?';
    const values = [newPassword, email];

    connection.query(query, values, callback);
  },

  changeEmail(userid, newEmail, callback) {
    const query = 'UPDATE user SET email = ? WHERE userid = ?';
    const values = [newEmail, userid];

    connection.query(query, values, callback);
  },

  changeUsername(userid, username, callback) {
    const query = 'UPDATE user SET username = ? WHERE userid = ?';
    const values = [username, userid];

    connection.query(query, values, callback);
  },

  updatestatus(userid, status, callback) {
    const query = 'UPDATE user SET status = ? WHERE userid = ?';
    const values = [status, userid];

    connection.query(query, values, callback);
  },

  deleteuser(userid, value, callback) {
    const query = 'UPDATE user SET is_delete = ? WHERE userid = ?';
    const values = [value, userid];

    connection.query(query, values, callback);
  },

  perma_deleteuser(userid, callback) {
    const query = 'DELETE FROM user WHERE userid = ?';
    const values = [userid];

    connection.query(query, values, callback);
  },

  userById(userid) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM user WHERE userid = ?', [userid], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },

  userByEmail(email) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = UserModel;
