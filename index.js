const { connection, config } = require('./config/connection');
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const routeHandler = require('./src/routes/index');
const fs = require('fs');

const { checkTables } = require('./config/table');
const path = require('path');


const file = fs.readFileSync('./9C73DE1D0432DC480820A9D825991163.txt')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    const allowedOrigins = [
        'http://localhost:3000',
        'https://backend.policycollector.xyz/'
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token, x-token-dealer'); // Include 'x-token' header
    next();
});

app.get('/.well-known/pki-validation/9C73DE1D0432DC480820A9D825991163.txt', (req, res) => {
    // Construct the absolute file path using the 'path' module
    const filePath = path.join(__dirname, '9C73DE1D0432DC480820A9D825991163.txt');
    
    // Send the file using the correct absolute file path
    res.sendFile(filePath);
});

app.use('/api', routeHandler(config));

app.all('*', (req, res) => {
    res.status(404).send({
        error: 'resource not found',
    });
});

const server = app.listen(config.port || 80, () => {
    console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
    checkTables();
});
