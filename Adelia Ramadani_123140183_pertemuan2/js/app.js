import { sampleUsers, sampleProducts, identity } from "./modules/data.js";
import { groupBy, statistics, sleep, formatRupiah } from "./modules/utils.js";
import { fetchJSON } from "./modules/network.js";

// 1. var hanya untuk membuktikan function scope pada latihan ini.
export function demoVariables() {
  var oldVar = "Nilai sebelum block";
  {
    var oldVar = "Berubah dari dalam block";
  }
  let newLet = "Nilai di luar block";
  let insideLet;
  {
    let newLet = "Nilai berbeda di dalam block";
    insideLet = newLet;
  }
  const PI = 3.14159;
  const user = { name: identity.name, role: "praktikan" };
  user.role = "mahasiswa";
  let reassignmentError;
  try {
    PI = 3.15;
  } catch (error) {
    reassignmentError = `${error.name}: ${error.message}`;
  }
  let tdzError;
  try {
    const value = notYetDeclared;
    let notYetDeclared = 1;
    return value;
  } catch (error) {
    tdzError = error.name;
  }
  return { oldVar, newLet, insideLet, PI, user, reassignmentError, tdzError };
}

// 2. Bentuk-bentuk arrow function dan lexical this.
export function demoArrowFunctions() {
  function regularSum(a, b) {
    return a + b;
  }
  const arrowSum = (a, b) => {
    return a + b;
  };
  const shortArrowSum = (a, b) => a + b;
  const sayHello = () => `Halo, ${identity.name}!`;
  const square = (x) => x * x;
  const createUser = (name) => ({ name });
  const owner = {
    name: identity.name,
    greet() {
      const greeting = () => `Hai, ${this.name}`;
      return greeting();
    },
  };
  return {
    regularSum: regularSum(5, 3),
    arrowSum: arrowSum(5, 3),
    shortArrowSum: shortArrowSum(5, 3),
    sayHello: sayHello(),
    square: square(4),
    objectReturn: createUser(identity.name),
    lexicalThis: owner.greet(),
  };
}

// 3. Perbandingan nyata concatenation dan template literals, tanpa mengarang umur.
export function demoTemplateLiterals() {
  const { name, nim } = identity;
  const oldWay = "Nama saya " + name + " dan NIM saya " + nim + ".";
  const newWay = `Nama saya ${name} dan NIM saya ${nim}.`;
  const multiLine = `<article class="profile-card">
  <h3>${name}</h3>
  <p>NIM: ${nim}</p>
  <p>Kelas: RB</p>
</article>`;
  const tagged = (strings, ...values) =>
    strings.reduce(
      (text, part, index) =>
        text +
        part +
        (values[index] === undefined
          ? ""
          : String(values[index]).toUpperCase()),
      "",
    );
  return {
    oldWay,
    newWay,
    multiLine,
    expression: `Total waktu belajar: ${25 * 2} menit`,
    taggedTemplate: tagged`Halo, ${name}!`,
  };
}

// 4. Destructuring object, alias, default, nested, array, rest, dan swap.
export function demoDestructuring() {
  const person = {
    firstName: "Adelia",
    lastName: "Ramadani",
    address: { campus: { city: "Lampung Selatan", name: "ITERA" } },
  };
  const { firstName, lastName } = person;
  const {
    firstName: fName,
    hobby = "Belum diisi",
    address: {
      campus: { city, name: campus },
    },
  } = person;
  const colors = ["pink", "hitam", "putih", "rose"];
  const [first, second, ...rest] = colors;
  const [, , third] = colors;
  let a = 1;
  let b = 2;
  [a, b] = [b, a];
  return {
    objectBasic: { firstName, lastName },
    renamed: fName,
    defaultValue: hobby,
    nestedThreeLevels: { city, campus },
    arrayBasic: { first, second },
    skipped: third,
    rest,
    swapped: { a, b },
  };
}

// 5. Spread melakukan shallow copy; rest mengumpulkan argumen.
export function demoSpreadRest() {
  const numbers = [1, 2, 3];
  const original = { name: identity.name, preferences: { color: "pink" } };
  const copied = { ...original };
  const merged = {
    ...{ name: identity.name, role: "user" },
    ...{ nim: identity.nim, role: "student" },
    ...{ className: "RB", role: "praktikan" },
  };
  const process = (first, second, ...rest) => ({ first, second, rest });
  const fromLoop = [];
  for (const { name, price } of sampleProducts)
    fromLoop.push(`${name}: ${formatRupiah(price)}`);
  return {
    original: numbers,
    extended: [...numbers, 4, 5],
    copied: [...numbers],
    mergedArrays: [...numbers, ...[4, 5, 6]],
    mergedObjects: merged,
    restStatistics: statistics(10, 20, 30, 40),
    restProcess: process("a", "b", "c", "d"),
    shallowCopySharesNested: original.preferences === copied.preferences,
    destructuringInForOf: fromLoop,
  };
}

