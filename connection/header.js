const config = require('./config.js');
const mysql = require('mysql');
const mysql2 = require('mysql2/promise');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');  

const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const morgan = require('morgan');

// const connection = mysql.createConnection(config.connection);
const connection = mysql.createConnection(config.connection);
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // adjust the limit based on your needs
  // other connection options if required
});

// connect();
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error Pool connecting to database:', err);
    return;
  }

  console.log('Pool Connected to MySQL database');
});



function connect() {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }

    console.log('Connected to MySQL database');
  });
}

module.exports = {
    config,
    connection, connect,
    pool,
    app,
    bodyParser,
    express,
    cors,
    path,
    fs,
    multer,
    upload,
    morgan,
};