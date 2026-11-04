"""Program pengelolaan data nilai mahasiswa untuk Praktikum Pertemuan 4."""

from typing import TypedDict


class DataMahasiswa(TypedDict):
    """Struktur satu data mahasiswa beserta komponen nilainya."""

    nama: str
    nim: str
    nilai_uts: float
    nilai_uas: float
    nilai_tugas: float


DATA_MAHASISWA: list[DataMahasiswa] = [
    {
        "nama": "Adelia Ramadani",
        "nim": "123140183",
        "nilai_uts": 88,
        "nilai_uas": 91,
        "nilai_tugas": 90,
    },
    {
        "nama": "Jana Rohman Wasiso",
        "nim": "123140046",
        "nilai_uts": 79,
        "nilai_uas": 76,
        "nilai_tugas": 82,
    },
    {
        "nama": "Yuni Okta Safitri",
        "nim": "123140213",
        "nilai_uts": 72,
        "nilai_uas": 75,
        "nilai_tugas": 78,
    },
    {
        "nama": "Diva Amelia Saputri",
        "nim": "123140212",
        "nilai_uts": 64,
        "nilai_uas": 68,
        "nilai_tugas": 66,
    },
    {
        "nama": "Mega Zayyani",
        "nim": "123140180",
        "nilai_uts": 48,
        "nilai_uas": 51,
        "nilai_tugas": 50,
    },
]


def hitung_nilai_akhir(nilai_uts: float, nilai_uas: float, nilai_tugas: float) -> float:
    """Menghitung nilai akhir dengan bobot UTS 30%, UAS 40%, tugas 30%.

    Args:
        nilai_uts: Nilai ujian tengah semester.
        nilai_uas: Nilai ujian akhir semester.
        nilai_tugas: Nilai tugas.

    Returns:
        Nilai akhir dalam rentang skala seratus.
    """
    return (0.30 * nilai_uts) + (0.40 * nilai_uas) + (0.30 * nilai_tugas)


def tentukan_grade(nilai_akhir: float) -> str:
    """Menentukan grade A sampai E dari nilai akhir.

    Args:
        nilai_akhir: Nilai akhir mahasiswa.

    Returns:
        Huruf grade sesuai interval penilaian praktikum.
    """
    if nilai_akhir >= 80:
        return "A"
    if nilai_akhir >= 70:
        return "B"
    if nilai_akhir >= 60:
        return "C"
    if nilai_akhir >= 50:
        return "D"
    return "E"


def data_dengan_hasil(data_mahasiswa: list[DataMahasiswa]) -> list[dict[str, str | float]]:
    """Menambahkan nilai akhir dan grade tanpa mengubah list sumber.

    Args:
        data_mahasiswa: List dictionary data mahasiswa.

    Returns:
        List baru berisi data awal, nilai akhir, dan grade.
    """
    hasil: list[dict[str, str | float]] = []
    for mahasiswa in data_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(
            mahasiswa["nilai_uts"], mahasiswa["nilai_uas"], mahasiswa["nilai_tugas"]
        )
        hasil.append(
            {
                **mahasiswa,
                "nilai_akhir": nilai_akhir,
                "grade": tentukan_grade(nilai_akhir),
            }
        )
    return hasil


def tampilkan_tabel(data_hasil: list[dict[str, str | float]]) -> None:
    """Mencetak data mahasiswa sebagai tabel berkolom rata.

    Args:
        data_hasil: Data mahasiswa yang telah memiliki nilai akhir dan grade.
    """
    garis = "+----+----------------------+------------+-------+-------+-------+-------------+-------+"
    print(garis)
    print("| No | Nama                 | NIM        | UTS   | UAS   | Tugas | Nilai Akhir | Grade |")
    print(garis)
    for nomor, mahasiswa in enumerate(data_hasil, start=1):
        print(
            f"| {nomor:<2} | {str(mahasiswa['nama']):<20} "
            f"| {str(mahasiswa['nim']):<10} "
            f"| {float(mahasiswa['nilai_uts']):>5.1f} "
            f"| {float(mahasiswa['nilai_uas']):>5.1f} "
            f"| {float(mahasiswa['nilai_tugas']):>5.1f} "
            f"| {float(mahasiswa['nilai_akhir']):>11.2f} "
            f"| {str(mahasiswa['grade']):^5} |"
        )
    print(garis)


def tampilkan_ekstrem(data_hasil: list[dict[str, str | float]]) -> None:
    """Menampilkan mahasiswa dengan nilai akhir tertinggi dan terendah.

    Args:
        data_hasil: Data mahasiswa yang telah memiliki nilai akhir.
    """
    tertinggi = max(data_hasil, key=lambda mahasiswa: float(mahasiswa["nilai_akhir"]))
    terendah = min(data_hasil, key=lambda mahasiswa: float(mahasiswa["nilai_akhir"]))
    print("\nRingkasan nilai:")
    print(
        f"- Tertinggi : {tertinggi['nama']} "
        f"({float(tertinggi['nilai_akhir']):.2f}, Grade {tertinggi['grade']})"
    )
    print(
        f"- Terendah  : {terendah['nama']} "
        f"({float(terendah['nilai_akhir']):.2f}, Grade {terendah['grade']})"
    )


if __name__ == "__main__":
    print("PROGRAM PENGELOLAAN DATA NILAI MAHASISWA")
    print("Bobot nilai: UTS 30% | UAS 40% | Tugas 30%\n")
    hasil_mahasiswa = data_dengan_hasil(DATA_MAHASISWA)
    tampilkan_tabel(hasil_mahasiswa)
    tampilkan_ekstrem(hasil_mahasiswa)
