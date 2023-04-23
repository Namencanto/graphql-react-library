import { gql } from "@apollo/client";

const GET_USERS = gql`
  query getClients {
    clients {
      id
      name
      email
      phone
    }
  }
`;

const GET_USER = gql`
  query getClient {
    clients {
      id
      name
      email
      phone
    }
  }
`;

const VERIFY_USER = gql`
  query {
    verifyUser {
      id
      name
      admin
    }
  }
`;

export { GET_USERS, GET_USER, VERIFY_USER };
