import { sleep } from "./utils.js";

// Dependency injection membuat timeout, retry, dan kegagalan HTTP dapat diuji.
export async function fetchJSON(
  url,
  {
    fetcher = globalThis.fetch,
    timeout = 8000,
    retries = 1,
    baseDelay = 400,
    signal,
  } = {},
) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timer = setTimeout(abort, timeout);
    try {
      const response = await fetcher(url, { signal: controller.signal });
      if (!response.ok)
        throw Object.assign(
          new Error(`Server mengembalikan HTTP ${response.status}.`),
          { status: response.status },
        );
      return await response.json();
    } catch (error) {
      if (signal?.aborted) throw error;
      if (
        attempt === retries ||
        (error.status >= 400 && error.status < 500 && error.status !== 429)
      )
        throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
    await sleep(baseDelay * 2 ** attempt);
  }
}

export const weatherLabel = (code) =>
  code === 0
    ? "Langit cerah"
    : [1, 2, 3].includes(code)
      ? "Cerah berawan"
      : [45, 48].includes(code)
        ? "Berkabut"
        : [51, 53, 55, 56, 57].includes(code)
          ? "Gerimis"
          : [61, 63, 65, 66, 67, 80, 81, 82].includes(code)
            ? "Hujan"
            : [71, 73, 75, 77, 85, 86].includes(code)
              ? "Salju"
              : [95, 96, 99].includes(code)
                ? "Badai petir"
                : "Kondisi cuaca lain";
