require('dotenv').config();

const config = require('./config.js');
const mysql = require('mysql2/promise');

const tableInfo = [
  {
    tableName: 'policy',
    fields: [
      { name: 'policy_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'vehicle_type', type: 'INT(255)' },
      { name: 'customer_fullname', type: 'VARCHAR(255)' },
      { name: 'customer_address', type: 'VARCHAR(20)' },
      { name: 'customer_nic', type: 'VARCHAR(20)' },
      { name: 'customer_phone', type: 'INT(10)' },
      { name: 'vehicle_reg_no', type: 'VARCHAR(20)' },
      { name: 'engin_no', type: 'VARCHAR(255)' },
      { name: 'chassis_no', type: 'VARCHAR(255)' },
      { name: 'model', type: 'VARCHAR(255)' },
      { name: 'years_of_make', type: 'INT(20)' },
      { name: 'leasing_company', type: 'VARCHAR(255)' },
      { name: 'vehicle_color', type: 'VARCHAR(255)' },
      { name: 'horse_power', type: 'VARCHAR(20)' },
      { name: 'value_of_vehicle', type: 'VARCHAR(255)' },
      { name: 'use_perpose', type: 'INT(20)' },
      { name: 'cr_image', type: 'VARCHAR(255)' },
      { name: 'vehicle_image', type: 'VARCHAR(255)' },
      { name: 'privious_insurence_card_image', type: 'VARCHAR(255)' },
      { name: 'policy_price', type: 'FLOAT' },
      { name: 'policy_type', type: 'INT(20)' },
      { name: 'policy_status', type: 'INT(20)' },
      { name: 'policy_start_date', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
      { name: 'customer_email', type: 'VARCHAR(255)' },
      { name: 'dealer_id', type: 'INT(255)' },
    ]
  },
  {
    tableName: 'dealer',
    fields: [
      { name: 'dealer_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'dealer_fullname', type: 'VARCHAR(255)' },
      { name: 'dealer_address', type: 'VARCHAR(255)' },
      { name: 'dealer_nic', type: 'VARCHAR(20)' },
      { name: 'dealer_phone', type: 'VARCHAR(255)' },
      { name: 'dealer_whatsapp_number', type: 'VARCHAR(255)' },
      { name: 'dealer_email', type: 'VARCHAR(255)' },
      { name: 'dealer_password', type: 'VARCHAR(255)' },
      { name: 'reg_date', type: 'DATETIME' },
      { name: 'company_id', type: 'INT(255)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ]
  },
  {
    tableName: 'finance_company',
    fields: [
      { name: 'company_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'company_name', type: 'VARCHAR(255)' },
      { name: 'company_branch', type: 'VARCHAR(255)' },
      { name: 'company_address', type: 'VARCHAR(255)' },
      { name: 'company_phone', type: 'VARCHAR(15)' },
      { name: 'company_email', type: 'VARCHAR(255)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ]
  },
  {
    tableName: 'user',
    fields: [
      { name: 'userid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'fullname', type: 'VARCHAR(255)' },
      { name: 'phonenumber', type: 'VARCHAR(15)' },
      { name: 'address', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'username', type: 'VARCHAR(255)' },
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'userrole', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'payment',
    fields: [
      { name: 'paymentid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'dealerid', type: 'INT(255)' },
      { name: 'policyid', type: 'INT(255)' },
      { name: 'policy_amount', type: 'FLOAT' },
      { name: 'qutation', type: 'VARCHAR(255)' },
      { name: 'commition_amount', type: 'FLOAT' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'resetRequest',
    fields: [
      { name: 'resetRequest_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'token', type: 'VARCHAR(255)' },
      { name: 'otp', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'accept', type: 'INT(5)' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },
  {
    tableName: 'paymentaccount',
    fields: [
      { name: 'account_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'dealerid', type: 'VARCHAR(255)' },
      { name: 'account_name', type: 'VARCHAR(255)' },
      { name: 'account_number', type: 'VARCHAR(255)' },
      { name: 'account_bank', type: 'VARCHAR(255)' },
      { name: 'account_bank_branch', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'status', type: 'INT' },
      { name: 'is_delete', type: 'INT' },
    ],
  },
];


// Function to check and set up the tables
async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    await removeUnusedTables(connection, existingTables);

    connection.release();
    pool.end();
  } catch (err) {
    console.error(err);
  }
}

// Function to get existing table names from the database
async function getExistingTables(connection) {
  const [rows] = await connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.connection.database}'`);
  return rows.map(row => row.TABLE_NAME);
}

// Function to create new tables and add indexes if needed
async function createNewTables(connection, existingTables) {
  for (const table of tableInfo) {
    if (!existingTables.includes(table.tableName)) {
      const fieldsString = table.fields.map((field) => `${field.name} ${field.type}`).join(', ');

      // Create the table with the defined fields
      const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
      await connection.query(createQuery);
      console.log(`Table '${table.tableName}' created!`);

      // Add indexes after creating the table
      if (table.indexes) {
        for (const index of table.indexes) {
          const indexQuery = `ALTER TABLE ${table.tableName} ADD INDEX ${index.name} (${index.columns.join(', ')})`;
          await connection.query(indexQuery);
          console.log(`Index '${index.name}' added to table '${table.tableName}'`);
        }
      }
    } else {
      await checkAndAlterFields(connection, table);
    }
  }
}

// Function to check and alter fields in existing tables if needed
async function checkAndAlterFields(connection, table) {
  const [columns] = await connection.query(`SHOW COLUMNS FROM ${table.tableName}`);
  const existingFields = columns.map(column => column.Field);
  const fieldsToAdd = table.fields.filter(field => !existingFields.includes(field.name));
  const fieldsToRemove = existingFields.filter(field => !table.fields.some(f => f.name === field));

  if (fieldsToAdd.length > 0) {
    await addFieldsToTable(connection, table.tableName, fieldsToAdd);
  }

  if (fieldsToRemove.length > 0) {
    await removeFieldsFromTable(connection, table.tableName, fieldsToRemove);
  }
}

// Function to add new fields to an existing table
async function addFieldsToTable(connection, tableName, fieldsToAdd) {
  for (const field of fieldsToAdd) {
    const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${field.name} ${field.type}`;
    await connection.query(addQuery);
    console.log(`Field '${field.name}' added to table '${tableName}'`);
  }
}

// Function to remove fields from an existing table
async function removeFieldsFromTable(connection, tableName, fieldsToRemove) {
  for (const field of fieldsToRemove) {
    const removeQuery = `ALTER TABLE ${tableName} DROP COLUMN ${field}`;
    await connection.query(removeQuery);
    console.log(`Field '${field}' removed from table '${tableName}'`);
  }
}

// Uncomment and use this function to remove unused tables

async function removeUnusedTables(connection, existingTables) {
  for (const existingTable of existingTables) {
    const tableExists = tableInfo.some(table => table.tableName === existingTable);
    if (!tableExists) {
      const removeQuery = `DROP TABLE ${existingTable}`;
      await connection.query(removeQuery);
      console.log(`Table '${existingTable}' removed`);
    }
  }
}


// Export the necessary functions and tableInfo
module.exports = { checkTables, tableInfo };
