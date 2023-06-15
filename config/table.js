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
      { name: 'policy_price', type: 'INT(255)' },
      { name: 'policy_type', type: 'INT(20)' },
      { name: 'policy_status', type: 'INT(20)' },
      { name: 'policy_start_date', type: 'DATETIME' },
      { name: 'status', type: 'INT(5)' },
      { name: 'is_delete', type: 'INT(5)' },
      { name: 'customer_email', type: 'INT(5)' },
    ]
  },
  {
    tableName: 'dealer',
    fields: [
      { name: 'dealer_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'dealer_fullname', type: 'VARCHAR(255)' },
      { name: 'dealer_address', type: 'VARCHAR(255)' },
      { name: 'dealer_nic', type: 'VARCHAR(20)' },
      { name: 'dealer_phone', type: 'INT(10)' },
      { name: 'dealer_whatsapp_number', type: 'INT(10)' },
      { name: 'dealer_email', type: 'VARCHAR(255)' },
      { name: 'dealer_image', type: 'VARCHAR(255)' },
      { name: 'dealer_password', type: 'VARCHAR(255)' },
      { name: 'dealer_status', type: 'INT(20)' },
      { name: 'dealer_reg_date', type: 'DATETIME' },
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
      { name: 'company_phone', type: 'INT(10)' },
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
      { name: 'phonenumber', type: 'INT(10)' },
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
];


async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    // await removeUnusedTables(connection, existingTables);

    connection.release();
    pool.end();
  } catch (err) {
    console.error(err);
  }
}

async function getExistingTables(connection) {
  const [rows] = await connection.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.connection.database}'`);
  return rows.map(row => row.TABLE_NAME);
}

async function createNewTables(connection, existingTables) {
  for (const table of tableInfo) {
    if (!existingTables.includes(table.tableName)) {
      const fieldsString = table.fields.map((field) => `${field.name} ${field.type}`).join(', ');
      const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
      await connection.query(createQuery);
      console.log(`Table '${table.tableName}' created!`);
    } else {
      await checkAndAlterFields(connection, table);
    }
  }
}

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

async function addFieldsToTable(connection, tableName, fieldsToAdd) {
  for (const field of fieldsToAdd) {
    const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${field.name} ${field.type}`;
    await connection.query(addQuery);
    console.log(`Field '${field.name}' added to table '${tableName}'`);
  }
}

async function removeFieldsFromTable(connection, tableName, fieldsToRemove) {
  for (const field of fieldsToRemove) {
    const removeQuery = `ALTER TABLE ${tableName} DROP COLUMN ${field}`;
    await connection.query(removeQuery);
    console.log(`Field '${field}' removed from table '${tableName}'`);
  }
}

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

module.exports = { checkTables, tableInfo };
