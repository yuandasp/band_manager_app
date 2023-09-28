const mysql = require("mysql2");
const util = require("util");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectTimeout: 20000,
};

const dbConfigTest = {
  host: process.env.DB_HOST_TEST,
  user: process.env.DB_USER_TEST,
  password: process.env.DB_PASSWORD_TEST,
  database: process.env.DB_DATABASE_TEST,
  port: process.env.DB_PORT_TEST,
  connectTimeout: 20000,
};

let config = {};

if (process.env.NODE_ENV === "test") {
  config = dbConfigTest;
} else {
  config = dbConfig;
}

const db = mysql.createConnection(config);

db.connect((err) => {
  if (err) {
    return console.error(`error: ${err.message}`);
  } else {
    console.log("Connected to mysql server");
  }
});

const query = util.promisify(db.query).bind(db);
module.exports = { db, query };
