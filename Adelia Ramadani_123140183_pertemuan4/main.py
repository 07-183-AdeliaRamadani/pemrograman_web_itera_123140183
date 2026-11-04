"""Program utama yang menggunakan modul math_operations."""

import math_operations as operasi
from math_operations import celsius_ke_fahrenheit, celsius_ke_kelvin


def tampilkan_geometri() -> None:
    """Menampilkan hasil seluruh fungsi geometri dari modul kustom."""
    sisi = 8
    panjang = 12
    lebar = 5
    jari_jari = 7

    print("=" * 50)
    print("          MODUL MATEMATIKA PYTHON")
    print("=" * 50)
    print(f"Konstanta PI: {operasi.PI}")
    print("\n--- PERSEGI ---")
    print(f"Sisi                 : {sisi}")
    print(f"Luas                 : {operasi.luas_persegi(sisi):.2f}")
    print(f"Keliling             : {operasi.keliling_persegi(sisi):.2f}")

    print("\n--- PERSEGI PANJANG ---")
    print(f"Panjang x lebar      : {panjang} x {lebar}")
    print(f"Luas                 : {operasi.luas_persegi_panjang(panjang, lebar):.2f}")
    print(f"Keliling             : {operasi.keliling_persegi_panjang(panjang, lebar):.2f}")

    print("\n--- LINGKARAN ---")
    print(f"Jari-jari            : {jari_jari}")
    print(f"Luas                 : {operasi.luas_lingkaran(jari_jari):.2f}")
    print(f"Keliling             : {operasi.keliling_lingkaran(jari_jari):.2f}")


def tampilkan_konversi_suhu() -> None:
    """Menampilkan contoh kedua fungsi suhu yang diimpor langsung."""
    celsius = 30
    print("\n--- KONVERSI SUHU ---")
    print(f"Celsius              : {celsius:.2f} °C")
    print(f"Fahrenheit            : {celsius_ke_fahrenheit(celsius):.2f} °F")
    print(f"Kelvin                : {celsius_ke_kelvin(celsius):.2f} K")
    print("=" * 50)


if __name__ == "__main__":
    tampilkan_geometri()
    tampilkan_konversi_suhu()
