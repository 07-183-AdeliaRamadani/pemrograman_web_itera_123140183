import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</p>
      <h1>
        Cerita ini belum ada<span className="pink">.</span>
      </h1>
      <p>Alamat halaman yang Anda buka tidak tersedia.</p>
      <Link to="/" className="button primary">
        Kembali ke koleksi ↗
      </Link>
    </section>
  );
}
NotFound.propTypes = {};
