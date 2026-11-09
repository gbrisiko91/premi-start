// Genera le immagini per Instagram nello stile di Soffia Cartuccia.
//   node strumenti/instagram.mjs <post.json> <cartella-di-uscita>
// post.json: { "slide": [ ... ] } dove ogni slide è uno di questi tipi:
//   { "tipo": "copertina", "categoria": "Console", "colore": "rosso", "occhiello": "GTA 6", "titolo": "...", "testo": "...", "piede": "Scorri →" }
//   { "tipo": "elenco",    "categoria": "...", "colore": "...", "titolo": "...", "punti": ["...", "..."], "nota": "..." }
//   { "tipo": "date",      "categoria": "...", "colore": "...", "titolo": "...", "date": [["10 nov", "Preload"], ...], "piede": "..." }
//   { "tipo": "storia",    "categoria": "...", "colore": "...", "titolo": "...", "testo": "...", "invito": "Leggi la notizia" }
//   { "tipo": "foto",      "categoria": "...", "colore": "...", "immagine": "percorso/locale.jpg", "crediti": "Immagine: EA / BioWare", "titolo": "...", "testo": "...", "formato": "post|storia" }
//     (foto reale a tutto schermo, con il credito sempre stampato in basso)
// Le slide "storia" sono 1080×1920 (Storie), le altre 1080×1350 (post 4:5).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require("/usr/local/lib/node_modules/playwright")); }

const [, , fileSpec, uscita] = process.argv;
if (!fileSpec || !uscita) { console.error("Uso: node strumenti/instagram.mjs <post.json> <cartella-di-uscita>"); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(fileSpec, "utf8"));
fs.mkdirSync(uscita, { recursive: true });

const COLORI = { rosso: "#ff3b4e", blu: "#3d8bff", giallo: "#ffc21a", verde: "#22d07a", viola: "#8b6cff" };
const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// **parola** → evidenziata col colore della categoria
const ricco = (s = "") => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

const base = (c, alto) => `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:${alto}px}
body{font-family:"Inter Display","Inter",sans-serif;color:#f4f1ff;background:#0e0c22;position:relative;overflow:hidden}
.fondo{position:absolute;inset:0;background:
  radial-gradient(900px 700px at 90% -5%, ${c}55, transparent 65%),
  radial-gradient(800px 700px at -10% 110%, #8b6cff44, transparent 60%),
  linear-gradient(160deg,#17133a,#0e0c22 55%)}
.griglia{position:absolute;inset:0;background-image:linear-gradient(#ffffff08 2px,transparent 2px),linear-gradient(90deg,#ffffff08 2px,transparent 2px);background-size:60px 60px;mask-image:linear-gradient(180deg,#000 0%,transparent 75%)}
.cornice{position:absolute;inset:56px;display:flex;flex-direction:column}
.testa{display:flex;justify-content:space-between;align-items:center}
.marchio{font-weight:900;font-style:italic;font-size:40px;letter-spacing:-1px}
.marchio span:first-child{color:#8b6cff}
.chip{display:inline-flex;align-items:center;gap:14px;font-weight:800;font-size:28px;letter-spacing:2px;text-transform:uppercase;padding:12px 24px;border-radius:999px;background:#ffffff12;border:2px solid #ffffff22}
.chip i{width:18px;height:18px;border-radius:50%;background:${c};box-shadow:0 0 18px ${c}}
.occhiello{font-weight:900;font-style:italic;color:${c};font-size:96px;line-height:1;letter-spacing:-3px;text-shadow:0 0 50px ${c}66}
h1{font-weight:900;font-style:italic;letter-spacing:-2.5px;line-height:1.02}
h1 b,p b,li b{color:${c};font-weight:900}
p{font-size:40px;line-height:1.35;color:#d9d4f2;font-weight:500}
.piede{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:32px;color:#bdb6e6}
.piede .freccia{background:${c};color:#0e0c22;padding:16px 30px;border-radius:999px;font-style:italic}
.cartuccia{position:absolute;right:-70px;bottom:210px;width:360px;height:300px;border-radius:26px 26px 14px 14px;border:6px solid #ffffff14;transform:rotate(-14deg)}
.cartuccia::before{content:"";position:absolute;left:40px;right:40px;top:40px;height:120px;border-radius:12px;background:${c}22;border:4px solid ${c}55}
.cartuccia::after{content:"";position:absolute;left:30px;right:30px;bottom:-6px;height:44px;background:repeating-linear-gradient(90deg,#ffffff1c 0 14px,transparent 14px 26px)}
`;

const altezza = (s) => (s.tipo === "storia" || (s.tipo === "foto" && s.formato === "storia") ? 1920 : 1350);

