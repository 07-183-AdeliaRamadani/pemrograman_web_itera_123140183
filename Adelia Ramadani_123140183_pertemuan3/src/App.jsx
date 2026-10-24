import { Route, Routes } from "react-router-dom";
import { BookProvider, useBooks } from "./context/BookContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Stats from "./pages/Stats/Stats";
import About from "./pages/About/About";
import NotFound from "./pages/NotFound/NotFound";

function Layout() {
  const { storageError } = useBooks();
  return (
    <>
      <a href="#main" className="skip-link">
        Langsung ke konten
      </a>
      <Navbar />
      <main id="main">
        {storageError && (
          <div role="alert" className="notice">
            {storageError}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer>
          <span>
            ✿ Dibuat dengan hati oleh <strong>Adelia Ramadani</strong>
          </span>
          <span>
            123140183 · RB <span className="footer-divider">/</span> PAW ITERA ·
            Pertemuan 03
          </span>
        </footer>
      </main>
    </>
  );
}
Layout.propTypes = {};
export default function App() {
  return (
    <BookProvider>
      <Layout />
    </BookProvider>
  );
}
App.propTypes = {};
