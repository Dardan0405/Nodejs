const mysql = require("mysql2")

//Connect withDB
const pool = mysql.createPool({
    host:'localhost',
    user:"root",
    database: 'node-complete',
    password:"dardan"
});
module.exports = pool.promise();
