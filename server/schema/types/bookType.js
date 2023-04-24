const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");
const UserType = require("./userType.js");

// PostgreSQL User
const db = require("../../config/db.js");

// Book Type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    isbn: { type: GraphQLString },
    author: { type: GraphQLString },
    borrowedBy: {
      type: UserType,
      async resolve(parent, args) {
        if (parent.borrowed_by === 0) {
          return null;
        }
        const UserQuery = {
          text: "SELECT * FROM library.users WHERE id = $1",
          values: [parent.borrowed_by],
        };
        const { rows } = await db.query(UserQuery);
        return rows[0];
      },
    },
  }),
});

module.exports = BookType;
