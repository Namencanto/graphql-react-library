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

const DELETE_USER = gql`
  mutation deleteUser($password: String!) {
    deleteUser(password: $password) {
      id
    }
  }
`;
const UPDATE_USER = gql`
  mutation updateUser(
    $login: String!
    $name: String!
    $password: String!
    $newPassword: String!
  ) {
    updateUser(
      login: $login
      name: $name
      password: $password
      newPassword: $newPassword
    ) {
      id
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

export { ADD_USER, DELETE_USER, UPDATE_USER, LOGIN_USER, LOGOUT_USER };
