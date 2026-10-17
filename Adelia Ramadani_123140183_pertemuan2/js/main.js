import { DashboardApp } from "./modules/dashboard.js";
import { TaskItem } from "./modules/task-item.js";
import { STORAGE_KEY } from "./modules/data.js";
import { escapeHTML, formatDate, todayISO, debounce } from "./modules/utils.js";
import * as demos from "./app.js";

const $ = (id) => document.getElementById(id);
const priorityLabels = { high: "Tinggi", medium: "Sedang", low: "Rendah" };
let toastTimer;
const toast = (message) => {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
};

if ($("dashboard")) {
  const warning = (message) => {
    $("storage-warning").hidden = false;
    $("storage-warning").textContent = message;
  };
  const app = new DashboardApp({ onWarning: warning });
  app.load();
  let view = "task";
  let status = "all";
  let pendingDelete = null;
  const options = () => ({
    type: view,
    status: view === "note" ? "all" : status,
    search: $("search").value,
    priority: $("priority-filter").value,
    sort: $("sort").value,
  });

  // Template literals untuk rendering dinamis. Seluruh input di-escape lebih dahulu.
  const actionsHTML = ({ id, title }) =>
    `<div class="item-actions"><button type="button" data-action="edit" data-id="${escapeHTML(id)}" aria-label="Edit ${escapeHTML(title)}">Edit</button><button type="button" data-action="delete" data-id="${escapeHTML(id)}" aria-label="Hapus ${escapeHTML(title)}">Hapus</button></div>`;
  const taskHTML = ({ id, title, subject, date, priority, body, completed }) =>
    `<article class="task-row"><input class="task-check" type="checkbox" data-action="toggle" data-id="${escapeHTML(id)}" aria-label="Tandai selesai: ${escapeHTML(title)}" ${completed ? "checked" : ""}><div class="task-content ${completed ? "done" : ""}"><h3>${escapeHTML(title)}</h3><div class="task-meta">${subject ? `<span class="subject-tag">${escapeHTML(subject)}</span>` : ""}<span class="${!completed && date && date <= todayISO() ? "overdue" : ""}">◷ ${escapeHTML(formatDate(date))}</span><span class="priority-tag priority-${priority}">${priorityLabels[priority]}</span></div>${body ? `<p class="task-description">${escapeHTML(body)}</p>` : ""}</div>${actionsHTML({ id, title })}</article>`;
  const noteHTML = ({ id, title, subject, body, date, priority }) =>
    `<article class="note-card">${subject ? `<span class="subject-tag">${escapeHTML(subject)}</span>` : ""}<h3>${escapeHTML(title)}</h3><p>${escapeHTML(body || "Belum ada detail catatan.")}</p>${date ? `<p>◷ ${escapeHTML(formatDate(date))}</p>` : ""}<span class="priority-tag priority-${priority}">${priorityLabels[priority]}</span>${actionsHTML({ id, title })}</article>`;
  const emptyHTML = (message) =>
    `<div class="empty-state"><span aria-hidden="true">♡</span><strong>${message}</strong><p>Tambahkan informasi baru atau coba kata pencarian lain.</p></div>`;

  function render() {
    const { active, done, due, progress, total } = app.stats;
    $("stat-active").innerHTML = `${active}<span>tugas aktif</span>`;
    $("stat-done").innerHTML = `${done}<span>tugas selesai</span>`;
    $("stat-due").innerHTML = `${due}<span>perlu perhatian</span>`;
    $("progress-number").textContent = `${progress}%`;
    $("progress-fill").style.width = `${progress}%`;
    $("progress").setAttribute("aria-valuenow", progress);
    $("progress-caption").textContent = total
      ? `${done} dari ${total} tugas selesai. Terus bertumbuh, ya!`
      : "Belum ada tugas. Mulai dari satu langkah kecil.";
    const items = app.getItems(options());
    $("item-list").className =
      view === "note" ? "item-list note-grid note-view" : "item-list";
    $("item-list").innerHTML = items.length
      ? items.map(view === "task" ? taskHTML : noteHTML).join("")
      : emptyHTML("Belum ada yang cocok di sini.");
    $("result-count").textContent =
      `${items.length} ${view === "task" ? "tugas" : "catatan"}`;
    const notes = app.getItems({ type: "note", sort: "name" });
    $("note-count").textContent = notes.length;
    $("note-preview-list").innerHTML = notes.length
      ? notes.slice(0, 2).map(noteHTML).join("")
      : emptyHTML("Simpan ide pertamamu.");
    document.querySelector(".notes-preview").hidden = view === "note";
    $("list-footer-text").textContent =
      "Data awal berupa contoh; semua informasi dapat diubah.";
  }

  const clearErrors = () => {
    ["title", "subject", "date", "priority", "body"].forEach((key) => {
      $(`${key}-error`).textContent = "";
      $(`item-${key}`).setAttribute("aria-invalid", "false");
    });
    $("form-error").textContent = "";
  };
  function openForm({ type = view, item = null } = {}) {
    clearErrors();
    $("item-form").reset();
    $("item-id").value = item?.id ?? "";
    $("item-type").value = item?.type ?? type;
    $("dialog-title").textContent = item
      ? "Rapikan informasimu"
      : type === "note"
        ? "Tulis catatan kecil"
        : "Tambah tugas baru";
    for (const key of ["title", "subject", "date", "priority", "body"])
      if (item) $(`item-${key}`).value = item[key];
    $("item-dialog").showModal();
    $("item-title").focus();
  }
  $("add-item").addEventListener("click", () => openForm());
  $("add-note").addEventListener("click", () => openForm({ type: "note" }));
  $("close-dialog").addEventListener("click", () => $("item-dialog").close());
  $("item-form").addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    const id = $("item-id").value;
    const data = Object.fromEntries(
      ["type", "title", "subject", "date", "priority", "body"].map((key) => [
        key,
        $(`item-${key}`).value,
      ]),
    );
    try {
      if (id) app.updateItem(id, data);
      else app.addItem(data);
      $("item-dialog").close();
      render();
      toast(
        id ? "Perubahan disimpan ♡" : "Satu rencana kecil sudah ditambahkan ♡",
      );
    } catch (error) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, message]) => {
          if ($(`${key}-error`)) {
            $(`${key}-error`).textContent = message;
            $(`item-${key}`).setAttribute("aria-invalid", "true");
          } else $("form-error").textContent = message;
        });
        const firstField = Object.keys(error.errors).find((key) =>
          $(`item-${key}`),
        );
        if (firstField) $(`item-${firstField}`).focus();
      } else $("form-error").textContent = error.message;
    }
  });

  function handleAction(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const { action, id } = target.dataset;
    const item = app.items.find((item) => item.id === id);
    if (!item) return;
    try {
      if (action === "toggle") {
        app.toggleItem(id);
        render();
        toast(
          item.completed
            ? "Tugas dikembalikan ke daftar aktif."
            : "Satu langkah selesai. Good job! ♡",
        );
      }
      if (action === "edit") openForm({ item });
      if (action === "delete") {
        pendingDelete = id;
        $("delete-description").textContent =
          `“${item.title}” akan dihapus dari perangkat ini.`;
        $("delete-dialog").showModal();
      }
    } catch (error) {
      toast(error.message);
      render();
    }
  }
  $("item-list").addEventListener("click", handleAction);
  $("note-preview-list").addEventListener("click", handleAction);
  $("cancel-delete").addEventListener("click", () => {
    pendingDelete = null;
    $("delete-dialog").close();
  });
  $("delete-dialog").addEventListener("cancel", () => {
    pendingDelete = null;
  });
  $("confirm-delete").addEventListener("click", () => {
    try {
      if (pendingDelete) app.deleteItem(pendingDelete);
      pendingDelete = null;
      $("delete-dialog").close();
      render();
      toast("Informasi dihapus. Ada ruang untuk rencana baru.");
    } catch (error) {
      toast(error.message);
    }
  });
  document.querySelectorAll("[data-view]").forEach((button) =>
    button.addEventListener("click", () => {
      view = button.dataset.view;
      $("search").value = "";
      $("priority-filter").value = "all";
      document.querySelectorAll("[data-view]").forEach((item) => {
        item.classList.toggle("active", item === button);
        if (item === button) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
      $("breadcrumb-current").textContent =
        view === "task" ? "Dashboard" : "Catatan kecil";
      $("list-title").innerHTML =
        view === "task"
          ? 'Daftar tugasmu<span class="pink">.</span>'
          : 'Tempat ide bertumbuh<span class="pink">.</span>';
      $("add-item").innerHTML =
        `<span>＋</span> Tambah ${view === "task" ? "tugas" : "catatan"}`;
      document.querySelector(".filter-tabs").hidden = view === "note";
      render();
    }),
  );
  document.querySelectorAll("[data-status]").forEach((button) =>
    button.addEventListener("click", () => {
      status = button.dataset.status;
      document.querySelectorAll("[data-status]").forEach((item) => {
        item.classList.toggle("selected", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      render();
    }),
  );
  $("search").addEventListener("input", render);
  $("priority-filter").addEventListener("change", render);
  $("sort").addEventListener("change", render);
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      app.load();
      render();
    }
  });

  let weatherBusy = false;
  async function loadWeather() {
    if (weatherBusy) return;
    weatherBusy = true;
    $("refresh-weather").disabled = true;
    $("weather-description").textContent = "Memuat cuaca…";
    $("weather-status").textContent = "Menghubungi Open-Meteo…";
    try {
      const { temperature, description, isDay } = await app.fetchWeather();
      $("weather-temp").innerHTML = `${temperature}<span>°C</span>`;
      $("weather-description").textContent = description;
      $("weather-icon").textContent = isDay ? "☀" : "☾";
      $("weather-status").textContent =
        `Open-Meteo · Diperbarui ${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(new Date())} WIB`;
    } catch {
      $("weather-temp").innerHTML = "—<span>°C</span>";
      $("weather-description").textContent = "Cuaca belum tersedia";
      $("weather-icon").textContent = "☁";
      $("weather-status").textContent =
        "Periksa internet, lalu tekan ↻ untuk mencoba lagi. Tugas tetap dapat digunakan.";
    } finally {
      weatherBusy = false;
      $("refresh-weather").disabled = false;
    }
  }
  $("refresh-weather").addEventListener("click", loadWeather);

  const updateClock = () => {
    const now = new Date();
    $("clock").textContent =
      `${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" }).format(now)} WIB`;
    $("today-label").textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    })
      .format(now)
      .toUpperCase();
  };
  let remaining = 25 * 60;
  let deadline = null;
  let lastDay = todayISO();
  function renderTimer() {
    $("timer").textContent =
      `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
    $("timer-toggle").innerHTML = deadline
      ? "Jeda fokus <span>Ⅱ</span>"
      : remaining === 0
        ? "Fokus lagi <span>▷</span>"
        : "Mulai fokus <span>▷</span>";
  }
  $("timer-toggle").addEventListener("click", () => {
    if (deadline) {
      remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      deadline = null;
      $("timer-status").textContent = "Dijeda. Tarik napas sebentar, ya.";
    } else {
      if (remaining === 0) remaining = 25 * 60;
      deadline = Date.now() + remaining * 1000;
      $("timer-status").textContent = "Satu hal dalam satu waktu. Kamu bisa!";
    }
    renderTimer();
  });
  $("timer-reset").addEventListener("click", () => {
    deadline = null;
    remaining = 25 * 60;
    renderTimer();
    $("timer-status").textContent = "Siapkan air minum, lalu mulai.";
  });
  setInterval(() => {
    updateClock();
    if (todayISO() !== lastDay) {
      lastDay = todayISO();
      render();
    }
    if (deadline) {
      remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (!remaining) {
        deadline = null;
        $("timer-status").textContent =
          "Fokus selesai! Saatnya istirahat sebentar ♡";
        toast("25 menit selesai. Terima kasih sudah berusaha ♡");
      }
      renderTimer();
    }
  }, 1000);
  render();
  updateClock();
  loadWeather();
}

// Halaman praktikum: seluruh 12 demo diimpor dari app.js.
export function addOutput(title, subtitle, content) {
  const card = document.createElement("article");
  card.className = "output-item";
  card.innerHTML = `<h3>${escapeHTML(title)}</h3><p>${escapeHTML(subtitle)}</p><pre class="result"></pre>`;
  card.querySelector("pre").textContent =
    typeof content === "string" ? content : JSON.stringify(content, null, 2);
  $("output").appendChild(card);
  return card;
}

if ($("runBtn")) {
  const demoList = [
    [
      "Let dan Const",
      "Function scope, block scope, const object, error reassignment, dan TDZ.",
      demos.demoVariables,
    ],
    [
      "Arrow Functions",
      "Fungsi reguler, implicit return, objek literal, dan lexical this.",
      demos.demoArrowFunctions,
    ],
    [
      "Template Literals",
      "Concatenation vs interpolasi, multi-line HTML, ekspresi, dan tagged template.",
      demos.demoTemplateLiterals,
    ],
    [
      "Destructuring",
      "Objek tiga level, alias, default, array, skip, rest, dan swap.",
      demos.demoDestructuring,
    ],
    [
      "Spread / Rest",
      "Salin dan gabungkan data, statistik min/max/rata-rata, shallow copy, dan for…of.",
      demos.demoSpreadRest,
    ],
    [
      "Default Parameters",
      "Bandingkan nilai falsy dan default; parameter dengan destructuring.",
      demos.demoDefaultParams,
    ],
    [
      "Classes",
      "Product, DigitalProduct, PhysicalProduct, getter/setter, static, dan inheritance.",
      demos.demoClasses,
    ],
    [
      "Enhanced Object Literals",
      "Property shorthand, method shorthand, computed dan dynamic keys.",
      demos.demoObjectLiterals,
    ],
    [
      "Modern Array Methods",
      "map/filter/find/some/every/reduce, groupBy, rata-rata, dan analisis chaining.",
      demos.demoArrayMethods,
    ],
    [
      "Advanced Arrays",
      "Array.from/of, flat, flatMap, includes, dan spread array.",
      demos.demoAdvancedArrays,
    ],
    [
      "Promises",
      "Promise dasar, chaining, all/race/allSettled/any; error ditangani.",
      demos.demoPromises,
    ],
    [
      "Async/Await",
      "Operasi berurutan dan paralel, serta penanganan error asinkron.",
      demos.demoAsyncAwait,
    ],
  ];
  let generation = 0;
  async function runAllDemos() {
    const run = ++generation;
    $("output").replaceChildren();
    $("runBtn").disabled = true;
    $("demo-status").textContent = "Menjalankan 12 demo…";
    const pending = demoList.map(([title, subtitle, callback], index) => {
      const card = addOutput(`${index + 1}. ${title}`, subtitle, "Memuat…");
      return Promise.resolve()
        .then(callback)
        .then((result) => {
          if (run === generation)
            card.querySelector("pre").textContent = JSON.stringify(
              result,
              null,
              2,
            );
        })
        .catch((error) => {
          if (run === generation)
            card.querySelector("pre").textContent =
              `Error tertangani: ${error.message}`;
        });
    });
    await Promise.all(pending);
    if (run === generation) {
      $("runBtn").disabled = false;
      $("demo-status").textContent =
        "12 demo selesai. Nilai umur pada data demo adalah simulasi.";
    }
  }
  $("runBtn").addEventListener("click", runAllDemos);
  $("clearBtn").addEventListener("click", () => {
    generation++;
    $("output").replaceChildren();
    $("runBtn").disabled = false;
    $("demo-status").textContent = "Output dibersihkan.";
  });
  $("render-template").addEventListener("click", () => {
    const { multiLine } = demos.demoTemplateLiterals();
    // Template ini hanya memuat identitas konstan dari data.js, bukan input pengguna.
    $("template-preview").innerHTML = multiLine;
  });
  $("fetch-bundle").addEventListener("click", async () => {
    $("fetch-bundle").disabled = true;
    $("bundle-output").textContent = "Memuat dua endpoint secara paralel…";
    try {
      $("bundle-output").textContent = JSON.stringify(
        await demos.fetchPracticeBundle(),
        null,
        2,
      );
    } catch (error) {
      $("bundle-output").textContent =
        `Gagal mengambil data: ${error.message} Coba lagi saat internet tersedia.`;
    } finally {
      $("fetch-bundle").disabled = false;
    }
  });
  let page = 1;
  let pages = 0;
  let requestNumber = 0;
  let controller;
  async function loadPosts() {
    const current = ++requestNumber;
    controller?.abort();
    controller = new AbortController();
    $("posts-status").textContent = "Memuat data…";
    $("post-prev").disabled = true;
    $("post-next").disabled = true;
    try {
      const result = await demos.searchPracticePosts({
        query: $("post-search").value,
        page,
        signal: controller.signal,
      });
      if (current !== requestNumber) return;
      page = result.page;
      pages = result.pages;
      $("posts-output").innerHTML = result.posts.length
        ? result.posts
            .map(
              ({ title, body }) =>
                `<article class="post-item"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(body)}</p></article>`,
            )
            .join("")
        : "<p>Tidak ada post yang cocok.</p>";
      $("posts-status").textContent =
        `${result.total} hasil · Halaman ${pages ? page : 0} / ${pages}`;
      $("post-prev").disabled = page <= 1;
      $("post-next").disabled = page >= pages;
    } catch (error) {
      if (current === requestNumber) {
        $("posts-output").replaceChildren();
        $("posts-status").textContent =
          `Gagal: ${error.message}. Klik Ambil post untuk mencoba lagi.`;
      }
    }
  }
  $("fetch-posts").addEventListener("click", () => {
    page = 1;
    loadPosts();
  });
  $("post-search").addEventListener(
    "input",
    debounce(() => {
      page = 1;
      loadPosts();
    }, 400),
  );
  $("post-prev").addEventListener("click", () => {
    page--;
    loadPosts();
  });
  $("post-next").addEventListener("click", () => {
    page++;
    loadPosts();
  });
}
