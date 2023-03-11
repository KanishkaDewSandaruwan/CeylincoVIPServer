// Description: This is the main entry point of the application
// Server is listening on port 3002
//Here we can use pool or connection to connect to database but when we use pool we get error that pool is not a function
// Importing the express module
const { config, pool, connection, app, bodyParser, cors, morgan, multer, upload, fs, path, express } = require('./connection/header.js');
const { checkTables, tableInfo } = require('./databse_handle/table.js');
const { error, Console } = require('console');
const policyupload = require('./connection/file_upload.js');

const policy_table = tableInfo[0];


app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Get all data from a table
app.get('/api/all/:tableName', (req, res) => {
  const tableName = req.params.tableName;
  connection.query(`SELECT * FROM ${tableName}`, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from database' });
      return;
    }

    res.send(results);
  });
});

// Get a single row from a table
app.get('/api/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  connection.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from database' });
      return;
    }

    res.send(results[0]);
  });
});

//get data from policy table by policy number
app.get('/api/policy/:policy_number', (req, res) => {
  const policy_number = req.params.policy_number;
  connection.query(`SELECT * FROM policy WHERE policy_number = ?`, [policy_number], (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from database' });
      return;
    }

    res.send(results[0]);
  });
});



// Update a row in a table
app.put('/api/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  const fields = tableInfo.find(table => table.tableName === tableName).fields.map(field => `${field.name} = ?`).join(', ');
  const values = tableInfo.find(table => table.tableName === tableName).fields.map(field => req.body[field.name]);
  values.push(id);

  connection.query(`UPDATE ${tableName} SET ${fields} WHERE id = ?`, values, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error updating data in database' });
      return;
    }

    res.send(results);
  });
});

// Delete a row from a table
app.delete('/api/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  connection.query(`DELETE FROM ${tableName} WHERE id = ?`, [id], (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting data from database' });
      return;
    }

    res.send(results);
  });
});

//multiple is used to upload multiple files in policy table
app.post('/api/policy/addpolicy', policyupload.fields([{ name: 'cr_image' }, { name: 'vehicle_image' }, { name: 'privious_insurence_card_image' }]), async (req, res) => {
  try {
    // Check if all required fields and files are present

    const fieldsString = policy_table.fields.map(field => `${field.name}`).join(', ');
    const fieldsparameters = policy_table.fields.map(field => `?`).join(', ');

    //create new array with only the field names
    const fields = policy_table.fields.map(field => `${field.name}`);

    //create new array with only the field values
    const values = fields.map(field => {
      if (field === 'cr_image') {
        return req.files['cr_image'][0].filename;
      } else if (field === 'vehicle_image') {
        return req.files['vehicle_image'][0].filename;
      } else if (field === 'privious_insurence_card_image') {
        return req.files['privious_insurence_card_image'][0].filename;
      } else {
        return req.body[field];
      }
    });

    console.log("fieldsString", fieldsString);
    console.log("fieldsparameters", fieldsparameters);

    await pool.query(`INSERT INTO ${policy_table.tableName} (${fieldsString}) VALUES (${fieldsparameters})`, values);
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert data into database' });
  }
});


app.use('/upload/policy', express.static('policy'))

const server = app.listen(config.port, () => {
  if (server.address().port === config.port) {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
  }else{
    console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
  }
  checkTables();
 
});
