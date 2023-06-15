require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    options: {
        encrypt: true // use encryption to secure the connection (recommended)
    }
};