const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
});

conn.connect();

module.exports = conn;