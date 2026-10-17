import { TaskItem } from "./task-item.js";
import { STORAGE_KEY, WEATHER_URL, starterItems } from "./data.js";
import { todayISO } from "./utils.js";
import { fetchJSON, weatherLabel } from "./network.js";

// State dan persistensi terpisah dari DOM; antarmuka dapat memakai model yang sama.
export class DashboardApp {
  constructor({
    storage = globalThis.localStorage,
    fetcher = globalThis.fetch,
    onWarning = () => {},
  } = {}) {
    this.storage = storage;
    this.fetcher = fetcher;
    this.onWarning = onWarning;
    this.items = [];
  }

  load() {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (raw === null) {
        this.items = starterItems(todayISO()).map((item) => new TaskItem(item));
        this.persist(this.items);
        return this.items;
      }
      const records = JSON.parse(raw);
      if (!Array.isArray(records) || records.length > 1000)
        throw new Error("Daftar tersimpan tidak valid.");
      const items = records.map((record) => TaskItem.fromJSON(record));
      if (new Set(items.map(({ id }) => id)).size !== items.length)
        throw new Error("Ada ID duplikat.");
      this.items = items;
    } catch {
      this.items = [];
      this.onWarning(
        "Data lokal tidak dapat dibaca. Daftar kosong ditampilkan. Data lama tidak ditimpa sampai Anda menyimpan perubahan baru.",
      );
    }
    return this.items;
  }

  persist(items) {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(items));
      return true;
    } catch {
      this.onWarning(
        "Penyimpanan browser tidak tersedia atau penuh. Perubahan tetap tampil, tetapi dapat hilang saat halaman dimuat ulang.",
      );
      return false;
    }
  }

  commit(items) {
    this.items = items;
    return this.persist(items);
  }
  addItem(data) {
    if (this.items.length >= 1000)
      throw new Error("Maksimal 1.000 item. Hapus item lama terlebih dahulu.");
    const item = new TaskItem(data);
    if (this.items.some(({ id }) => id === item.id))
      throw new Error("ID item sudah digunakan.");
    this.commit([...this.items, item]);
    return item;
  }
  updateItem(id, changes) {
    const existing = this.items.find((item) => item.id === id);
    if (!existing) throw new Error("Item tidak ditemukan. Muat ulang daftar.");
    const updated = existing.withChanges(changes);
    this.commit(this.items.map((item) => (item.id === id ? updated : item)));
    return updated;
  }
  deleteItem(id) {
    if (!this.items.some((item) => item.id === id))
      throw new Error("Item sudah dihapus.");
    this.commit(this.items.filter((item) => item.id !== id));
  }
  toggleItem(id) {
    const item = this.items.find((item) => item.id === id);
    if (!item?.isTask)
      throw new Error("Hanya tugas yang bisa ditandai selesai.");
    return this.updateItem(id, { completed: !item.completed });
  }
  getItems({
    type = "task",
    status = "all",
    search = "",
    priority = "all",
    sort = "date",
  } = {}) {
    const query = search.toLocaleLowerCase("id-ID").trim();
    return this.items
      .filter((item) => item.type === type)
      .filter(
        ({ completed }) =>
          status === "all" || (status === "done" ? completed : !completed),
      )
      .filter((item) => priority === "all" || item.priority === priority)
      .filter(({ title, subject, body }) =>
        `${title} ${subject} ${body}`
          .toLocaleLowerCase("id-ID")
          .includes(query),
      )
      .sort((a, b) =>
        sort === "name"
          ? a.title.localeCompare(b.title, "id")
          : a.completed - b.completed ||
            (a.date || "9999").localeCompare(b.date || "9999") ||
            a.title.localeCompare(b.title, "id"),
      );
  }
  get stats() {
    const tasks = this.items.filter(({ type }) => type === "task");
    const done = tasks.filter(({ completed }) => completed).length;
    const due = tasks.filter(
      ({ completed, date }) => !completed && date && date <= todayISO(),
    ).length;
    return {
      total: tasks.length,
      done,
      active: tasks.length - done,
      due,
      progress: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
    };
  }

  async fetchWeather() {
    const { current_weather: current } = await fetchJSON(WEATHER_URL, {
      fetcher: this.fetcher,
    });
    if (
      !current ||
      !Number.isFinite(current.temperature) ||
      !Number.isFinite(current.weathercode) ||
      typeof current.time !== "string" ||
      current.temperature < -100 ||
      current.temperature > 100
    )
      throw new Error("Format cuaca dari server tidak valid.");
    return {
      temperature: Math.round(current.temperature),
      description: weatherLabel(current.weathercode),
      observedAt: current.time,
      isDay: current.is_day === 1,
    };
  }
}
