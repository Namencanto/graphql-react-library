const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = require("graphql");
const db = require("../../config/db.js");
const BookType = require("../types/bookType.js");

const jwt = require("jsonwebtoken");

const Joi = require("joi");

const addBookSchema = Joi.object({
  name: Joi.string().required(),
  isbn: Joi.string().max(13).required(),
  author: Joi.string().required(),
});

const BookMutations = {
  // * MUTATIONS FOR ADMIN USERS
  fields: {
    // Add a project
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        isbn: { type: GraphQLNonNull(GraphQLID) },
        author: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { name, isbn, author }, context) {
        // Validate arguments
        const { error } = addBookSchema.validate({ name, isbn, author });
        if (error) {
          throw new Error(`Invalid input: ${error.message}`);
        }

        // Check if user is authenticated and is an admin
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          console.log(err);
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        const user = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );
        if (user.rows.length === 0) {
          throw new Error("User not found");
        }
        if (!user.rows[0].admin) {
          throw new Error("You do not have permission to add books");
        }

        // Insert new book into the database
        const bookQuery = {
          text: "INSERT INTO library.books (name, isbn, author, borrowed_by) VALUES ($1, $2, $3, $4) RETURNING *",
          values: [name, isbn, author, 0],
        };
        const { rows } = await db.query(bookQuery);

        // Return newly created book
        return rows[0];
      },
    },

    // Delete a book
    deleteBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, { id }, context) {
        // Check if user is authenticated and is an admin
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        const user = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );
        const book = await db.query(
          "SELECT id FROM library.books WHERE id = $1",
          [id]
        );

        if (book.length === 0) {
          throw new Error("Book not found");
        }
        if (!user.rows[0].admin) {
          throw new Error("You do not have permission to delete books");
        }

        // Delete the book from the database
        const bookQuery = {
          text: "DELETE FROM library.books WHERE id = $1 RETURNING *",
          values: [id],
        };
        const { rows } = await db.query(bookQuery);

        // Return deleted book
        return rows[0];
      },
    },

    // Update a book
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        isbn: { type: GraphQLString },
        author: { type: GraphQLString },
        borrowed_by: { type: GraphQLInt },
      },
      async resolve(parent, { id, name, isbn, author, borrowed_by }, context) {
        // Check if user is authenticated and is an admin
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        const book = await db.query(
          "SELECT id FROM library.books WHERE id = $1",
          [id]
        );
        if (book.length === 0) {
          throw new Error("Book not found");
        }

        const user = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );
        if (user.rows.length === 0) {
          throw new Error("User not found");
        }
        if (!user.rows[0].admin) {
          throw new Error("You do not have permission to update books");
        }

        // Update book in the database
        const updateFields = [];
        const values = [id];
        if (name !== undefined) {
          updateFields.push(`name = $${updateFields.length + 2}`);
          values.push(name);
        }
        if (isbn !== undefined) {
          updateFields.push(`isbn = $${updateFields.length + 2}`);
          values.push(isbn);
        }
        if (author !== undefined) {
          updateFields.push(`author = $${updateFields.length + 2}`);
          values.push(author);
        }
        if (borrowed_by !== undefined) {
          updateFields.push(`borrowed_by = $${updateFields.length + 2}`);
          values.push(borrowed_by);
        }

        if (updateFields.length === 0) {
          throw new Error("At least one field must be provided to update");
        }

        const bookQuery = {
          text: `UPDATE library.books SET ${updateFields.join(
            ", "
          )} WHERE id = $1 RETURNING *`,
          values,
        };
        const { rows } = await db.query(bookQuery);

        // Return updated book
        return rows[0];
      },
    },

    // * MUTATIONS FOR COMMON USERS
    borrowBook: {
      type: BookType,
      args: {
        bookId: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { bookId }, context) {
        // Check if user is authenticated
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        const user = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );
        if (user.rows.length === 0) {
          throw new Error("User not found");
        }

        // Check if the book exists
        const book = await db.query(
          "SELECT * FROM library.books WHERE id = $1",
          [bookId]
        );
        if (book.rows.length === 0) {
          throw new Error("Book not found");
        }

        // Check if the book is already borrowed
        if (book.rows[0].borrowed_by !== 0) {
          throw new Error("Book already borrowed");
        }

        if (user.rows[0].admin) {
          throw new Error("Admin cannot borrow books");
        }

        // Update the book to mark it as borrowed
        const borrowQuery = {
          text: "UPDATE library.books SET borrowed_by = $1 WHERE id = $2 RETURNING *",
          values: [userId, bookId],
        };
        const { rows } = await db.query(borrowQuery);

        // Return updated book
        return rows[0];
      },
    },
    returnBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { id }, context) {
        // Check if user is authenticated and is not an admin
        const jwtToken = context.req.cookies.jwt;
        if (!jwtToken) {
          throw new Error("Authentication required");
        }

        let decodedToken;
        try {
          decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);
        } catch (err) {
          throw new Error("Invalid token");
        }
        const userId = decodedToken.userId;

        const user = await db.query(
          "SELECT * FROM library.users WHERE id = $1",
          [userId]
        );
        if (user.rows.length === 0) {
          throw new Error("User not found");
        }
        if (user.rows[0].admin) {
          throw new Error("Admin cannot return books");
        }

        // Find book and check if it is borrowed by the user
        const bookQuery = {
          text: "SELECT * FROM library.books WHERE id = $1",
          values: [id],
        };
        const bookResult = await db.query(bookQuery);
        if (bookResult.rows.length === 0) {
          throw new Error("Book not found");
        }
        const book = bookResult.rows[0];
        if (book.borrowed_by === 0) {
          throw new Error("This book is not borrowed");
        }
        if (book.borrowed_by !== userId) {
          throw new Error("This book is borrowed by someone else");
        }

        // Update borrowed_by to 0
        const updateQuery = {
          text: "UPDATE library.books SET borrowed_by = 0 WHERE id = $1 RETURNING *",
          values: [id],
        };
        const { rows } = await db.query(updateQuery);

        // Return updated book
        return rows[0];
      },
    },
  },
};

module.exports = BookMutations;
