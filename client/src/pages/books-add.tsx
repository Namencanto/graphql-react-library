import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdBook } from "react-icons/md";
import { useMutation } from "@apollo/client";
import { ADD_BOOK } from "../mutations/bookMutations";

const BooksAddPage = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState<Number>();

  const navigate = useNavigate();

  const [addBook, { loading, error }] = useMutation(ADD_BOOK); // here is a problem with invalid hook call

  const handleSubmit = async () => {
    const newBook = {
      name,
      isbn,
      author,
    };

    try {
      // Execute addBook to add new book to backend
      await addBook({
        variables: {
          name: newBook.name,
          isbn: newBook.isbn,
          author: newBook.author,
        },
      });

      // Navigate back to books list page
      navigate("/books");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-700 dark:bg-gray-800 rounded-md shadow-md">
      <div className="flex items-center mb-6">
        <MdBook size={24} className="mr-2 text-white" />
        <h1 className="text-2xl font-bold text-white">Add a New Book</h1>
      </div>
      <form>
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
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            type="submit"
            disabled={!name || !author || !isbn || loading}
          >
            {loading ? "Adding Book..." : "Add Book"}
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500">{error.message}</p>}
      </form>
    </div>
  );
};
export default BooksAddPage;
