const { GraphQLID, GraphQLList } = require("graphql");
const UserType = require("../types/userType.js");
const db = require("../../config/db.js");

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
  },
};

module.exports = UserQueries;
