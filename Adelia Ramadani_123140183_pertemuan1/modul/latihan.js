'use strict';
const el = id => document.getElementById(id);
const nama = 'Adelia Ramadani';
const nim = '123140183';
let umur = null;
let kotaAsal = '';
el('profile').textContent = `Nama: ${nama} | NIM: ${nim} | Kelas: RB`;
function output(id, text) { el(id).textContent = text; }
function bindForm(id, callback) { el(id).addEventListener('submit', event => { event.preventDefault(); callback(); }); }
function categoryAge(age) { if (age < 12) return 'Anak'; if (age < 18) return 'Remaja'; if (age < 60) return 'Dewasa'; return 'Lansia'; }
bindForm('profile-form', () => {
  umur = Number(el('age').value); kotaAsal = el('city').value.trim();
  if (!Number.isInteger(umur) || umur < 0 || umur > 150 || !kotaAsal) return output('profile-result', 'Isi umur bulat 0–150 dan kota asal yang valid.');
  output('profile-result', `${nama}, ${umur} tahun, asal ${kotaAsal}. Kategori umur: ${categoryAge(umur)}.`);
});
bindForm('grade-form', () => {
  const nilai = Number(el('score').value);
  const grade = nilai >= 90 ? 'A' : nilai >= 80 ? 'B' : nilai >= 70 ? 'C' : nilai >= 60 ? 'D' : 'E';
  output('grade-result', `Nilai ${nilai} → Grade ${grade} | ${nilai >= 70 ? 'Lulus' : 'Tidak lulus'} (syarat latihan: ≥ 70)`);
});
function englishDay(day) {
  switch (day) { case 1: return 'Monday'; case 2: return 'Tuesday'; case 3: return 'Wednesday'; case 4: return 'Thursday'; case 5: return 'Friday'; case 6: return 'Saturday'; case 7: return 'Sunday'; default: return 'Hari tidak valid'; }
}
bindForm('day-form', () => output('day-result', englishDay(Number(el('day').value))));
const nilaiSiswa = [85, 92, 78, 90, 88];
let totalNilai = 0;
for (let i = 0; i < nilaiSiswa.length; i++) totalNilai += nilaiSiswa[i];
let countdown = 5;
const mundur = [];
while (countdown > 0) { mundur.push(countdown); countdown--; }
const nilaiOf = [];
for (const nilai of nilaiSiswa) nilaiOf.push(`${nilai} (${nilai >= 80 ? '≥80' : '<80'})`);
output('loop-demo', `For: ${nilaiSiswa.join(', ')} | Rata-rata: ${(totalNilai / nilaiSiswa.length).toFixed(2)}\nWhile: ${mundur.join(' → ')} | For…of: ${nilaiOf.join(', ')}`);
function sapaNama(value) { return `Halo, ${value}! Selamat belajar JavaScript! ♡`; }
bindForm('greeting-form', () => output('greeting-result', el('greeting-name').value.trim() ? sapaNama(el('greeting-name').value.trim()) : 'Nama tidak boleh kosong.'));
function calculate(a, b, operation) {
  switch (operation) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return b === 0 ? 'Pembagian dengan nol tidak diperbolehkan.' : a / b; default: return 'Operasi tidak valid.'; }
}
bindForm('calculator-form', () => {
  const a = Number(el('number-a').value); const b = Number(el('number-b').value);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return output('calculator-result', 'Masukkan angka yang valid.');
  const result = calculate(a, b, el('operation').value);
  output('calculator-result', typeof result === 'number' && !Number.isFinite(result) ? 'Hasil di luar rentang angka.' : `Hasil: ${result}`);
});
function factorial(n) { let result = 1n; for (let i = 2n; i <= BigInt(n); i++) result *= i; return result.toString(); }
function isPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
bindForm('number-form', () => {
  const n = Number(el('number').value); if (!Number.isInteger(n) || n < 0 || n > 100) return output('number-result', 'Masukkan bilangan bulat 0–100.');
  const lines = []; for (let i = 1; i <= 10; i++) lines.push(`${n} × ${i} = ${n * i}`);
  output('number-result', `${lines.join(' | ')}. Faktorial ${n}! = ${factorial(n)}. ${n} ${isPrime(n) ? 'adalah' : 'bukan'} bilangan prima.`);
});
bindForm('bmi-form', () => {
  const weight = Number(el('weight').value); const height = Number(el('height').value) / 100;
  const bmi = weight / height ** 2;
  output('bmi-result', Number.isFinite(bmi) && weight > 0 && height > 0 ? `BMI = ${weight} / ${height}² = ${bmi.toFixed(2)}. Demo perhitungan matematika praktikum.` : 'Isi berat dan tinggi positif yang valid.');
});
for (let i = 1; i <= 100; i++) { const chip = document.createElement('span'); chip.className = 'chip'; chip.textContent = i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : i; el('fizzbuzz').appendChild(chip); }
const buah = ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Anggur'];
const steps = [`Awal: ${buah.join(', ')}`]; buah.push('Durian'); steps.push(`Push: ${buah.join(', ')}`); const popped = buah.pop(); steps.push(`Pop: ${popped}`); buah.sort(); steps.push(`Sort: ${buah.join(', ')}`);
const hargaBuah = [10000, 8000, 15000, 5000, 20000]; steps.push(`Map: ${buah.map((b, i) => `${b} Rp${hargaBuah[i]}`).join(', ')}`); steps.push(`Filter > Rp10.000: ${buah.filter((b, i) => hargaBuah[i] > 10000).join(', ')}`); steps.push(`Reduce total harga: Rp${hargaBuah.reduce((sum, p) => sum + p, 0)}`); output('array-demo', steps.join('\n'));
const mahasiswa = { nama, nim, jurusan: 'Teknik Informatika', nilai: { algoritma: 85, basisData: 90, web: 88 }, hobi: ['Coding', 'Membaca'], tampilkanInfo() { return `${this.nama} (${this.nim}) – ${this.jurusan}`; }, hitungRataRata() { const v = Object.values(this.nilai); return v.reduce((s, n) => s + n, 0) / v.length; } };
const objectSteps = [mahasiswa.tampilkanInfo(), `Rata-rata awal (simulasi): ${mahasiswa.hitungRataRata().toFixed(2)}`]; mahasiswa.catatan = 'Data simulasi'; mahasiswa.nilai.web = 92; delete mahasiswa.hobi; objectSteps.push(`Tambah catatan: ${mahasiswa.catatan}`, `Ubah nilai web: ${mahasiswa.nilai.web}`, `Hobi setelah delete: ${mahasiswa.hobi ?? 'Tidak ada'}`); output('object-demo', objectSteps.join('\n'));
function warn(text) { el('lab-warning').hidden = false; output('lab-warning', text); }
function store(key, value) { try { localStorage.setItem(`adelia.lab.${key}`, JSON.stringify(value)); } catch { warn('Penyimpanan browser tidak tersedia. Perubahan hanya tersimpan selama halaman dibuka.'); } }
function read(key, fallback, validator) { try { const value = localStorage.getItem(`adelia.lab.${key}`); if (value === null) return fallback; const parsed = JSON.parse(value); if (!validator(parsed)) throw new Error(); return parsed; } catch { warn(`Data ${key} tidak dapat dimuat. Data awal digunakan.`); return fallback; } }
const seed = [{ nama, nim, jurusan:'Teknik Informatika', nilai:92 }, { nama:'Alya (contoh)', nim:'123140001', jurusan:'Teknik Informatika', nilai:85 }, { nama:'Bella (contoh)', nim:'123140002', jurusan:'Sistem Informasi', nilai:78 }, { nama:'Citra (contoh)', nim:'123140003', jurusan:'Teknik Informatika', nilai:95 }, { nama:'Dinda (contoh)', nim:'123140004', jurusan:'Sistem Informasi', nilai:88 }];
let students = read('students', seed, value => Array.isArray(value) && value.every(s => s && typeof s.nama === 'string' && s.nama.length >= 3 && typeof s.nim === 'string' && /^\d{9}$/.test(s.nim) && typeof s.jurusan === 'string' && typeof s.nilai === 'number' && Number.isFinite(s.nilai) && s.nilai >= 0 && s.nilai <= 100) && new Set(value.map(s => s.nim)).size === value.length);
let editingNim = null;
function cancelEdit() { editingNim = null; el('student-form').reset(); output('save-student', 'Tambah mahasiswa'); el('cancel-edit').hidden = true; }
function renderStudents() {
  const average = students.length ? students.reduce((s, item) => s + item.nilai, 0) / students.length : 0;
  const max = students.length ? Math.max(...students.map(s => s.nilai)) : null;
  const highest = students.filter(s => s.nilai === max).map(s => s.nama).join(', ');
  output('student-stats', `${students.length} mahasiswa | Rata-rata: ${average.toFixed(2)} | Nilai tertinggi: ${max ?? '–'} (${highest || 'Belum ada data'})`);
  const displayed = students.filter(s => !el('above-average').checked || s.nilai > average).sort((a,b) => a.nama.localeCompare(b.nama, 'id') * (el('student-sort').value === 'asc' ? 1 : -1));
  el('student-body').replaceChildren();
  for (const student of displayed) {
    const row = document.createElement('tr');
    for (const value of [student.nama, student.nim, student.jurusan, student.nilai]) { const cell = document.createElement('td'); cell.textContent = value; row.appendChild(cell); }
    const actions = document.createElement('td');
    for (const label of ['Edit', 'Hapus']) { const button = document.createElement('button'); button.type = 'button'; button.className = 'delete-button'; button.textContent = label; button.setAttribute('aria-label', `${label} ${student.nama}`); button.addEventListener('click', () => {
      if (label === 'Hapus') { students = students.filter(s => s.nim !== student.nim); if (editingNim === student.nim) cancelEdit(); store('students', students); renderStudents(); output('student-message', 'Mahasiswa dihapus.'); }
      else { editingNim = student.nim; el('student-name').value = student.nama; el('student-nim').value = student.nim; el('student-major').value = student.jurusan; el('student-score').value = student.nilai; output('save-student', 'Simpan perubahan'); el('cancel-edit').hidden = false; el('student-name').focus(); }
    }); actions.appendChild(button); actions.append(' '); }
    row.appendChild(actions); el('student-body').appendChild(row);
  }
  if (!displayed.length) { const row = document.createElement('tr'); const cell = document.createElement('td'); cell.colSpan = 5; cell.textContent = 'Tidak ada mahasiswa untuk ditampilkan.'; row.appendChild(cell); el('student-body').appendChild(row); }
}
bindForm('student-form', () => {
  const record = { nama:el('student-name').value.trim(), nim:el('student-nim').value.trim(), jurusan:el('student-major').value.trim(), nilai:Number(el('student-score').value) };
  if (record.nama.length < 3 || record.jurusan.length < 3 || !/^\d{9}$/.test(record.nim) || !Number.isFinite(record.nilai) || record.nilai < 0 || record.nilai > 100) return output('student-message', 'Nama/jurusan minimal 3 karakter, NIM 9 digit, nilai 0–100.');
  if (students.some(s => s.nim === record.nim && s.nim !== editingNim)) return output('student-message', 'NIM sudah digunakan mahasiswa lain.');
  if (editingNim) students = students.map(s => s.nim === editingNim ? record : s); else students.push(record);
  store('students', students); cancelEdit(); renderStudents(); output('student-message', 'Data mahasiswa berhasil disimpan.');
});
el('cancel-edit').addEventListener('click', cancelEdit); el('student-sort').addEventListener('change', renderStudents); el('above-average').addEventListener('change', renderStudents); renderStudents();
let itemCount = 0;
el('add-dom').addEventListener('click', () => { const item = document.createElement('span'); item.className = 'chip'; item.textContent = `Item ${++itemCount}`; el('dom-output').appendChild(item); });
el('remove-dom').addEventListener('click', () => { if (el('dom-output').lastElementChild) { el('dom-output').lastElementChild.remove(); itemCount--; } });
let colorIndex = 0;
el('color-dom').addEventListener('click', () => { const colors = ['#f3a8c4','#fff0f5','#e8dbe2','#fff']; el('dom-output').style.backgroundColor = colors[colorIndex++ % colors.length]; el('dom-output').style.color = '#211d20'; });
el('theme').addEventListener('click', () => { const dark = document.body.classList.toggle('dark'); output('theme', dark ? '☀ Mode terang' : '☾ Mode gelap'); });
let todos = read('todos', [], value => Array.isArray(value) && value.every(t => t && typeof t.id === 'string' && typeof t.text === 'string' && typeof t.done === 'boolean') && new Set(value.map(t => t.id)).size === value.length);
function renderTodos() {
  el('todo-list').replaceChildren();
  for (const todo of todos) {
    const li = document.createElement('li'); const check = document.createElement('input'); check.type = 'checkbox'; check.checked = todo.done; check.setAttribute('aria-label', `Tandai selesai: ${todo.text}`); check.addEventListener('change', () => { todo.done = check.checked; store('todos', todos); renderTodos(); });
    const label = document.createElement('span'); label.textContent = todo.text; label.className = todo.done ? 'done' : '';
    const remove = document.createElement('button'); remove.className = 'delete-button'; remove.textContent = 'Hapus'; remove.setAttribute('aria-label', `Hapus todo ${todo.text}`); remove.addEventListener('click', () => { todos = todos.filter(t => t.id !== todo.id); store('todos', todos); renderTodos(); });
    li.append(check, label, remove); el('todo-list').appendChild(li);
  }
  if (!todos.length) output('todo-list', 'Belum ada kegiatan. Tambahkan kegiatan pertamamu!');
}
bindForm('todo-form', () => { const text = el('todo-input').value.trim(); if (!text) { el('todo-input').setCustomValidity('Kegiatan tidak boleh kosong.'); el('todo-input').reportValidity(); return; } todos.push({ id:`${Date.now()}-${Math.random()}`, text, done:false }); store('todos', todos); renderTodos(); el('todo-form').reset(); });
el('todo-input').addEventListener('input', () => el('todo-input').setCustomValidity('')); renderTodos();
let posts = []; let page = 1; const pageSize = 5;
function renderPosts() {
  const query = el('post-search').value.toLowerCase().trim();
  const filtered = posts.filter(post => post.title.toLowerCase().includes(query));
  const pages = Math.ceil(filtered.length / pageSize); page = Math.max(1, Math.min(page, pages || 1));
  el('posts').replaceChildren();
  for (const post of filtered.slice((page - 1) * pageSize, page * pageSize)) { const article = document.createElement('article'); article.className = 'post'; const title = document.createElement('h4'); title.textContent = post.title; const body = document.createElement('p'); body.textContent = post.body; article.append(title, body); el('posts').appendChild(article); }
  output('page-number', `Halaman ${pages ? page : 0} / ${pages}`); el('previous').disabled = page <= 1 || !pages; el('next').disabled = page >= pages;
  if (!filtered.length && posts.length) output('posts', 'Tidak ada post yang cocok dengan judul tersebut.');
}
el('fetch-posts').addEventListener('click', async () => {
  const button = el('fetch-posts'); button.disabled = true; output('api-status', 'Sedang mengambil data…'); const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 15000);
  try { const response = await fetch('https://jsonplaceholder.typicode.com/posts', { signal:controller.signal }); if (!response.ok) throw new Error(`HTTP ${response.status}`); const data = await response.json(); if (!Array.isArray(data) || data.some(p => typeof p.title !== 'string' || typeof p.body !== 'string')) throw new Error('Format respons tidak valid'); posts = data; page = 1; renderPosts(); output('api-status', `${posts.length} post berhasil dimuat.`); }
  catch (error) { output('api-status', `Gagal mengambil data: ${error.name === 'AbortError' ? 'Waktu tunggu habis' : error.message}. Periksa internet lalu coba lagi.`); }
  finally { clearTimeout(timer); button.disabled = false; }
});
el('post-search').addEventListener('input', () => { page = 1; renderPosts(); }); el('previous').addEventListener('click', () => { page--; renderPosts(); }); el('next').addEventListener('click', () => { page++; renderPosts(); });
