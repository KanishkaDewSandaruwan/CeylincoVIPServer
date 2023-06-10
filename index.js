// Description: This is the main entry point of the application
// Server is listening on port 3002
//Here we can use pool or connection to connect to database but when we use pool we get error that pool is not a function
// Importing the express module
const { config, pool, connection, app, bodyParser, cors, morgan, multer, upload, fs, path, express } = require('./connection/header.js');
const { checkTables, tableInfo } = require('./databse_handle/table.js');
const { error, Console } = require('console');
const { policyupload, uploadCRImage } = require('./connection/file_upload.js');

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
app.delete('/api/delete/:tableName/:id', (req, res) => {
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

// Function to handle image upload and update
function uploadAndUpdateImage(req, res, tableName, fieldName) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const id = req.params.id;
  const filename = req.file.filename;

  connection.query(`UPDATE ?? SET ${fieldName} = ? WHERE policy_id = ?`, [tableName, filename, id], (error, results) => {
    if (error) {
      console.error('Error updating data in the database:', error);
      return res.status(500).json({
        success: false,
        error: 'Error updating data in the database'
      });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      filename: filename,
      results: results // include the results of the query in the response
    });
  });
}

// Route for uploading CR image
app.post('/api/upload/policy/crimage/:id', uploadCRImage.single('image'), (req, res) => {
  const tableName = 'policy';
  const fieldName = 'cr_image';
  uploadAndUpdateImage(req, res, tableName, fieldName);
});

// Route for uploading vehicle image
app.post('/api/upload/policy/vehicleimage/:id', uploadCRImage.single('image'), (req, res) => {
  const tableName = 'policy';
  const fieldName = 'vehicle_image';
  uploadAndUpdateImage(req, res, tableName, fieldName);
});

// Route for uploading previous card image
app.post('/api/upload/policy/previouscardimage/:id', uploadCRImage.single('image'), (req, res) => {
  const tableName = 'policy';
  const fieldName = 'privious_insurence_card_image';
  uploadAndUpdateImage(req, res, tableName, fieldName);
});


// Multiple files can be uploaded to the policy table
app.post('/api/policy/addpolicy', async (req, res) => {
  try {
    // Check if all required fields and files are present
    const tableName = 'policy';

    const fieldsString = tableInfo.find(table => table.tableName === tableName).fields.map(field => `${field.name}`).join(', ');
    const fieldsParameters = tableInfo.find(table => table.tableName === tableName).fields.map(() => '?').join(', ');

    // Create a new array with only the field names
    const fields = tableInfo.find(table => table.tableName === tableName).fields.map(field => field.name);

    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
    const values = fields.map(field => {
      if (field === 'policy_start_date') {
        return currentDate; // Set the current date for policy_start_date
      }
      return req.body[field];
    });

    connection.query(`INSERT INTO ${tableName} (${fieldsString}) VALUES (${fieldsParameters})`, values, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting data into the database' });
        return;
      }
      const policyId = result.insertId;
      res.json({ success: true, policy_id: policyId });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert data into the database' });
  }
});


app.use('/upload/policy', express.static('policy'))

const server = app.listen(config.port, () => {
  if (server.address().port === config.port) {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
  } else {
    console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
  }
  checkTables();

});
