import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { FaBook } from "react-icons/fa";

interface BookListProps {
  books: {
    id: string;
    name: string;
    author: string;
    isbn: string;
    available: boolean;
  }[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="grid pl-2 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {books?.map((book) => (
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
              </div>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200">
                <FaBook className="text-gray-500" size={40} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookList;
