import { useEffect, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdBook } from "react-icons/md";
import { BooksState, fetchBooks } from "../features/books/booksSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Book } from "../types/Book";
import NotFoundPage from "./NotFound";
import BookEdit from "../components/BookEdit";

const BooksEditPage = () => {
  const dispatch: ThunkDispatch<BooksState, void, AnyAction> = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { loading, error, books } = useSelector(
    (state: { books: BooksState }) => state.books
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (loading || !isLoaded) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error: {""}</p>;
  }

  const book = books.find((b: Book) => {
    return Number(b.id) === Number(id);
  });
  if (!book) {
    return <NotFoundPage />;
  } else return <BookEdit book={book} />;
};

export default BooksEditPage;
