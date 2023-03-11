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
const pool = mysql.createPool(config.connection);

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