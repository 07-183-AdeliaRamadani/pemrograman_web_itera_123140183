"""Program penghitung BMI sederhana untuk Praktikum Pertemuan 4."""


def kategori_bmi(bmi: float) -> str:
    """Mengembalikan kategori BMI berdasarkan nilai indeks massa tubuh.

    Args:
        bmi: Nilai body mass index yang telah dihitung.

    Returns:
        Keterangan kategori berat badan.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    if bmi < 25:
        return "Berat badan normal"
    if bmi < 30:
        return "Berat badan berlebih"
    return "Obesitas"


def hitung_bmi(berat_kg: float, tinggi_m: float) -> float:
    """Menghitung BMI dari berat badan kilogram dan tinggi badan meter.

    Args:
        berat_kg: Berat badan dalam kilogram, harus lebih besar dari nol.
        tinggi_m: Tinggi badan dalam meter, harus lebih besar dari nol.

    Returns:
        Nilai BMI tanpa pembulatan.

    Raises:
        ValueError: Jika berat atau tinggi tidak bernilai positif.
    """
    if berat_kg <= 0 or tinggi_m <= 0:
        raise ValueError("Berat dan tinggi badan harus lebih besar dari nol.")
    return berat_kg / (tinggi_m * tinggi_m)


def tampilkan_hasil(nama: str, berat_kg: float, tinggi_m: float) -> None:
    """Menghitung lalu mencetak hasil BMI seseorang secara rapi.

    Args:
        nama: Nama praktikan yang ditampilkan.
        berat_kg: Berat badan dalam kilogram.
        tinggi_m: Tinggi badan dalam meter.
    """
    bmi = hitung_bmi(berat_kg, tinggi_m)
    kategori = kategori_bmi(bmi)

    print("=" * 48)
    print("       PROGRAM PENGHITUNG BMI SEDERHANA")
    print("=" * 48)
    print(f"Nama             : {nama}")
    print(f"Berat badan      : {berat_kg:.1f} kg")
    print(f"Tinggi badan     : {tinggi_m:.2f} m")
    print("-" * 48)
    print(f"Nilai BMI        : {bmi:.2f}")
    print(f"Kategori         : {kategori}")
    print("=" * 48)


if __name__ == "__main__":
    # Data contoh dapat diganti dengan input() bila diperlukan.
    tampilkan_hasil("Adelia Ramadani", berat_kg=52.0, tinggi_m=1.60)
