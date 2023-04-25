import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { FaBook } from "react-icons/fa";
import { Book } from "../types/Book";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "../features/auth/authSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  borrowBook,
  deleteBook,
  returnBook,
} from "../features/books/booksSlice";

interface BookListProps {
  books: Book[];
}

type FilterOptions = "all" | "available" | "borrowed";

const BookList: React.FC<BookListProps> = ({ books }) => {
  const dispatch: ThunkDispatch<AuthState, void, AnyAction> = useDispatch();

  const { admin, id } = useSelector((state: any) => state.auth.user);
  const userId = id;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState<FilterOptions>("all");
  const [filteredBooks, setFilteredBooks] = useState<Book[]>();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOption(event.target.value as "all" | "available" | "borrowed");
  };
  useEffect(() => {
    // Filtruj listę książek w zależności od wybranej opcji
    if (books)
      switch (filterOption) {
        case "available":
          setFilteredBooks(books.filter((book) => !book.borrowedBy));
          break;
        case "borrowed":
          admin
            ? setFilteredBooks(books.filter((book) => book.borrowedBy?.id))
            : setFilteredBooks(
                books.filter((book) => book.borrowedBy?.id === userId)
              );
          break;
        default:
          setFilteredBooks(books);
          break;
      }
  }, [admin, userId, filterOption, books]);

  const handleDeleteBook = async (id: number) => {
    try {
      if (!id) return;

      // Execute deleteBook to remove book from the backend
      await dispatch(
        deleteBook({
          id: +id,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleBorrowBook = async (id: any) => {
    try {
      if (!id) return;

      // Execute deleteBook to remove book from the backend
      await dispatch(
        borrowBook({
          id: +id,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleReturnBook = async (id: any) => {
    try {
      if (!id) return;

      // Execute deleteBook to remove book from the backend
      await dispatch(
        returnBook({
          id: +id,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="sm:grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex justify-center sm:col-span-2 lg:col-span-4">
        <div className="w-full max-w-[1240px] px-4">
          <TextField
            label="Search Book"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </div>
      </div>
      <div className="flex justify-center sm:col-span-2 lg:col-span-4 px-4">
        <FormControl component="fieldset">
          <RadioGroup
            className="justify-center"
            aria-label="bookFilter"
            name="bookFilter"
            value={filterOption}
            onChange={handleFilterChange}
            row
          >
            <FormControlLabel
              defaultChecked={true}
              value="all"
              control={<Radio />}
              label="All Books"
            />
            <FormControlLabel
              value="available"
              control={<Radio />}
              label="Available Books"
            />
            <FormControlLabel
              value="borrowed"
              control={<Radio />}
              label={`${admin ? "" : "My"} Borrowed Books`}
            />
          </RadioGroup>
        </FormControl>
      </div>
      {filteredBooks
        ?.filter((book) =>
          book?.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .map((book) => (
          <Card key={book.id} className="bg-white shadow-lg rounded-lg m-4">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="w-full md:w-4/5 lg:w-3/4">
                  <Typography variant="h5" className="text-gray-300 font-bold">
                    {book.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="text-gray-400 font-medium"
                  >
                    By: {book.author}
                  </Typography>
                  <Typography className="text-gray-400 text-sm">
                    ISBN: {book.isbn}
                  </Typography>
                  <Typography className="text-gray-400 text-sm">
                    {book?.borrowedBy?.name
                      ? `Borrowed by: ${book?.borrowedBy?.name}`
                      : "Free to borrow"}
                  </Typography>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200">
                  <FaBook className="text-gray-500" size={40} />
                </div>
              </div>
              {admin ? (
                <div className="flex justify-end mt-4 gap-2">
                  <Link to={`/books-edit/${book.id}`}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<HiPencilAlt />}
                    >
                      Edit Book
                    </Button>
                  </Link>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<HiTrash />}
                    onClick={() => handleDeleteBook(book.id)}
                    className="ml-4"
                  >
                    Delete Book
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end mt-4 ">
                  {!book.borrowedBy && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleBorrowBook(book.id)}
                    >
                      Borrow Book
                    </Button>
                  )}
                  {book?.borrowedBy?.id === userId && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleReturnBook(book.id)}
                    >
                      Return Book
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      {books?.filter((book) =>
        book?.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
      ).length === 0 && (
        <div className="flex items-center justify-center text-gray-400 text-2xl mt-8 col-span-4">
          No books found.
        </div>
      )}
    </div>
  );
};
export default BookList;
