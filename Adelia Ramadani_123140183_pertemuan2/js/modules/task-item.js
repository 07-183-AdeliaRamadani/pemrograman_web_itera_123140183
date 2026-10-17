import { validDate } from "./utils.js";

// Domain model: constructor dengan destructuring dan nilai default.
export class TaskItem {
  constructor({
    id = globalThis.crypto.randomUUID(),
    type = "task",
    title = "",
    subject = "",
    date = "",
    priority = "medium",
    body = "",
    completed = false,
  } = {}) {
    this.id = id;
    this.type = type;
    this.title = title.trim();
    this.subject = subject.trim();
    this.date = date;
    this.priority = priority;
    this.body = body.trim();
    this.completed = completed;
    const errors = this.validate();
    if (Object.keys(errors).length)
      throw Object.assign(new Error("Data item tidak valid."), { errors });
  }

  validate() {
    const errors = {};
    if (!["task", "note"].includes(this.type))
      errors.type = "Pilih jenis informasi yang valid.";
    if (this.title.length < 3 || this.title.length > 100)
      errors.title = "Judul harus 3–100 karakter.";
    if (this.subject.length > 60)
      errors.subject = "Label maksimal 60 karakter.";
    if (
      !validDate(this.date) ||
      (this.date && (this.date < "2000-01-01" || this.date > "2100-12-31"))
    )
      errors.date = "Tanggal harus valid, antara tahun 2000–2100.";
    if (!["high", "medium", "low"].includes(this.priority))
      errors.priority = "Prioritas tidak valid.";
    if (this.body.length > 1500)
      errors.body = "Catatan maksimal 1.500 karakter.";
    if (
      typeof this.completed !== "boolean" ||
      typeof this.id !== "string" ||
      !this.id ||
      this.id.length > 100
    )
      errors.title = "Struktur data item tidak valid.";
    return errors;
  }

  get isTask() {
    return this.type === "task";
  }
  withChanges(changes = {}) {
    return new TaskItem({ ...this.toJSON(), ...changes, id: this.id });
  }
  toJSON() {
    const { id, type, title, subject, date, priority, body, completed } = this;
    return { id, type, title, subject, date, priority, body, completed };
  }
  static fromJSON(value) {
    if (
      !value ||
      typeof value !== "object" ||
      ["id", "type", "title", "subject", "date", "priority", "body"].some(
        (key) => typeof value[key] !== "string",
      ) ||
      typeof value.completed !== "boolean"
    )
      throw new Error("Format data tersimpan tidak valid.");
    return new TaskItem(value);
  }
}
