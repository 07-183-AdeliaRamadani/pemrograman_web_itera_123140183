import { useRef, useState } from "react";
import { useBooks } from "../../context/BookContext";
import Header from "../../components/Header/Header";
import StatCard from "../../components/StatCard/StatCard";
import BookForm from "../../components/BookForm/BookForm";
import BookFilter from "../../components/BookFilter/BookFilter";
import BookList from "../../components/BookList/BookList";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import "./Home.css";

export default function Home() {
  const { books, stats, saveBook, deleteBook } = useBooks();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [message, setMessage] = useState("");
  const listRef = useRef(null);
  // Filter status dan pencarian diterapkan bersamaan, tanpa mengubah koleksi asli.
  const query = search.trim().toLocaleLowerCase("id");
  const filtered = books.filter(
    (book) =>
      (status === "all" || book.status === status) &&
      `${book.title} ${book.author}`.toLocaleLowerCase("id").includes(query),
  );
  function edit(book) {
    setEditing(book);
    document.getElementById("book-form").scrollIntoView?.({ block: "center" });
    document.getElementById("title").focus();
  }
  function save(values, id) {
    saveBook(values, id);
    setEditing(null);
    setMessage(
      id
        ? "Perubahan buku berhasil disimpan."
        : "Buku baru berhasil ditambahkan ke koleksi.",
    );
  }
  return (
    <>
      <Header
        eyebrow="YOUR LITTLE CORNER OF STORIES"
        title="Buku kecil, dunia besar"
        description="Simpan yang kamu punya, nikmati yang kamu baca, impikan cerita berikutnya."
        illustration
      />
      <div className="stats-grid">
        <StatCard label="Total koleksi" value={stats.total} symbol="✿" accent />
        <StatCard label="Sudah dimiliki" value={stats.milik} symbol="▤" />
        <StatCard label="Sedang dibaca" value={stats.baca} symbol="♡" />
        <StatCard label="Ingin dibeli" value={stats.beli} symbol="＋" />
      </div>
      <div className="workspace">
        <aside>
          <BookForm
            key={editing?.id || "new"}
            book={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
          <div className="reading-note">
            <span aria-hidden="true">✦</span>
            <div>
              <strong>Pelan-pelan, halaman demi halaman.</strong>
              <p>
                Tidak perlu buru-buru. Setiap cerita punya waktunya sendiri.
              </p>
            </div>
          </div>
          <p className="storage-note">◉ Koleksi tersimpan di browser ini.</p>
        </aside>
        <section className="card collection" aria-labelledby="collection-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / RAK BUKU PRIBADI</p>
              <h2 id="collection-title" tabIndex={-1} ref={listRef}>
                Pilihan ceritamu{" "}
                <span className="count">{books.length} buku</span>
              </h2>
            </div>
            <span aria-hidden="true" className="pink">
              ✧
            </span>
          </div>
          <BookFilter
            search={search}
            onSearch={setSearch}
            status={status}
            onStatus={setStatus}
            counts={stats}
          />
          <p className="result-count" aria-live="polite">
            Menampilkan {filtered.length} dari {books.length} buku
          </p>
          <BookList
            books={filtered}
            onEdit={edit}
            onDelete={setDeleting}
            hasBooks={books.length > 0}
          />
          <p className="collection-foot">
            A shelf full of stories, a heart full of dreams. ♡
          </p>
        </section>
      </div>
      <p className="feedback" role="status">
        {message}
      </p>
      {deleting && (
        <ConfirmDialog
          title={deleting.title}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            deleteBook(deleting.id);
            if (editing?.id === deleting.id) setEditing(null);
            setDeleting(null);
            setMessage("Buku berhasil dihapus dari koleksi.");
            listRef.current.focus();
          }}
        />
      )}
    </>
  );
}
Home.propTypes = {};
