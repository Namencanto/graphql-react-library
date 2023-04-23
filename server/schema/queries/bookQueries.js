const { GraphQLID, GraphQLList } = require("graphql");
const db = require("../../config/db.js");

const BookType = require("../types/bookType.js");

const BookQueries = {
  fields: {
    getBook: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, { id }, context) {
        // Check if user is authenticated
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        // Get book by ID from the database
        const bookQuery = {
          text: "SELECT * FROM library.books WHERE id = $1",
          values: [id],
        };
        const { rows } = await db.query(bookQuery);
        const book = rows[0];

        // Return book
        return book;
      },
    },

    getAllBooks: {
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

    getAllAvailableBooks: {
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
