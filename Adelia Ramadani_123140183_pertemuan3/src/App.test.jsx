import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { STORAGE_KEY } from "./utils/books";
const initialBooks = [
  {
    id: "1",
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    status: "baca",
  },
  { id: "2", title: "Bumi", author: "Tere Liye", status: "milik" },
  { id: "3", title: "Hujan", author: "Tere Liye", status: "beli" },
];
function setup(path = "/") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
test("pencarian judul dan penulis tidak peka huruf besar kecil", async () => {
  setup();
  const search = screen.getByRole("searchbox");
  await userEvent.type(search, "LAUT");
  expect(screen.getByRole("heading", { name: "Laut Bercerita" })).toBeVisible();
  expect(
    screen.queryByRole("heading", { name: "Bumi" }),
  ).not.toBeInTheDocument();
  await userEvent.clear(search);
  await userEvent.type(search, "tere");
  expect(screen.getByRole("heading", { name: "Bumi" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Hujan" })).toBeVisible();
});
test("menggabungkan filter status dan kata pencarian", async () => {
  setup();
  await userEvent.click(screen.getByRole("button", { name: /Ingin dibeli/ }));
  expect(screen.getByRole("heading", { name: "Hujan" })).toBeVisible();
  expect(
    screen.queryByRole("heading", { name: "Bumi" }),
  ).not.toBeInTheDocument();
  await userEvent.type(screen.getByRole("searchbox"), "Leila");
  expect(screen.getByText("Bukunya belum ketemu.")).toBeVisible();
});
test("membatalkan hapus mempertahankan buku; konfirmasi menghapus dan menyimpan", async () => {
  setup();
  await userEvent.click(screen.getByRole("button", { name: "Hapus Bumi" }));
  await userEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Batal" }),
  );
  expect(screen.getByRole("heading", { name: "Bumi" })).toBeVisible();
  await userEvent.click(screen.getByRole("button", { name: "Hapus Bumi" }));
  await userEvent.click(screen.getByRole("button", { name: "Ya, hapus buku" }));
  expect(
    screen.queryByRole("heading", { name: "Bumi" }),
  ).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(2);
});
test("mengedit judul dan status buku melalui Context API", async () => {
  setup();
  await userEvent.click(screen.getByRole("button", { name: "Edit Bumi" }));
  await userEvent.clear(screen.getByLabelText(/Judul buku/));
  await userEvent.type(screen.getByLabelText(/Judul buku/), "Bumi Baru");
  await userEvent.selectOptions(screen.getByLabelText(/Status buku/), "baca");
  await userEvent.click(
    screen.getByRole("button", { name: /Simpan perubahan/ }),
  );
  expect(screen.getByRole("heading", { name: "Bumi Baru" })).toBeVisible();
  expect(
    JSON.parse(localStorage.getItem(STORAGE_KEY)).find(
      (book) => book.id === "2",
    ).status,
  ).toBe("baca");
});
test("data tambah buku bertahan setelah unmount dan mount kembali", async () => {
  const view = setup();
  await userEvent.type(screen.getByLabelText(/Judul buku/), "Buku Baru");
  await userEvent.type(screen.getByLabelText(/Nama penulis/), "Adelia");
  await userEvent.click(screen.getByRole("button", { name: /Tambah buku/ }));
  view.unmount();
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Buku Baru" })).toBeVisible();
});
test("navigasi statistik memakai data global dan halaman tentang menampilkan identitas", async () => {
  setup();
  await userEvent.click(screen.getByRole("link", { name: "Statistik" }));
  expect(
    screen.getByText("Koleksimu berisi 3 buku dari 2 penulis berbeda."),
  ).toBeVisible();
  expect(screen.getAllByRole("progressbar")).toHaveLength(3);
  await userEvent.click(screen.getByRole("link", { name: "Tentang" }));
  expect(
    screen.getByText(/Adelia Ramadani.*123140183.*Kelas RB/),
  ).toBeVisible();
});
test("menampilkan 404 untuk URL tidak dikenal", () => {
  setup("/halaman-tidak-ada");
  expect(
    screen.getByRole("heading", { name: /Cerita ini belum ada/ }),
  ).toBeVisible();
});
