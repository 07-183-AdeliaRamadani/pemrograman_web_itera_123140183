// Arrow functions, default parameters, dan utilitas bersama.
export const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
export const capitalize = (text = "") =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
export const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
export const todayISO = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
export const validDate = (value) => {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};
export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date(`${value}T12:00:00+07:00`))
    : "Tanpa tenggat";
export const groupBy = (items, key) =>
  items.reduce(
    (groups, item) => ({
      ...groups,
      [item[key]]: [...(groups[item[key]] ?? []), item],
    }),
    {},
  );
export const statistics = (...numbers) =>
  numbers.length
    ? {
        min: Math.min(...numbers),
        max: Math.max(...numbers),
        average:
          numbers.reduce((sum, number) => sum + number, 0) / numbers.length,
      }
    : { min: null, max: null, average: null };
export const debounce = (callback, delay = 350) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};
export const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
