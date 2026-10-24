import PropTypes from "prop-types";

export const STATUS = {
  milik: "Sudah dimiliki",
  baca: "Sedang dibaca",
  beli: "Ingin dibeli",
};
export const STORAGE_KEY = "adelia-petal-library-v1";
export const bookType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.keys(STATUS)).isRequired,
});

// Validasi juga dilakukan pada data tersimpan, bukan hanya pada formulir.
export function isBookList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (book) =>
        book &&
        typeof book.id === "string" &&
        typeof book.title === "string" &&
        book.title.trim() &&
        typeof book.author === "string" &&
        book.author.trim() &&
        Object.hasOwn(STATUS, book.status),
    ) &&
    new Set(value.map((book) => book.id)).size === value.length
  );
}

export function validateBook(book) {
  const errors = {};
  if (!book.title.trim()) errors.title = "Judul buku wajib diisi.";
  if (!book.author.trim()) errors.author = "Nama penulis wajib diisi.";
  if (!Object.hasOwn(STATUS, book.status))
    errors.status = "Pilih status buku yang tersedia.";
  return errors;
}
