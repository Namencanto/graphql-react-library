import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { FaBook } from "react-icons/fa";
import { Book } from "../types/Book";
import { useSelector, useDispatch } from "react-redux";
import { AuthState } from "../features/auth/authSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
  HiPencilAlt,
  HiTrash,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import { Link } from "react-router-dom";

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  const dispatch: ThunkDispatch<AuthState, void, AnyAction> = useDispatch();

  const { admin } = useSelector((state: any) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteBook = (isbn: any) => {
    // TODO: implement book deletion logic
  };

  const handleEditBook = (isbn: any) => {
    // TODO: implement book editing logic
  };

  const handleBorrowBook = (isbn: any) => {
    // TODO: implement book borrowing logic
  };

  return (
    <div className="grid pl-2 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div className="flex items-center">
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          className="mr-4 w-full"
        />
        <HiOutlineArrowNarrowRight className="text-gray-400" size={24} />
      </div>
      {books
        ?.filter((book) =>
          book.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((book) => (
          <Card key={book.isbn} className="bg-white shadow-lg rounded-lg">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h6" className="text-white font-bold">
                    Name: {book.name}
                  </Typography>
                  <Typography variant="subtitle1" className="text-gray-400">
                    Author: {book.author}
                  </Typography>
                  <Typography className="text-gray-400">
                    ISBN: {book.isbn}
                  </Typography>
                  <Typography className="text-gray-400">
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
                <div className="flex justify-end mt-4">
                  <Link to={`/books-edit/${book.id}`}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<HiPencilAlt />}
                      onClick={() => handleEditBook(book.isbn)}
                    >
                      Edit Book
                    </Button>
                  </Link>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<HiTrash />}
                    onClick={() => handleDeleteBook(book.isbn)}
                    className="ml-4"
                  >
                    Delete Book
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end mt-4">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBorrowBook(book.isbn)}
                  >
                    Borrow Book
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
export default BookList;
