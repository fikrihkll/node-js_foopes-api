const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'foopes_db',
    password: ''
});

conn.connect();

module.exports = conn;