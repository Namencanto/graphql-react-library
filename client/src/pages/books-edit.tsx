import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import { BooksState, fetchBooks } from "../features/books/booksSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Book } from "../types/Book";
import NotFoundPage from "./NotFound";
import BookEdit from "../components/BookEdit";

const BooksEditPage = () => {
  const dispatch: ThunkDispatch<BooksState, void, AnyAction> = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { loading, books } = useSelector(
    (state: { books: BooksState }) => state.books
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (books.length === 0)
      dispatch(fetchBooks()).then(() => setIsLoaded(true));
    else setIsLoaded(true);
  }, [dispatch, books]);

  if (loading || !isLoaded) {
    return <CircularProgress />;
  }

  const book = books.find((b: Book) => {
    return Number(b.id) === Number(id);
  });
  if (!book) {
    return <NotFoundPage />;
  } else return <BookEdit book={book} />;
};

export default BooksEditPage;
