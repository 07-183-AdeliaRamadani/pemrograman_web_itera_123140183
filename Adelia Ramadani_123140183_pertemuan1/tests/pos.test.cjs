const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateItem, calculateTotals } = require('../script.js');
test('validasi menerima batas minimal harga Rp500 dan qty 1', () => assert.deepEqual(validateItem('Air', '500', '1'), {}));
test('validasi menolak nama kosong/pendek, harga kosong/negatif/di bawah batas dan qty pecahan', () => {
  for (const name of ['', '  ', 'ab']) assert.ok(validateItem(name, '500', '1').name);
  for (const price of ['', ' ', '-500', '0', '499', 'abc', 'Infinity', '500.5']) assert.ok(validateItem('Buku', price, '1').price);
  for (const qty of ['', '0', '-1', '1.5', 'abc', 'Infinity']) assert.ok(validateItem('Buku', '500', qty).qty);
});
test('keranjang kosong bernilai nol', () => assert.deepEqual(calculateTotals([]), {subtotal:0,discount:0,total:0}));
test('subtotal harga kali qty dan total gabungan', () => assert.deepEqual(calculateTotals([{price:5000,qty:2},{price:8000,qty:3}]), {subtotal:34000,discount:0,total:34000}));
test('ambang diskon Rp50.000 berlaku tepat pada batas', () => {
  assert.equal(calculateTotals([{price:49999,qty:1}]).discount, 0);
  assert.deepEqual(calculateTotals([{price:25000,qty:2}]), {subtotal:50000,discount:5000,total:45000});
});
test('skenario transaksi Rp75.000 menjadi Rp67.500', () => assert.deepEqual(calculateTotals([{price:15000,qty:3},{price:10000,qty:3}]), {subtotal:75000,discount:7500,total:67500}));
test('hapus barang menyebabkan diskon dihitung ulang', () => {
  const cart = [{price:30000,qty:1},{price:25000,qty:1}]; assert.equal(calculateTotals(cart).discount,5500); cart.pop(); assert.deepEqual(calculateTotals(cart),{subtotal:30000,discount:0,total:30000});
});
test('batas nominal mencegah subtotal terlalu besar', () => assert.ok(validateItem('Buku', '1000000000000', '2').qty));
