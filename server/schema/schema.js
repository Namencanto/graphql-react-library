const { GraphQLObjectType, GraphQLSchema } = require("graphql");

// Queries
const UserQueries = require("./queries/userQueries.js");
const BookQueries = require("./queries/bookQueries.js");

// Mutations
const UserMutations = require("./mutations/UserMutations.js");
const BookMutations = require("./mutations/BookMutations.js");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...UserQueries.fields,
    ...BookQueries.fields,
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...UserMutations.fields,
    ...BookMutations.fields,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
