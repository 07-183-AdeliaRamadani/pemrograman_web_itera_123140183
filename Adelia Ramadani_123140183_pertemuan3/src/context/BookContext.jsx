import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import useLocalStorage from "../hooks/useLocalStorage";
import useBookStats from "../hooks/useBookStats";
import { isBookList, STORAGE_KEY, validateBook } from "../utils/books";

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks, storageError] = useLocalStorage(
    STORAGE_KEY,
    [],
    isBookList,
  );
  const stats = useBookStats(books);
  function saveBook(data, id) {
    if (Object.keys(validateBook(data)).length)
      throw new Error("Judul, penulis, dan status buku harus valid.");
    const clean = {
      title: data.title.trim(),
      author: data.author.trim(),
      status: data.status,
    };
    // Functional updater mencegah perubahan state memakai daftar yang sudah kedaluwarsa.
    setBooks((previous) =>
      id
        ? previous.map((book) =>
            book.id === id ? { ...book, ...clean } : book,
          )
        : [...previous, { ...clean, id: crypto.randomUUID() }],
    );
  }
  function deleteBook(id) {
    setBooks((previous) => previous.filter((book) => book.id !== id));
  }
  return (
    <BookContext.Provider
      value={{ books, stats, saveBook, deleteBook, storageError }}
    >
      {children}
    </BookContext.Provider>
  );
}
BookProvider.propTypes = { children: PropTypes.node.isRequired };

export function useBooks() {
  const context = useContext(BookContext);
  if (!context)
    throw new Error("useBooks harus digunakan di dalam BookProvider.");
  return context;
}
