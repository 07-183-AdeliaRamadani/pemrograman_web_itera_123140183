import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookForm from "./BookForm";

test("menolak input kosong dan memberi feedback visual", async () => {
  const onSave = vi.fn();
  render(<BookForm onSave={onSave} onCancel={vi.fn()} />);
  await userEvent.click(screen.getByRole("button", { name: /Tambah buku/ }));
  expect(screen.getByText("Judul buku wajib diisi.")).toBeVisible();
  expect(screen.getByText("Nama penulis wajib diisi.")).toBeVisible();
  expect(screen.getByLabelText(/Judul buku/)).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(screen.getByLabelText(/Judul buku/)).toHaveFocus();
  expect(onSave).not.toHaveBeenCalled();
});
test("mengirim judul, penulis, status lalu mengosongkan form", async () => {
  const onSave = vi.fn();
  render(<BookForm onSave={onSave} onCancel={vi.fn()} />);
  await userEvent.type(screen.getByLabelText(/Judul buku/), "Laut Bercerita");
  await userEvent.type(
    screen.getByLabelText(/Nama penulis/),
    "Leila S. Chudori",
  );
  await userEvent.selectOptions(screen.getByLabelText(/Status buku/), "baca");
  await userEvent.click(screen.getByRole("button", { name: /Tambah buku/ }));
  expect(onSave).toHaveBeenCalledWith(
    { title: "Laut Bercerita", author: "Leila S. Chudori", status: "baca" },
    undefined,
  );
  expect(screen.getByLabelText(/Judul buku/)).toHaveValue("");
});
test("memuat buku untuk diedit dan menyertakan id saat disimpan", async () => {
  const onSave = vi.fn();
  render(
    <BookForm
      book={{ id: "a", title: "Lama", author: "Penulis", status: "milik" }}
      onSave={onSave}
      onCancel={vi.fn()}
    />,
  );
  await userEvent.clear(screen.getByLabelText(/Judul buku/));
  await userEvent.type(screen.getByLabelText(/Judul buku/), "Baru");
  await userEvent.click(
    screen.getByRole("button", { name: /Simpan perubahan/ }),
  );
  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({ title: "Baru" }),
    "a",
  );
});
