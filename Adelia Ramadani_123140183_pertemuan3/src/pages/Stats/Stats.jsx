import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import StatCard from "../../components/StatCard/StatCard";
import { useBooks } from "../../context/BookContext";
import { STATUS } from "../../utils/books";
import "./Stats.css";

export default function Stats() {
  const { stats } = useBooks();
  return (
    <>
      <Header
        eyebrow="A LITTLE LOOK AT YOUR SHELF"
        title="Cerita dalam angka"
        description="Kenali isi rakmu. Setiap buku punya tempat, setiap halaman punya arti."
      />
      <div className="stats-grid">
        <StatCard label="Total koleksi" value={stats.total} symbol="✿" accent />
        <StatCard label="Sudah dimiliki" value={stats.milik} symbol="▤" />
        <StatCard label="Sedang dibaca" value={stats.baca} symbol="♡" />
        <StatCard label="Ingin dibeli" value={stats.beli} symbol="＋" />
      </div>
      <section className="card stats-detail">
        <p className="eyebrow">ISI RAKMU / SAAT INI</p>
        <h2>Setiap cerita dihitung.</h2>
        <p>
          Koleksimu berisi {stats.total} buku dari {stats.authors} penulis
          berbeda.
        </p>
        {Object.entries(STATUS).map(([key, label]) => {
          const percent = stats.total
            ? Math.round((stats[key] / stats.total) * 100)
            : 0;
          return (
            <div className="distribution" key={key}>
              <div>
                <span>{label}</span>
                <strong>
                  {stats[key]} buku · {percent}%
                </strong>
              </div>
              <progress aria-label={label} max="100" value={percent} />
            </div>
          );
        })}
        <p className="hint">
          Setiap buku memiliki satu status. “Sedang dibaca” dihitung terpisah
          dari “Sudah dimiliki”.
        </p>
        {!stats.total && (
          <p>
            Belum ada data. Tambahkan buku untuk melihat ringkasan koleksi Anda.
          </p>
        )}
        <Link className="button primary" to="/">
          Kembali ke koleksi ↗
        </Link>
      </section>
    </>
  );
}
Stats.propTypes = {};
