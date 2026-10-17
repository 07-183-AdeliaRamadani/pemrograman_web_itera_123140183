'use strict';
// Identitas praktikan dan kunci khusus agar tidak menghapus data aplikasi lain.
const praktikan = { nama: 'Adelia Ramadani', nim: '123140183', kelas: 'RB' };
const STORAGE_KEY = 'adelia.pinkPantry.cart.v1';
const MAX_MONEY = 1_000_000_000_000;
const rupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
const $ = (id) => document.getElementById(id);
let cart = [];
let toastTimer;

// Fungsi murni: dapat diuji tanpa DOM. Semua nominal menggunakan Rupiah bulat.
function validateItem(name, priceText, qtyText) {
  const price = Number(priceText);
  const qty = Number(qtyText);
  const errors = {};
  if (name.trim().length < 3 || name.trim().length > 100) errors.name = 'Nama barang harus 3–100 karakter.';
  if (String(priceText).trim() === '' || !Number.isSafeInteger(price) || price < 500 || price > MAX_MONEY) errors.price = 'Harga minimal Rp500, berupa Rupiah bulat (maks. Rp1 triliun).';
  if (String(qtyText).trim() === '' || !Number.isSafeInteger(qty) || qty < 1 || qty > 1_000_000) errors.qty = 'Jumlah harus bilangan bulat 1–1.000.000.';
  if (!errors.price && !errors.qty && price * qty > MAX_MONEY) errors.qty = 'Subtotal barang maksimal Rp1 triliun.';
  return errors;
}
function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal >= 50_000 ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount };
}
function warnStorage(message) { $('storage-warning').textContent = message; $('storage-warning').hidden = false; }
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const stored = JSON.parse(raw);
    if (!Array.isArray(stored) || stored.some(item => !item || typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.price !== 'number' || typeof item.qty !== 'number' || Object.keys(validateItem(item.name, item.price, item.qty)).length) || new Set(stored.map(i => i.id)).size !== stored.length || calculateTotals(stored).subtotal > MAX_MONEY) throw new Error('Data tidak valid');
    return stored;
  } catch (error) {
    warnStorage('Keranjang tersimpan tidak dapat dibaca. Aplikasi memakai keranjang kosong; tambahkan barang untuk menyimpan data baru.');
    return [];
  }
}
function saveCart(reset = false) {
  try {
    if (reset) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    $('storage-warning').hidden = true;
  } catch (error) { warnStorage('Browser tidak mengizinkan penyimpanan. Transaksi tetap bisa digunakan, tetapi data mungkin hilang saat halaman ditutup.'); }
}
function toast(message) {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2400);
}
function renderPayment() {
  const { total } = calculateTotals(cart);
  const input = $('payment');
  const message = $('payment-message');
  const paid = Number(input.value);
  message.className = 'payment-message';
  $('change').textContent = rupiah(0);
  input.setAttribute('aria-invalid', 'false');
  if (!cart.length) message.textContent = 'Tambahkan barang untuk memulai pembayaran.';
  else if (input.value.trim() === '') message.textContent = 'Masukkan uang bayar untuk menghitung kembalian.';
  else if (!Number.isSafeInteger(paid) || paid < 0 || paid > MAX_MONEY) {
    message.textContent = 'Uang bayar harus Rupiah bulat 0–1 triliun.';
    message.classList.add('error-state'); input.setAttribute('aria-invalid', 'true');
  } else if (paid < total) {
    message.textContent = `Uang belum mencukupi. Kurang ${rupiah(total - paid)}.`;
    message.classList.add('error-state');
  } else {
    message.textContent = 'Uang bayar cukup. Terima kasih sudah belanja! ♡';
    message.classList.add('success'); $('change').textContent = rupiah(paid - total);
  }
}
function renderCart(addedId) {
  const body = $('cart-body'); body.replaceChildren();
  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    if (item.id === addedId) row.classList.add('added');
    [index + 1, item.name, rupiah(item.price), item.qty, rupiah(item.price * item.qty)].forEach(value => {
      const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell);
    });
    const action = document.createElement('td');
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'delete-button'; button.textContent = 'Hapus';
    button.setAttribute('aria-label', `Hapus ${item.name}`);
    button.addEventListener('click', () => {
      cart = cart.filter(entry => entry.id !== item.id); saveCart(); renderCart(); toast(`${item.name} dihapus.`);
    });
    action.appendChild(button); row.appendChild(action); body.appendChild(row);
  });
  const { subtotal, discount, total } = calculateTotals(cart);
  $('empty-cart').hidden = cart.length > 0;
  $('cart-count').textContent = `${cart.length} item`;
  $('subtotal').textContent = rupiah(subtotal); $('discount').textContent = `− ${rupiah(discount)}`;
  $('discount-label').textContent = discount ? '(10% aktif ♡)' : '(10% mulai Rp50.000)';
  $('total').textContent = rupiah(total); $('reset-button').disabled = !cart.length;
  renderPayment();
}
function clearErrors() {
  ['name', 'price', 'qty'].forEach(key => { $(`${key}-error`).textContent = ''; $(`item-${key}`).setAttribute('aria-invalid', 'false'); });
}
if (typeof document !== 'undefined') {
  cart = loadCart(); renderCart();
  $('item-form').addEventListener('submit', event => {
    event.preventDefault(); clearErrors();
    const name = $('item-name').value.trim(); const price = Number($('item-price').value); const qty = Number($('item-qty').value);
    const errors = validateItem(name, $('item-price').value, $('item-qty').value);
    if (!Object.keys(errors).length && calculateTotals(cart).subtotal + price * qty > MAX_MONEY) errors.price = 'Total transaksi maksimal Rp1 triliun.';
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([key, value]) => { $(`${key}-error`).textContent = value; $(`item-${key}`).setAttribute('aria-invalid', 'true'); });
      $(`item-${Object.keys(errors)[0]}`).focus(); return;
    }
    const id = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    cart.push({ id, name, price, qty }); saveCart(); renderCart(id);
    $('item-form').reset(); $('item-name').focus(); toast('Barang masuk keranjang! ♡');
  });
  $('payment').addEventListener('input', renderPayment);
  $('reset-button').addEventListener('click', () => $('reset-dialog').showModal());
  $('cancel-reset').addEventListener('click', () => $('reset-dialog').close());
  $('confirm-reset').addEventListener('click', () => {
    cart = []; saveCart(true); $('payment').value = ''; $('item-form').reset(); clearErrors(); renderCart();
    $('reset-dialog').close(); $('item-name').focus(); toast('Siap untuk transaksi baru!');
  });
  window.addEventListener('storage', event => { if (event.key === STORAGE_KEY || event.key === null) { cart = loadCart(); renderCart(); } });
}
if (typeof module !== 'undefined') module.exports = { validateItem, calculateTotals };
