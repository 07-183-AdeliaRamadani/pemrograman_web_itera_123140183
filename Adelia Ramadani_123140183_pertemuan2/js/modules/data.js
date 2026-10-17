export const identity = {
  name: "Adelia Ramadani",
  nim: "123140183",
  className: "RB",
};
export const STORAGE_KEY = "adelia.petalDesk.items.v1";
export const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true";
export const sampleUsers = [
  { id: 1, name: "Adelia Ramadani", role: "admin", active: true, age: 22 },
  { id: 2, name: "Alya (contoh)", role: "user", active: false, age: 24 },
  { id: 3, name: "Citra (contoh)", role: "user", active: true, age: 31 },
  { id: 4, name: "Dinda (contoh)", role: "admin", active: true, age: 22 },
]; // Seluruh umur/role adalah data simulasi latihan.
export const sampleProducts = [
  { id: "P01", name: "Laptop", price: 15000000, category: "tech" },
  { id: "P02", name: "Keyboard", price: 850000, category: "tech" },
  { id: "P03", name: "Kursi belajar", price: 2200000, category: "furniture" },
];
export const starterItems = (today) => [
  {
    id: "sample-1",
    type: "task",
    title: "Selesaikan praktikum JavaScript",
    subject: "Pengembangan Aplikasi Web",
    date: today,
    priority: "high",
    body: "Contoh tugas: lengkapi kode, dokumentasi, dan screenshot.",
    completed: false,
  },
  {
    id: "sample-2",
    type: "task",
    title: "Baca ulang materi ES6+",
    subject: "Belajar mandiri",
    date: "",
    priority: "medium",
    body: "Contoh tugas: destructuring, class, dan async/await.",
    completed: false,
  },
  {
    id: "sample-3",
    type: "task",
    title: "Rapikan folder kuliah",
    subject: "Personal",
    date: "",
    priority: "low",
    body: "Contoh tugas yang sudah selesai.",
    completed: true,
  },
  {
    id: "sample-note-1",
    type: "note",
    title: "Satu hal kecil hari ini",
    subject: "Pengingat",
    date: "",
    priority: "low",
    body: "Tidak harus sempurna. Selesaikan satu langkah kecil, lalu istirahat sebentar. ♡",
    completed: false,
  },
  {
    id: "sample-note-2",
    type: "note",
    title: "Checklist sebelum mengumpulkan",
    subject: "Kuliah",
    date: "",
    priority: "medium",
    body: "Cek kembali identitas, fitur aplikasi, screenshot, dan tautan repository.",
    completed: false,
  },
];
