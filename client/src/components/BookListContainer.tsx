import React from "react";
import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_BOOKS, GET_BOOKS } from "../queries/bookQueries";
import BookList from "./BookList";

interface Props {
  userId?: number;
  availableOnly?: boolean;
}

const BookListContainer: React.FC<Props> = ({ userId, availableOnly }) => {
  const query = userId ? GET_BOOKS : GET_AVAILABLE_BOOKS;
  const variables = userId ? { userId } : {};

  const { loading, error, data } = useQuery(query, {
    variables,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const books = userId ? data.books : data.availableBooks;

  return <BookList books={books} />;
};

export default BookListContainer;
