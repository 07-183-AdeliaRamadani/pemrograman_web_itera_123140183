import { act, renderHook } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage";
import useBookStats from "./useBookStats";
import { isBookList } from "../utils/books";
test("useBookStats menghitung semua status dan penulis unik", () => {
  const { result } = renderHook(() =>
    useBookStats([
      { author: " Adelia ", status: "milik" },
      { author: "adelia", status: "baca" },
      { author: "Tere", status: "beli" },
    ]),
  );
  expect(result.current).toEqual({
    total: 3,
    milik: 1,
    baca: 1,
    beli: 1,
    authors: 2,
  });
});
test("statistik koleksi kosong tidak menghasilkan angka invalid", () => {
  const { result } = renderHook(() => useBookStats([]));
  expect(result.current.total).toBe(0);
  expect(result.current.authors).toBe(0);
});
test.each(["{rusak", "{}", '[{"id":"1"}]'])(
  "data rusak %s ditangani tanpa menimpa data asli",
  (raw) => {
    localStorage.setItem("books", raw);
    const { result } = renderHook(() =>
      useLocalStorage("books", [], isBookList),
    );
    expect(result.current[0]).toEqual([]);
    expect(result.current[2]).toMatch(/tidak dapat dibaca/);
    expect(localStorage.getItem("books")).toBe(raw);
  },
);
test("gagal menyimpan memberikan peringatan tetapi state tetap dapat diubah", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Quota");
  });
  const { result } = renderHook(() => useLocalStorage("books", [], isBookList));
  act(() =>
    result.current[1]([
      { id: "a", title: "Buku", author: "A", status: "milik" },
    ]),
  );
  expect(result.current[0]).toHaveLength(1);
  expect(result.current[2]).toMatch(/belum tersimpan/);
});
