// Description: This is the main entry point of the application
// Server is listening on port 3002
const hostname = '127.0.0.1';
const port = 3002;

// Importing the express module
const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');  
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ceylinco_vip_appdb'
});



app.get('/data', (req, res) => {
    connection.query('SELECT * FROM test', (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from database' });
            return;
        }

        res.send(results);
    });
});

// app.delete('/deletedata2', (req, res) => {
//     console.log(req.query.id);
//     const id = req.query.id;
    
//     const query = `DELETE FROM test WHERE id = ${id}`;

//     connection.query(query, (error, results) => {
//         if (error) {
//             res.status(500).send({ error: 'Error fetching data from database' });
//             return;
//         }

//         res.send({ success: 'Delete successfully' });
//     });
// });

// app.delete('/deletedata/:id', (req, res) => {
//     console.log(req.params.id);
//     const id = req.params.id;

//     const query = `DELETE FROM test WHERE id = ${id}`;
//     connection.query(query, (error, results) => {
//         if (error) {
//             res.status(500).send({ error: 'Error deleting data from database' });
//             return;
//         }

//         res.send({ success: 'Data deleted successfully' });
//     });
// });

// //create post to add data to database
app.post('/adddata', (req, res) => {

    const name = req.body.name;
    const age = req.body.age;

    const query = `INSERT INTO test(name, age) VALUES('${name}','${age}')`;

    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error inserting data into database' });
            return;
        }

        res.send({ success: 'Data inserted successfully' });
    });
});

app.get('/test', (req, res) => {
    res.send('Full Insurance!');
});


var server = app.listen(port, function () {
    console.log('Server is running..');
    console.log(`Server running at http://${hostname}:${port}/`);
});