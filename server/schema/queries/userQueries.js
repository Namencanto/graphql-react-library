const { GraphQLID, GraphQLList } = require("graphql");
const UserType = require("../types/userType.js");
const db = require("../../config/db.js");
const jwt = require("jsonwebtoken");

const UserQueries = {
  fields: {
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        const query = "SELECT * FROM users";
        const { rows } = await db.query(query);
        return rows;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const query = "SELECT * FROM users WHERE id = $1";
        const { rows } = await db.query(query, [args.id]);
        return rows[0];
      },
    },
    verifyUser: {
      type: UserType,
      async resolve(parent, args, context) {
        const token = context.req.cookies.jwt;
        if (!token) {
          return null;
        }
        try {
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

          // Check if user exists
          const { rows } = await db.query(
            "SELECT id, name, admin FROM library.users WHERE id = $1",
            [userId]
          );

          return rows[0];
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    },
  },
};

module.exports = UserQueries;
