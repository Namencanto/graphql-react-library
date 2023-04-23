import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.isbn}>
          <CardContent>
            <Typography variant="h6">{book.name}</Typography>
            <Typography variant="subtitle1">{book.author}</Typography>
            <Typography variant="body1" color="textSecondary">
              ISBN: {book.isbn}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookList;
