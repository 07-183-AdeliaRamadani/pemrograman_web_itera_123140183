import PropTypes from "prop-types";
import { bookType, STATUS } from "../../utils/books";
import "./BookList.css";

export default function BookList({ books, onEdit, onDelete, hasBooks }) {
  if (!books.length)
    return (
      <div className="empty">
        <span aria-hidden="true">♡</span>
        <h3>
          {hasBooks ? "Bukunya belum ketemu." : "Rak kecilmu menunggu cerita."}
        </h3>
        <p>
          {hasBooks
            ? "Coba kata kunci lain atau pilih status Semua."
            : "Tambahkan buku pertamamu lewat formulir di samping."}
        </p>
      </div>
    );
  return (
    <ul className="book-list">
      {books.map((book, index) => (
        <li key={book.id} className="book-item">
          <div className={`book-cover cover-${book.status}`} aria-hidden="true">
            <small>{String(index + 1).padStart(2, "0")}</small>
            <span>✿</span>
            <i>petal reads</i>
          </div>
          <div className="book-info">
            <span className={`badge badge-${book.status}`}>
              {STATUS[book.status]}
            </span>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
          <div className="book-actions">
            <button
              type="button"
              onClick={() => onEdit(book)}
              aria-label={`Edit ${book.title}`}
            >
              ✎ <span>Edit</span>
            </button>
            <button
              className="delete"
              type="button"
              onClick={() => onDelete(book)}
              aria-label={`Hapus ${book.title}`}
            >
              × <span>Hapus</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
BookList.propTypes = {
  books: PropTypes.arrayOf(bookType).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hasBooks: PropTypes.bool.isRequired,
};
