import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue, validate) {
  const [initial] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return { value: initialValue, error: "" };
      const parsed = JSON.parse(raw);
      if (!validate(parsed)) throw new Error("Data tidak sesuai format");
      return { value: parsed, error: "" };
    } catch {
      return {
        value: initialValue,
        error:
          "Data tersimpan tidak dapat dibaca. Koleksi sementara dimulai kosong. Data lama tidak ditimpa sampai Anda mengubah koleksi.",
      };
    }
  });
  const [value, setValue] = useState(initial.value);
  const [error, setError] = useState(initial.error);

  useEffect(() => {
    // Pertahankan data rusak agar tidak langsung tertimpa pada mount/StrictMode.
    if (initial.error && value === initial.value) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setError("");
    } catch {
      setError(
        "Penyimpanan browser tidak tersedia atau penuh. Perubahan masih ada di halaman ini, tetapi belum tersimpan setelah refresh.",
      );
    }
  }, [key, value, initial]);

  return [value, setValue, error];
}