// 6. Default parameters aktif untuk undefined, tidak untuk semua nilai falsy.
export function demoDefaultParams() {
  const oldGreeting = (name, greeting) =>
    `${greeting || "Halo"}, ${name || "Tamu"}!`;
  const greet = (name = "Tamu", greeting = "Halo") => `${greeting}, ${name}!`;
  const createOrder = (
    product,
    quantity = 1,
    price = 1000,
    total = price * quantity,
  ) => ({ product, quantity, price, total });
  const welcome = ({ name = identity.name, role = "mahasiswa" } = {}) =>
    `${name} · ${role}`;
  return {
    oldWay: oldGreeting(),
    newWay: greet(),
    oldWithEmptyString: oldGreeting("", ""),
    newWithEmptyString: greet("", ""),
    usingPreviousParameter: createOrder("Buku", 2, 10000),
    defaultDestructuring: welcome(),
  };
}

export class Product {
  constructor(name, price = 0) {
    this.name = name;
    this.price = price;
  }
  get price() {
    return this._price;
  }
  set price(value) {
    if (!Number.isFinite(value) || value < 0)
      throw new Error("Harga tidak valid.");
    this._price = value;
  }
  getInfo() {
    return `${this.name}: ${formatRupiah(this.price)}`;
  }
  static create(name, price) {
    return new Product(name, price);
  }
}
export class DigitalProduct extends Product {
  constructor(name, price, format = "PDF") {
    super(name, price);
    this.format = format;
  }
  getInfo() {
    return `${super.getInfo()} · Format ${this.format}`;
  }
}
export class PhysicalProduct extends Product {
  constructor(name, price, weight = 0) {
    super(name, price);
    this.weight = weight;
  }
  getInfo() {
    return `${super.getInfo()} · Berat ${this.weight} gram`;
  }
}

// 7. Classes, inheritance, super, method override, getter/setter, static method.
export function demoClasses() {
  const book = Product.create("Buku catatan", 15000);
  book.price = 12000;
  const digital = new DigitalProduct("Modul ES6", 10000);
  const physical = new PhysicalProduct("Planner pink", 25000, 200);
  return {
    getterAfterSetter: book.price,
    product: book.getInfo(),
    digital: digital.getInfo(),
    physical: physical.getInfo(),
    isProduct: digital instanceof Product,
    isDigital: digital instanceof DigitalProduct,
  };
}

// 8. Property shorthand, method shorthand, computed keys.
export function demoObjectLiterals() {
  const { name, nim } = identity;
  const key = "kelas";
  const oldWay = { name: name, nim: nim };
  const newWay = {
    name,
    nim,
    [key]: "RB",
    getInfo() {
      return `${this.name} (${this.nim})`;
    },
  };
  const dynamic = Object.fromEntries(
    ["senin", "selasa"].map((day, index) => [`agenda_${day}`, index + 1]),
  );
  return { oldWay, newWay, method: newWay.getInfo(), dynamic };
}

// 9. Higher-order functions dan chaining tanpa mengubah data sumber.
export function demoArrayMethods() {
  const numbers = [1, 2, 3, 4, 5];
  return {
    map: numbers.map((n) => n * 2),
    filter: numbers.filter((n) => n % 2 === 0),
    activeUsers: sampleUsers
      .filter(({ active }) => active)
      .map(({ name }) => name),
    find: sampleUsers.find(({ role }) => role === "admin"),
    some: sampleUsers.some(({ age }) => age >= 30),
    every: sampleUsers.every(({ age }) => age >= 18),
    sum: numbers.reduce((total, number) => total + number, 0),
    oldest: sampleUsers.reduce((oldest, user) =>
      user.age > oldest.age ? user : oldest,
    ),
    chained: sampleUsers
      .filter(({ active }) => active)
      .map(({ name }) => name)
      .sort(),
    groupByCategory: groupBy(sampleProducts, "category"),
    averagePrice: statistics(...sampleProducts.map(({ price }) => price))
      .average,
    analysis: sampleProducts
      .filter(({ category }) => category === "tech")
      .map(({ price }) => price)
      .reduce((sum, price) => sum + price, 0),
  };
}

