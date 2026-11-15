// Local smoke-test server. Hosting uses static files and Vercel's routing config.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../.vercel/output/static/", import.meta.url));
const { routes } = JSON.parse(
  await readFile(new URL("../.vercel/output/config.json", import.meta.url), "utf8"),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://localhost").pathname;
    for (const route of routes) {
      if (!route.src || !new RegExp(`^${route.src}$`).test(pathname)) continue;
      for (const [name, value] of Object.entries(route.headers ?? {}))
        response.setHeader(name, value);
      if (route.status === 308) {
        response.writeHead(308).end();
        return;
      }
    }
    const file = resolve(
      root,
      `.${decodeURIComponent(pathname === "/" ? "/index.html" : pathname)}`,
    );
    const path = relative(root, file);
    if (path === ".." || path.startsWith("../") || path.startsWith("..\\") || isAbsolute(path)) {
      response.writeHead(400).end();
      return;
    }
    let buffer;
    let extension = extname(file);
    try {
      if (!(await stat(file)).isFile()) throw new Error("Not a file");
      buffer = await readFile(file);
    } catch {
      response.statusCode = 404;
      extension = ".html";
      buffer = await readFile(resolve(root, "404.html"));
    }
    response.setHeader("Content-Type", types[extension] ?? "application/octet-stream");
    response.end(request.method === "HEAD" ? undefined : buffer);
  } catch {
    response.writeHead(400).end();
  }
}).listen(4181, "127.0.0.1", () =>
  console.log("Static production smoke server: http://127.0.0.1:4181"),
);
