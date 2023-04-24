import React, { useEffect, useState } from "react";
import BookList from "./BookList";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { BooksState, fetchBooks } from "../features/books/booksSlice";

interface Props {
  userId?: number;
  availableOnly?: boolean;
}

const BookListContainer: React.FC<Props> = ({ userId, availableOnly }) => {
  const dispatch: ThunkDispatch<BooksState, void, AnyAction> = useDispatch();

  const { books, loading, error } = useSelector(
    (state: { books: BooksState }) => state.books
  );

  useEffect(() => {
    if (books.length === 0) dispatch(fetchBooks());
  }, [books, dispatch]);
  console.log(books);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error :(</p>;
  }

  if (!books || books.length === 0) {
    return <p>No books available.</p>;
  }

  return <BookList books={books} />;
};

export default BookListContainer;
