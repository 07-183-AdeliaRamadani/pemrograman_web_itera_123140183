"""Pengujian unit untuk seluruh fungsi inti tugas praktikum."""

import unittest

import math_operations as operasi
from tugas1_bmi import hitung_bmi, kategori_bmi
from tugas2_nilai_mahasiswa import (
    DATA_MAHASISWA,
    data_dengan_hasil,
    hitung_nilai_akhir,
    tentukan_grade,
)


class TestTugasBmi(unittest.TestCase):
    """Menguji rumus dan klasifikasi BMI."""

    def test_hitung_bmi(self) -> None:
        self.assertAlmostEqual(hitung_bmi(52, 1.60), 20.3125)

    def test_kategori_bmi(self) -> None:
        self.assertEqual(kategori_bmi(18.4), "Berat badan kurang")
        self.assertEqual(kategori_bmi(18.5), "Berat badan normal")
        self.assertEqual(kategori_bmi(25), "Berat badan berlebih")
        self.assertEqual(kategori_bmi(30), "Obesitas")

    def test_ukuran_tidak_valid(self) -> None:
        with self.assertRaises(ValueError):
            hitung_bmi(0, 1.60)


class TestNilaiMahasiswa(unittest.TestCase):
    """Menguji perhitungan nilai, grade, dan struktur data mahasiswa."""

    def test_bobot_nilai_akhir(self) -> None:
        self.assertEqual(hitung_nilai_akhir(80, 90, 70), 81)

    def test_semua_batas_grade(self) -> None:
        self.assertEqual(tentukan_grade(80), "A")
        self.assertEqual(tentukan_grade(70), "B")
        self.assertEqual(tentukan_grade(60), "C")
        self.assertEqual(tentukan_grade(50), "D")
        self.assertEqual(tentukan_grade(49.99), "E")

    def test_lima_data_mahasiswa_diproses(self) -> None:
        hasil = data_dengan_hasil(DATA_MAHASISWA)
        self.assertEqual(len(hasil), 5)
        self.assertEqual(hasil[0]["nama"], "Adelia Ramadani")
        self.assertEqual(hasil[-1]["nim"], "123140180")
        self.assertIn("nilai_akhir", hasil[0])
        self.assertIn("grade", hasil[0])


class TestMathOperations(unittest.TestCase):
    """Menguji fungsi geometri dan suhu pada modul kustom."""

    def test_persegi(self) -> None:
        self.assertEqual(operasi.luas_persegi(8), 64)
        self.assertEqual(operasi.keliling_persegi(8), 32)

    def test_persegi_panjang(self) -> None:
        self.assertEqual(operasi.luas_persegi_panjang(12, 5), 60)
        self.assertEqual(operasi.keliling_persegi_panjang(12, 5), 34)

    def test_lingkaran(self) -> None:
        self.assertAlmostEqual(operasi.luas_lingkaran(7), 153.93791)
        self.assertAlmostEqual(operasi.keliling_lingkaran(7), 43.98226)

    def test_konversi_suhu(self) -> None:
        self.assertEqual(operasi.celsius_ke_fahrenheit(30), 86)
        self.assertAlmostEqual(operasi.celsius_ke_kelvin(30), 303.15)

    def test_geometri_negatif_ditolak(self) -> None:
        with self.assertRaises(ValueError):
            operasi.luas_lingkaran(-1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
