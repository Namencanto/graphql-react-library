import React, { useEffect } from "react";
import BookList from "./BookList";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { BooksState, fetchBooks } from "../features/books/booksSlice";
import { Typography } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";

const BookListContainer: React.FC = () => {
  const dispatch: ThunkDispatch<BooksState, void, AnyAction> = useDispatch();

  const { books, loading, error } = useSelector(
    (state: { books: BooksState }) => state.books
  );
  useEffect(() => {
    dispatch(fetchBooks());
  }, [books, dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">{error}</div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Typography variant="h5" className="mb-4">
          No books available.
        </Typography>
      </div>
    );
  }

  return <BookList books={books} />;
};

export default BookListContainer;
