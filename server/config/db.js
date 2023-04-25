const { Pool } = require("pg");

const parse = require("pg-connection-string").parse;

const connectionOptions = parse(process.env.POSTGRES_CONNECT_STRING);

const db = new Pool({
  user: connectionOptions.user,
  host: connectionOptions.host,
  database: connectionOptions.database,
  password: connectionOptions.password,
  port: connectionOptions.port,
  ssl: true,
});

module.exports = db;
