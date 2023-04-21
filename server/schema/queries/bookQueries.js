const { GraphQLID, GraphQLList } = require("graphql");
const db = require("../../config/db.js");

const BookType = require("../types/bookType.js");

const BookQueries = {
  fields: {
    displayAllBooks: {
      type: new GraphQLList(BookType),
      async resolve(parent, args, context) {
        // Check if user is authenticated
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        // Get all books from the database
        const { rows } = await db.query("SELECT * FROM library.books");

        // Return list of books
        return rows;
      },
    },
    displayAllAvailableBooks: {
      type: new GraphQLList(BookType),
      async resolve(parent, args, context) {
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        const booksQuery = {
          text: "SELECT * FROM library.books WHERE borrowed_by = $1",
          values: [0],
        };
        const { rows } = await db.query(booksQuery);

        return rows;
      },
    },
  },
};

module.exports = BookQueries;
