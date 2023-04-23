const express = require("express");
const colors = require("colors");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();
const schema = require("./schema/schema.js");
const port = process.env.PORT || 3001;
const db = require("./config/db.js");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
dotenv.config();
// Connect to pg database
db.connect((err) => {
  if (err) {
    console.error(
      `Error connecting to PostgreSQL: ${err.message}`.red.underline.bold
    );
    process.exit(1);
  } else {
    console.log(`PostgreSQL Connected`.cyan.underline.bold);
  }
});

app.use(
  "/graphql",
  cookieParser(),

  graphqlHTTP((req, res) => ({
    schema,
    graphiql: process.env.NODE_ENV === "development",
    context: { req, res }, // pass req object to the context
  }))
);

app.listen(port, console.log(`Running a GraphQL API server at ${port} port`));
