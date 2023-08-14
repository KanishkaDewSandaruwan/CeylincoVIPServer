const { connection, config } = require('./config/connection');
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const routeHandler = require('./src/routes/index');
const fs = require('fs');

const { checkTables } = require('./config/table');


const file = fs.readFileSync('./5CC63538058B6205F8561A80B30B1F31.txt')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token, x-token-dealer'); // Include 'x-token' header
    next();
});

app.get('/.well-known/pki-validation/5CC63538058B6205F8561A80B30B1F31.txt',  (req, res) => {
    res.sendFile('./home/ubuntu/CeylincoVIPServer/5CC63538058B6205F8561A80B30B1F31.txt');
});

app.use('/api', routeHandler(config));

app.all('*', (req, res) => {
    res.status(404).send({
        error: 'resource not found',
    });
});

const server = app.listen(config.port || 3002, () => {
    console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
    checkTables();
});
