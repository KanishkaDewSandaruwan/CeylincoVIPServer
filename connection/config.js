require('dotenv').config();

module.exports = {
  hostname: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 3002,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
      encrypt: true // use encryption to secure the connection (recommended)
    }
  }
};