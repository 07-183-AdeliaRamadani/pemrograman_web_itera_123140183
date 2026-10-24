import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span aria-hidden="true">✿</span> petal library
        <span className="pink">.</span>
      </Link>
      <nav aria-label="Navigasi utama">
        <NavLink to="/" end>
          Koleksi buku
        </NavLink>
        <NavLink to="/stats">Statistik</NavLink>
        <NavLink to="/about">Tentang</NavLink>
      </nav>
      <div className="student">
        Adelia Ramadani<strong>123140183 · KELAS RB</strong>
      </div>
    </header>
  );
}
Navbar.propTypes = {};
