const config = require('../connection/config.js');
const mysql = require('mysql2/promise');

const tableInfo = [
  {
    tableName: 'policy',
    fields: [
      { name: 'policy_id', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
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
      { name: 'policy_start_date', type: 'DATE' }, 
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
      { name: 'dealer_reg_date', type: 'DATE' }, 
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
    ]
  }
];

async function checkTables() {
  try {
    const pool = mysql.createPool(config.connection);

    for (let i = 0; i < tableInfo.length; i++) {
      const table = tableInfo[i];
      const query = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${table.tableName}'`;
      const [rows, fields] = await pool.query(query);

      if (rows.length > 0) {
        console.log(`Table '${table.tableName}' exists!`);
      } else {
        const fieldsString = table.fields.map(field => `${field.name} ${field.type}`).join(', ');
        const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
        const [rows, fields] = await pool.query(createQuery);
        console.log(`Table '${table.tableName}' created!`);
      }
    }

    pool.end();
  } catch (err) {
    console.error(err);
  }
}

module.exports = { checkTables, tableInfo };
