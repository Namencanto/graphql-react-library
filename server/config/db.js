const { Pool } = require("pg");

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "library ",
  password: "()@_%I$2kcsasfA",
  port: 5432,
});

module.exports = db;
