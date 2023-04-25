import { useEffect, useState, useMemo } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdBook } from "react-icons/md";
import { BooksState, editBook, fetchBooks } from "../features/books/booksSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const BookEdit = (book: any) => {
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<BooksState, void, AnyAction> = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState(book.book.name);
  const [author, setAuthor] = useState(book.book.author);
  const [isbn, setIsbn] = useState(book.book.isbn);
  const { loading, error, books } = useSelector(
    (state: { books: BooksState }) => state.books
  );

  const isDifferent = useMemo(() => {
    return (
      name !== book.book.name ||
      author !== book.book.author ||
      isbn !== book.book.isbn
    );
  }, [name, author, isbn, book]);

  useEffect(() => {
    if (books.length === 0) dispatch(fetchBooks());
  }, [books, dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!id) return;

      // Check if any input field is different from the initial value

      if (!isDifferent) {
        throw new Error("Please make changes to update the book");
      }

      // Execute editBook to update existing book in backend
      const result = await dispatch(
        editBook({
          id: +id,
          name,
          author,
          isbn: isbn.toString(),
        })
      );

      if (editBook.fulfilled.match(result) && !loading) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 dark:bg-gray-800 rounded-md shadow-md ">
        <div className="flex items-center mb-6">
          <Link to="/">
            <MdArrowBack size={24} className="mr-2 text-white" />
          </Link>

          <h1 className="text-2xl font-bold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
            Edit {book.book.name} Book
          </h1>
          <MdBook size={24} className="ml-2 !min-w-[25px] text-white" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name || book.book.name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              value={author || book.book.author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
              required
            />
          </div>
          <div className="mb-4">
            <div className="mb-4">
              <TextField
                label="ISBN"
                variant="outlined"
                fullWidth
                value={isbn || book.book.isbn}
                onChange={(e) => {
                  setIsbn(+e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!name || !author || !isbn || loading || !isDifferent}
            >
              {loading ? "Editing Book..." : "Edit Book"}
            </Button>
          </div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default BookEdit;
