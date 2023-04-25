import { gql } from "@apollo/client";

const ADD_BOOK = gql`
  mutation addBook($name: String!, $isbn: ID!, $author: String!) {
    addBook(name: $name, isbn: $isbn, author: $author) {
      id
      name
      isbn
      author
      borrowedBy {
        id
        name
      }
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation updateBook($id: ID!, $name: String, $isbn: Int, $author: String) {
    updateBook(id: $id, name: $name, isbn: $isbn, author: $author) {
      id
      name
      isbn
      author
      borrowedBy {
        id
        name
      }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
      name
      isbn
      author
      borrowedBy {
        id
        name
      }
    }
  }
`;

const BORROW_BOOK = gql`
  mutation borrowBook($id: ID!) {
    borrowBook(id: $id) {
      id
      name
      isbn
      author
      borrowedBy {
        id
        name
      }
    }
  }
`;

const RETURN_BOOK = gql`
  mutation returnBook($id: ID!) {
    returnBook(id: $id) {
      id
      name
      isbn
      author
      borrowedBy {
        id
        name
      }
    }
  }
`;

export { ADD_BOOK, UPDATE_BOOK, DELETE_BOOK, BORROW_BOOK, RETURN_BOOK };
