import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { bookType, STATUS, validateBook } from "../../utils/books";
import "./BookForm.css";

export default function BookForm({ book = null, onSave, onCancel }) {
  const [values, setValues] = useState(
    book || { title: "", author: "", status: "milik" },
  );
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  useEffect(() => {
    if (book) formRef.current.elements.title.focus();
  }, [book]);
  function change(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }
  function submit(event) {
    event.preventDefault();
    const nextErrors = validateBook(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      formRef.current.elements[Object.keys(nextErrors)[0]].focus();
      return;
    }
    onSave(values, book?.id);
    if (!book) setValues({ title: "", author: "", status: "milik" });
  }
  return (
    <article className="card form-card" id="book-form">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / CATAT BACAAN</p>
          <h2>{book ? "Edit bukumu" : "Cerita baru di rakmu"}</h2>
        </div>
        <span className="circle-icon" aria-hidden="true">
          {book ? "✎" : "+"}
        </span>
      </div>
      <form ref={formRef} onSubmit={submit} noValidate>
        {[
          ["title", "Judul buku", "Contoh: Laut Bercerita"],
          ["author", "Nama penulis", "Contoh: Leila S. Chudori"],
        ].map(([name, label, placeholder]) => (
          <div className="field" key={name}>
            <label htmlFor={name}>
              {label} <span className="required">*</span>
            </label>
            <input
              id={name}
              name={name}
              value={values[name]}
              onChange={change}
              placeholder={placeholder}
              maxLength={150}
              required
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
            />
            <small id={`${name}-error`} className="error">
              {errors[name]}
            </small>
          </div>
        ))}
        <div className="field">
          <label htmlFor="status">
            Status buku <span className="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={change}
            aria-invalid={Boolean(errors.status)}
            aria-describedby="status-error"
          >
            {Object.entries(STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <small id="status-error" className="error">
            {errors.status}
          </small>
        </div>
        <button className="button primary full" type="submit">
          {book ? "Simpan perubahan" : "+ Tambah buku"}
          <span aria-hidden="true">↗</span>
        </button>
        {book && (
          <button
            className="button secondary full cancel"
            type="button"
            onClick={onCancel}
          >
            Batal mengedit
          </button>
        )}
      </form>
      <p className="hint">♡ Satu buku, satu perjalanan baru.</p>
    </article>
  );
}
BookForm.propTypes = {
  book: bookType,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
