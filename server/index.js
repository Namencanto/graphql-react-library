const express = require("express");
const colors = require("colors");

const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();
const schema = require("./schema/schema.js");
const port = process.env.PORT || 3001;
const db = require("./config/db.js");
const cookieParser = require("cookie-parser");
const path = require("path");

const dotenv = require("dotenv");

const app = express();

app.use(
  cors({
    origin:
      process.env.APP_URL || "https://graphql-react-library.onrender.com/",
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

if (process.env.SERVER_IS_PRODUCTION) {
  app.use(
    "/static",
    express.static(path.resolve(__dirname, "../client/build/static"))
  );
  app.use(
    "/static",
    express.static(path.resolve(__dirname, "../client/build"))
  );
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
  );
}

app.listen(port, console.log(`Running a GraphQL API server at ${port} port`));
