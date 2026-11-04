"""Modul operasi geometri dan konversi suhu."""

PI = 3.14159


def _pastikan_tidak_negatif(*nilai: float) -> None:
    """Memvalidasi bahwa semua ukuran geometri bernilai nol atau positif."""
    if any(nilai_input < 0 for nilai_input in nilai):
        raise ValueError("Ukuran geometri tidak boleh bernilai negatif.")


def luas_persegi(sisi: float) -> float:
    """Menghitung luas persegi.

    Args:
        sisi: Panjang salah satu sisi persegi.

    Returns:
        Luas persegi.
    """
    _pastikan_tidak_negatif(sisi)
    return sisi * sisi


def keliling_persegi(sisi: float) -> float:
    """Menghitung keliling persegi dari panjang sisinya."""
    _pastikan_tidak_negatif(sisi)
    return 4 * sisi


def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung luas persegi panjang.

    Args:
        panjang: Panjang persegi panjang.
        lebar: Lebar persegi panjang.

    Returns:
        Luas persegi panjang.
    """
    _pastikan_tidak_negatif(panjang, lebar)
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung keliling persegi panjang.

    Args:
        panjang: Panjang persegi panjang.
        lebar: Lebar persegi panjang.

    Returns:
        Keliling persegi panjang.
    """
    _pastikan_tidak_negatif(panjang, lebar)
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari: float) -> float:
    """Menghitung luas lingkaran menggunakan konstanta PI modul ini.

    Args:
        jari_jari: Radius lingkaran.

    Returns:
        Luas lingkaran.
    """
    _pastikan_tidak_negatif(jari_jari)
    return PI * jari_jari**2


def keliling_lingkaran(jari_jari: float) -> float:
    """Menghitung keliling lingkaran menggunakan konstanta PI modul ini.

    Args:
        jari_jari: Radius lingkaran.

    Returns:
        Keliling lingkaran.
    """
    _pastikan_tidak_negatif(jari_jari)
    return 2 * PI * jari_jari


def celsius_ke_fahrenheit(celsius: float) -> float:
    """Mengonversi temperatur Celsius ke Fahrenheit.

    Args:
        celsius: Suhu dalam derajat Celsius.

    Returns:
        Suhu dalam derajat Fahrenheit.
    """
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius: float) -> float:
    """Mengonversi temperatur Celsius ke Kelvin.

    Args:
        celsius: Suhu dalam derajat Celsius.

    Returns:
        Suhu dalam satuan Kelvin.
    """
    return celsius + 273.15