// 10. Array.from/of, flat/flatMap/includes dan salinan immutable.
export function demoAdvancedArrays() {
  const numbers = [1, 2, 3, 4, 5];
  const nested = [1, [2, 3], [[4, 5], 6]];
  return {
    clone: [...numbers],
    concat: [...numbers, 6, 7],
    fromString: Array.from("pink"),
    fromWithMap: Array.from(numbers, (n) => n * n),
    arrayOf: Array.of(1, "dua", { tiga: 3 }),
    flat: nested.flat(),
    deepFlat: nested.flat(2),
    flatMap: numbers.flatMap((n) => [n, n * 2]),
    includesThree: numbers.includes(3),
  };
}

const simulatedUser = (id, milliseconds = 120) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () =>
        id > 0
          ? resolve({ id, name: `User contoh ${id}` })
          : reject(new Error("ID user tidak valid")),
      milliseconds,
    ),
  );

// 11. Promise dasar, chaining, all, race, allSettled, any, dan rejection.
export async function demoPromises() {
  const basic = await simulatedUser(1)
    .then(({ name }) => `Sukses: ${name}`)
    .catch((error) => error.message);
  const chain = await simulatedUser(2).then((first) =>
    simulatedUser(3).then((second) => `${first.name} dan ${second.name}`),
  );
  const [all, race, settled, any, invalid] = await Promise.all([
    Promise.all([4, 5, 6].map((id) => simulatedUser(id))),
    Promise.race([simulatedUser(7, 30), simulatedUser(8, 80)]),
    Promise.allSettled([simulatedUser(9), simulatedUser(-1)]),
    Promise.any([simulatedUser(-1, 20), simulatedUser(10, 40)]),
    simulatedUser(0).catch((error) => error.message),
  ]);
  return {
    basic,
    chain,
    all,
    race,
    settled: settled.map(({ status, value, reason }) => ({
      status,
      result: value ?? reason.message,
    })),
    any,
    rejectionHandled: invalid,
  };
}

// 12. Async/await sekuensial saat dependen; Promise.all saat independen.
export async function demoAsyncAwait() {
  const fetchUserPosts = async (userId) => {
    await sleep(50);
    return [
      { userId, title: "Post contoh pertama" },
      { userId, title: "Post contoh kedua" },
    ];
  };
  const getUserData = async (id) => {
    try {
      const user = await simulatedUser(id, 40);
      const posts = await fetchUserPosts(user.id);
      return { user, posts, success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  const [single, multiple, invalid] = await Promise.all([
    getUserData(42),
    Promise.all([101, 102, 103].map((id) => getUserData(id))),
    getUserData(-1),
  ]);
  return {
    single,
    parallelUsers: multiple.map(({ user }) => user.name),
    totalPosts: multiple.reduce((total, { posts }) => total + posts.length, 0),
    handledError: invalid,
  };
}

// Latihan API nyata: gabung dua endpoint, retry, pagination, dan pencarian async.
export async function fetchPracticeBundle(options = {}) {
  const [user, posts] = await Promise.all([
    fetchJSON("https://jsonplaceholder.typicode.com/users/1", options),
    fetchJSON("https://jsonplaceholder.typicode.com/posts?userId=1", options),
  ]);
  if (typeof user?.name !== "string" || !Array.isArray(posts))
    throw new Error("Format respons API tidak valid.");
  return {
    user: user.name,
    postCount: posts.length,
    firstPost: posts[0]?.title ?? "Belum ada post",
  };
}
export async function searchPracticePosts({
  query = "",
  page = 1,
  pageSize = 5,
  signal,
} = {}) {
  const data = await fetchJSON("https://jsonplaceholder.typicode.com/posts", {
    signal,
  });
  if (
    !Array.isArray(data) ||
    data.some(
      (post) => typeof post.title !== "string" || typeof post.body !== "string",
    )
  )
    throw new Error("Format daftar post tidak valid.");
  const filtered = data.filter(({ title }) =>
    title.toLowerCase().includes(query.toLowerCase().trim()),
  );
  const pages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.max(1, Math.min(page, pages || 1));
  return {
    posts: filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    total: filtered.length,
    pages,
    page: currentPage,
  };
}
