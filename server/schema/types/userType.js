const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    login: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    admin: { type: GraphQLBoolean },
  }),
});

module.exports = UserType;