function html(s) {
  const c = COLORI[s.colore] || COLORI.viola;
  const alto = altezza(s);
  const testa = `<div class="testa"><div class="marchio"><span>Soffia</span> <span>Cartuccia</span></div><div class="chip"><i></i>${esc(s.categoria || "")}</div></div>`;
  let corpo = "";
  if (s.tipo === "copertina") {
    corpo = `<div style="margin-top:auto">${s.occhiello ? `<div class="occhiello">${esc(s.occhiello)}</div>` : ""}
      <h1 style="font-size:${s.titolo.length > 60 ? 92 : 108}px;margin:22px 0 36px">${ricco(s.titolo)}</h1>
      ${s.testo ? `<p>${ricco(s.testo)}</p>` : ""}</div>
      <div class="piede" style="margin-top:60px"><span>soffiacartuccia.it</span><span class="freccia">${esc(s.piede || "Scorri →")}</span></div>`;
  } else if (s.tipo === "elenco") {
    corpo = `<h1 style="font-size:84px;margin:90px 0 50px">${ricco(s.titolo)}</h1>
      <ul style="list-style:none;display:grid;gap:30px">${s.punti.map((p, i) => `<li style="display:flex;gap:28px;align-items:flex-start;font-size:42px;line-height:1.3;font-weight:600"><span style="flex:none;width:68px;height:68px;border-radius:20px;background:${c};color:#0e0c22;font-weight:900;font-style:italic;display:grid;place-items:center;font-size:38px">${i + 1}</span><span style="padding-top:8px">${ricco(p)}</span></li>`).join("")}</ul>
      ${s.nota ? `<p style="margin-top:auto;font-size:34px;color:#bdb6e6;border-left:8px solid ${c};padding-left:28px">${ricco(s.nota)}</p>` : ""}`;
  } else if (s.tipo === "date") {
    corpo = `<h1 style="font-size:88px;margin:90px 0 56px">${ricco(s.titolo)}</h1>
      <div style="display:grid;gap:26px">${s.date.map(([d, cosa], i, tutte) => `<div style="display:flex;align-items:center;gap:34px;padding:30px 36px;border-radius:30px;background:${i === tutte.length - 1 ? c : "#ffffff10"};color:${i === tutte.length - 1 ? "#0e0c22" : "#f4f1ff"};border:2px solid ${i === tutte.length - 1 ? c : "#ffffff1f"}"><span style="font-weight:900;font-style:italic;font-size:64px;min-width:290px;letter-spacing:-2px">${esc(d)}</span><span style="font-weight:700;font-size:40px">${ricco(cosa)}</span></div>`).join("")}</div>
      <div class="piede" style="margin-top:auto"><span>soffiacartuccia.it</span><span class="freccia">${esc(s.piede || "Link in bio")}</span></div>`;
  } else if (s.tipo === "storia") {
    corpo = `<div style="margin-top:300px">${s.occhiello ? `<div class="occhiello" style="font-size:110px">${esc(s.occhiello)}</div>` : ""}
      <h1 style="font-size:112px;margin:28px 0 44px">${ricco(s.titolo)}</h1>
      ${s.testo ? `<p style="font-size:46px">${ricco(s.testo)}</p>` : ""}</div>
      <div style="margin-top:auto;margin-bottom:250px;text-align:center"><div style="font-weight:800;font-size:38px;color:#bdb6e6;margin-bottom:26px">${esc(s.invito || "Leggi la notizia")} 👇</div>
      <div style="margin:0 auto;width:560px;height:130px;border-radius:32px;border:5px dashed #ffffff55;display:grid;place-items:center;font-size:30px;color:#ffffff88;font-weight:700">qui l'adesivo link</div></div>`;
  } else if (s.tipo === "foto") {
    if (!s.immagine || !fs.existsSync(s.immagine)) throw new Error(`Immagine mancante: ${s.immagine}`);
    if (!s.crediti) throw new Error(`Crediti mancanti per ${s.immagine}`);
    const ext = path.extname(s.immagine).slice(1).toLowerCase().replace("jpg", "jpeg");
    const dati = `data:image/${ext};base64,${fs.readFileSync(s.immagine).toString("base64")}`;
    const storia = alto === 1920;
    return `<!doctype html><html><head><meta charset="utf-8"><style>${base(c, alto)}
      .foto{position:absolute;inset:0;background:url(${dati}) center/cover no-repeat}
      .velo{position:absolute;inset:0;background:linear-gradient(180deg,#0e0c22cc 0%,#0e0c2200 22%,#0e0c2200 45%,#0e0c22ee 78%,#0e0c22 100%)}
      .crediti{font-size:24px;font-weight:600;color:#ffffffb3;letter-spacing:.3px}</style></head><body><div class="foto"></div><div class="velo"></div>
      <div class="cornice">${testa}<div style="margin-top:auto${storia ? ";margin-bottom:230px" : ""}">${s.occhiello ? `<div class="occhiello" style="font-size:80px">${esc(s.occhiello)}</div>` : ""}
      ${s.titolo ? `<h1 style="font-size:${storia ? 100 : 84}px;margin:18px 0 26px">${ricco(s.titolo)}</h1>` : ""}${s.testo ? `<p style="font-size:${storia ? 44 : 38}px">${ricco(s.testo)}</p>` : ""}
      <div class="crediti" style="margin-top:28px">📷 ${esc(s.crediti)}</div></div></div></body></html>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>${base(c, alto)}</style></head><body><div class="fondo"></div><div class="griglia"></div>${s.tipo === "copertina" ? '<div class="cartuccia"></div>' : ""}<div class="cornice">${testa}${corpo}</div></body></html>`;
}

const browser = await chromium.launch();
for (const [i, s] of spec.slide.entries()) {
  const alto = altezza(s);
  const pagina = await browser.newPage({ viewport: { width: 1080, height: alto }, deviceScaleFactor: 1 });
  await pagina.setContent(html(s), { waitUntil: "load" });
  const nome = s.file || `${String(i + 1).padStart(2, "0")}-${s.tipo}.png`;
  await pagina.screenshot({ path: path.join(uscita, nome) });
  await pagina.close();
  console.log(path.join(uscita, nome));
}
await browser.close();
