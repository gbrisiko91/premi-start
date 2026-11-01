// Piccolo server locale per vedere il sito: node serve.mjs  →  http://localhost:4321
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const DIST = path.join(path.dirname(new URL(import.meta.url).pathname), "dist");
const PORTA = Number(process.env.PORT) || 4321;
const TIPI = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".svg": "image/svg+xml", ".xml": "application/xml", ".txt": "text/plain", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = path.join(DIST, path.normalize(p));
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) && fs.existsSync(file + "/index.html")) file += "/index.html";
  if (!fs.existsSync(file)) { res.writeHead(404, { "content-type": TIPI[".html"] }); res.end(fs.readFileSync(path.join(DIST, "404.html"))); return; }
  res.writeHead(200, { "content-type": TIPI[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORTA, () => console.log(`Sito su http://localhost:${PORTA}`));
