import { test } from "node:test";
import assert from "node:assert/strict";
import { TaskItem } from "../js/modules/task-item.js";
import { DashboardApp } from "../js/modules/dashboard.js";
import { STORAGE_KEY } from "../js/modules/data.js";
import { fetchJSON } from "../js/modules/network.js";
import {
  escapeHTML,
  statistics,
  todayISO,
  validDate,
} from "../js/modules/utils.js";
import * as demos from "../js/app.js";

const storage = () => {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
};
const fixture = () => {
  const local = storage();
  local.setItem(STORAGE_KEY, "[]");
  const app = new DashboardApp({ storage: local });
  app.load();
  return { app, local };
};
test("TaskItem memvalidasi judul, tanggal kalender, dan prioritas", () => {
  assert.throws(() => new TaskItem({ title: "  " }));
  assert.throws(() => new TaskItem({ title: "Tugas", date: "2026-02-30" }));
  assert.throws(() => new TaskItem({ title: "Tugas", priority: "urgent" }));
  assert.equal(new TaskItem({ title: "  Belajar ES6  " }).title, "Belajar ES6");
});
test("tanggal Jakarta menggunakan zona WIB, bukan zona host", () => {
  assert.equal(todayISO(new Date("2026-10-17T18:00:00Z")), "2026-10-18");
  assert.equal(validDate("2024-02-29"), true);
  assert.equal(validDate("2026-02-29"), false);
});
test("CRUD membuat array baru dan mempertahankan ID saat edit", () => {
  const { app } = fixture();
  const before = app.items;
  const item = app.addItem({ title: "Belajar JavaScript" });
  assert.notEqual(app.items, before);
  assert.equal(before.length, 0);
  const original = app.items;
  const updated = app.updateItem(item.id, {
    title: "Belajar ES6+",
    id: "ID palsu",
  });
  assert.equal(updated.id, item.id);
  assert.equal(original[0].title, "Belajar JavaScript");
  assert.equal(app.items[0].title, "Belajar ES6+");
  app.deleteItem(item.id);
  assert.equal(app.items.length, 0);
});
test("tandai selesai memperbarui statistik; catatan tidak dihitung sebagai tugas", () => {
  const { app } = fixture();
  const item = app.addItem({ title: "Deadline hari ini", date: todayISO() });
  app.addItem({ title: "Catatan kecil", type: "note" });
  assert.equal(app.stats.due, 1);
  app.toggleItem(item.id);
  assert.deepEqual(app.stats, {
    total: 1,
    done: 1,
    active: 0,
    due: 0,
    progress: 100,
  });
  app.toggleItem(item.id);
  assert.equal(app.stats.active, 1);
});
test("filter judul/label/detail, prioritas, status, dan pengurutan bekerja bersama", () => {
  const { app } = fixture();
  app.addItem({
    title: "Zebra",
    subject: "PAW",
    body: "destructuring",
    priority: "high",
  });
  app.addItem({
    title: "Alpha",
    subject: "PAW",
    priority: "low",
    completed: true,
  });
  assert.equal(
    app.getItems({
      search: "DESTRUCTURING",
      priority: "high",
      status: "active",
    }).length,
    1,
  );
  assert.deepEqual(
    app.getItems({ sort: "name" }).map((i) => i.title),
    ["Alpha", "Zebra"],
  );
  assert.equal(app.getItems({ status: "done" })[0].title, "Alpha");
});
test("data bertahan setelah model dimuat ulang dan kembali menjadi instance TaskItem", () => {
  const { app, local } = fixture();
  app.addItem({ title: "Tugas persisten" });
  const restored = new DashboardApp({ storage: local });
  restored.load();
  assert.equal(restored.items[0].title, "Tugas persisten");
  assert.ok(restored.items[0] instanceof TaskItem);
});
test("array kosong yang tersimpan tidak diisi ulang dengan data contoh", () => {
  const { app } = fixture();
  assert.equal(app.items.length, 0);
});
test("JSON rusak dan ID duplikat dipulihkan tanpa menimpa data lama", () => {
  const local = storage();
  local.setItem(STORAGE_KEY, "{broken");
  const warnings = [];
  const app = new DashboardApp({
    storage: local,
    onWarning: (message) => warnings.push(message),
  });
  app.load();
  assert.equal(app.items.length, 0);
  assert.equal(local.getItem(STORAGE_KEY), "{broken");
  assert.equal(warnings.length, 1);
  const record = new TaskItem({
    id: "duplicate",
    title: "Item contoh",
  }).toJSON();
  local.setItem(STORAGE_KEY, JSON.stringify([record, record]));
  app.load();
  assert.equal(app.items.length, 0);
  assert.equal(warnings.length, 2);
});
test("storage ditolak: perubahan tetap berjalan dan peringatan muncul", () => {
  const warnings = [];
  const app = new DashboardApp({
    storage: {
      getItem: () => "[]",
      setItem: () => {
        throw new Error("Quota");
      },
    },
    onWarning: (message) => warnings.push(message),
  });
  app.load();
  app.addItem({ title: "Tetap tersimpan di memori" });
  assert.equal(app.items.length, 1);
  assert.equal(warnings.length, 1);
});
test("format record tersimpan ditolak bila tanggal bukan string", () => {
  assert.throws(() =>
    TaskItem.fromJSON({
      id: "a",
      type: "task",
      title: "Tugas",
      subject: "",
      date: 10,
      priority: "low",
      body: "",
      completed: false,
    }),
  );
});
test("input HTML di-escape sebelum template dirender", () => {
  assert.equal(
    escapeHTML('<img src=x onerror="x">'),
    "&lt;img src=x onerror=&quot;x&quot;&gt;",
  );
});
test("HTTP gagal dicoba ulang, berhasil setelah retry", async () => {
  let calls = 0;
  const data = await fetchJSON("/fake", {
    baseDelay: 1,
    fetcher: async () =>
      ++calls === 1
        ? { ok: false, status: 503 }
        : { ok: true, json: async () => ({ success: true }) },
  });
  assert.equal(calls, 2);
  assert.equal(data.success, true);
});
test("HTTP 404 tidak dicoba ulang", async () => {
  let calls = 0;
  await assert.rejects(
    fetchJSON("/fake", {
      fetcher: async () => {
        calls++;
        return { ok: false, status: 404 };
      },
    }),
    /404/,
  );
  assert.equal(calls, 1);
});
test("request timeout dibatalkan dan error diteruskan ke caller", async () => {
  await assert.rejects(
    fetchJSON("/slow", {
      timeout: 5,
      retries: 0,
      fetcher: (url, { signal }) =>
        new Promise((resolve, reject) =>
          signal.addEventListener("abort", () => reject(new Error("Timeout")), {
            once: true,
          }),
        ),
    }),
    /Timeout/,
  );
});
test("cuaca riil dipetakan dan respons rusak ditolak", async () => {
  const app = new DashboardApp({
    storage: storage(),
    fetcher: async () => ({
      ok: true,
      json: async () => ({
        current_weather: {
          temperature: 28.6,
          weathercode: 3,
          time: "2026-10-17T12:00",
          is_day: 1,
        },
      }),
    }),
  });
  assert.deepEqual(await app.fetchWeather(), {
    temperature: 29,
    description: "Cerah berawan",
    observedAt: "2026-10-17T12:00",
    isDay: true,
  });
  app.fetcher = async () => ({ ok: true, json: async () => ({}) });
  await assert.rejects(app.fetchWeather(), /Format cuaca/);
});
test("latihan template literal setara concatenation dan memuat HTML multi-baris", () => {
  const result = demos.demoTemplateLiterals();
  assert.equal(result.oldWay, result.newWay);
  assert.match(result.multiLine, /Adelia Ramadani/);
  assert.ok(result.multiLine.includes("\n"));
});
test("const reassignment dan TDZ ditangani; class inheritance berjalan", () => {
  const vars = demos.demoVariables();
  assert.match(vars.reassignmentError, /TypeError/);
  assert.equal(vars.tdzError, "ReferenceError");
  assert.equal(demos.demoClasses().isProduct, true);
  assert.equal(demos.demoClasses().getterAfterSetter, 12000);
});
test("latihan statistik, groupBy, dan array tidak merusak sumber", () => {
  assert.deepEqual(statistics(2, 4, 6), { min: 2, max: 6, average: 4 });
  assert.deepEqual(statistics(), { min: null, max: null, average: null });
  assert.equal(demos.demoArrayMethods().groupByCategory.tech.length, 2);
  assert.deepEqual(demos.demoAdvancedArrays().deepFlat, [1, 2, 3, 4, 5, 6]);
});
test("Promise rejection dan error async tertangani tanpa DOM", async () => {
  const [promises, asyncDemo] = await Promise.all([
    demos.demoPromises(),
    demos.demoAsyncAwait(),
  ]);
  assert.match(promises.rejectionHandled, /ID user tidak valid/);
  assert.equal(promises.settled[1].status, "rejected");
  assert.equal(asyncDemo.totalPosts, 6);
  assert.equal(asyncDemo.handledError.success, false);
});
