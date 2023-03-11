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


app.get('/data', (req, res) => {
  connection.query('SELECT * FROM test1', (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from database' });
      return;
    }

    res.send(results);
  });
});

app.get('/policy/getAllpolicy', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${policy_table.tableName}`);
    const rows = result[0];
    res.json(rows);
    console.log(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data from database' });
  }
});

// //create post to add data to database

//single is used to upload single file
// app.post('/policy/addpolicy', upload.single('cr_image'), async (req, res) => {

//   const fieldsString = policy_table.fields.map(field => `${field.name}`).join(', ');
//   const fieldsparameters = policy_table.fields.map(field => `?`).join(', ');

//   //create new array with only the field names
//   const fields = policy_table.fields.map(field => `${field.name}`);

//   //create new array with only the field values
//   const values = fields.map(field => (field === 'cr_image' ? req.file.filename : req.body[field]));
//   console.log("fieldsString", fieldsString);
//   console.log("fieldsparameters", fieldsString);

//   try {
//     await pool.query(`INSERT INTO ${policy_table.tableName} (${fieldsString}) VALUES (${fieldsparameters})`, values);
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to insert data into database' });
//   }
// });

//multiple is used to upload multiple files
app.post('/policy/addpolicy', policyupload.fields([{ name: 'cr_image' }, { name: 'vehicle_image' }, { name: 'previous_insurance_card_image' }]), async (req, res) => {
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
      } else if (field === 'previous_insurance_card_image') {
        return req.files['previous_insurance_card_image'][0].filename;
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



//normal data manage
// app.post('/policy/addpolicy', upload.single('image'), async (req, res) => {
//   const fieldsString = policy_table.fields.map(field => `${field.name}`).join(', ');
//   const fieldsparameters = policy_table.fields.map(field => `?`).join(', ');
//   //create new array with only the field names
//   const fields = policy_table.fields.map(field => `${field.name}`);
//   //create new array with only the field values
//   const values = fields.map(field => req.body[field]);
//   console.log("fieldsString", fieldsString);
//   console.log("fieldsparameters", fieldsString);

//   try {
//     await pool.query(`INSERT INTO ${policy_table.tableName} (${fieldsString}) VALUES (${fieldsparameters})`, values);
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to insert data into database' });
//   }
// });

app.post('/addtest2', async (req, res) => {
  const { email, phone, address } = req.body;
  try {
    await pool.query('INSERT INTO test2 (email, phone, address) VALUES (?, ?, ?)', [email, phone, address]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert data into database' });
  }
});


const server = app.listen(config.port, () => {
  if (server.address().port === config.port) {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
  }else{
    console.log(`Server running at http://${config.hostname}:${server.address().port}/`);
  }
  checkTables();
 
});
