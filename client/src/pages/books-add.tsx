import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack, MdBook } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { ADD_BOOK } from "../mutations/bookMutations";
import {
  BooksState,
  addNewBook,
  fetchBooks,
} from "../features/books/booksSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const BooksAddPage = () => {
  const dispatch: ThunkDispatch<BooksState, void, AnyAction> = useDispatch();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState<Number>(0);
  const { loading, error } = useSelector(
    (state: { books: BooksState }) => state.books
  );

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (typeof isbn !== "number") return;
      // Execute addBook to add new book to backend
      const result = await dispatch(addNewBook({ name, author, isbn }));
      if (addNewBook.fulfilled.match(result) && !loading) {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log(error);
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 dark:bg-gray-800 rounded-md shadow-md">
      <div className="flex items-center mb-6">
        <Link to="/">
          <MdArrowBack size={24} className="mr-2 text-white" />
        </Link>

        <h1 className="text-2xl font-bold text-white">Add a New Book</h1>
        <MdBook size={24} className="ml-2 text-white" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <TextField
            label="Author"
            variant="outlined"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <TextField
            label="ISBN"
            variant="outlined"
            fullWidth
            value={isbn}
            onChange={(e) => setIsbn(+e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!name || !author || !isbn || loading}
          >
            {loading ? "Adding Book..." : "Add Book"}
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};
export default BooksAddPage;
