import { gql } from "@apollo/client";

const ADD_USER = gql`
  mutation addUser(
    $login: String!
    $name: String!
    $password: String!
    $admin: Boolean!
  ) {
    addUser(login: $login, name: $name, password: $password, admin: $admin) {
      id
      login
      name
      admin
    }
  }
`;

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

const LOGOUT_USER = gql`
  mutation logout {
    logout
  }
`;

const LOGIN_USER = gql`
  mutation loginUser($login: String!, $password: String!, $admin: Boolean!) {
    loginUser(login: $login, password: $password, admin: $admin) {
      id
      name
      admin
    }
  }
`;

export { ADD_USER, DELETE_CLIENT, LOGIN_USER, LOGOUT_USER };
