const mysql = require("mysql2");

// Setting port xampp sesuai dengan config xampp di device
const db = mysql.createConnection({
  host: "localhost",
  database: "db_donspedia",
  user: "root",
  password: "",
  port: 3308,
});

module.exports = db;
