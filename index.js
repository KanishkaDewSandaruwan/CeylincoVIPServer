    const { connection, config } = require('./config/connection');
    const bodyParser = require('body-parser');
    const express = require('express');
    const app = express();
    const routeHandler = require('./src/routes/index');

    const { checkTables } = require('./config/table');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use('/api', routeHandler(config));

    app.all('*', (req, res) => {
        res.status(404).send({
            error: 'resource not found',
        });
    });

    const server = app.listen(config.port, () => {
        console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
        checkTables();
    });
