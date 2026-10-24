import Header from "../../components/Header/Header";

export default function About() {
  return (
    <>
      <Header
        eyebrow="MADE WITH CARE & A LITTLE PINK"
        title="Rumah untuk ceritamu"
        description="Petal Library — aplikasi manajemen buku pribadi untuk praktikum React."
      />
      <section className="card about-card">
        <p className="eyebrow">DI BALIK RAK BUKU</p>
        <h2>Halo, saya Adelia!</h2>
        <p>
          <strong>Adelia Ramadani · 123140183 · Kelas RB</strong>
          <br />
          Praktikum Pengembangan Aplikasi Web · ITERA · Pertemuan 3
        </p>
        <p>
          Petal Library membantu mencatat buku yang sudah dimiliki, sedang
          dibaca, dan ingin dibeli. Tambahkan buku, perbarui judul atau
          penulisnya, lalu temukan kembali melalui pencarian dan filter status.
        </p>
        <h3>Cara menggunakan</h3>
        <ol>
          <li>
            Isi judul, penulis, dan status pada formulir, lalu pilih Tambah
            buku.
          </li>
          <li>Gunakan pencarian dan filter untuk menemukan bacaan.</li>
          <li>
            Pilih Edit untuk memperbarui buku, atau Hapus untuk menghapusnya
            dengan konfirmasi.
          </li>
          <li>Buka Statistik untuk melihat ringkasan koleksi.</li>
        </ol>
        <h3>Tentang penyimpanan</h3>
        <p>
          Data tersimpan otomatis di localStorage browser ini. Koleksi tetap
          tersedia setelah refresh, selama data situs tidak dihapus. Koleksi
          tidak disinkronkan ke perangkat lain.
        </p>
        <h3>Dibangun dengan React</h3>
        <p>
          Functional components, Props dan PropTypes, useState, useEffect,
          Context API, React Router, serta custom hooks useLocalStorage dan
          useBookStats. Tema pink, hitam, putih tanpa motion.
        </p>
      </section>
    </>
  );
}
About.propTypes = {};
