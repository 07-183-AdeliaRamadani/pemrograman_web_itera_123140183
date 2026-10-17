// Server lokal tanpa dependensi; Live Server VS Code juga dapat digunakan.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(fileURLToPath(import.meta.url));
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const target = resolve(
      root,
      `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`,
    );
    if (
      !target.startsWith(root + sep) ||
      pathname.split("/").some((part) => part.startsWith("."))
    ) {
      response.writeHead(403);
      return response.end("Forbidden");
    }
    const content = await readFile(target);
    response.writeHead(200, {
      "Content-Type": mime[extname(target)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(5174, "127.0.0.1", () =>
  console.log("Petal Desk: http://127.0.0.1:5174"),
);
