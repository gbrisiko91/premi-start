// Genera il sito statico in /dist a partire dagli articoli in /content/articoli.
// Uso:  node build.mjs            → sito pubblico (le bozze restano escluse)
//       node build.mjs --bozze    → anteprima con anche le bozze, segnalate da un banner
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import config from "./sito.config.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CONTENUTI = path.join(ROOT, "content", "articoli");
const PUBBLICO = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");
const CON_BOZZE = process.argv.includes("--bozze");

// ---------- utilità ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const dataLunga = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome" });
const dataBreve = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", timeZone: "Europe/Rome" });
const urlAssoluto = (p) => config.url.replace(/\/$/, "") + p;

function scrivi(rel, contenuto) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contenuto);
}

function copiaCartella(da, a) {
  if (!fs.existsSync(da)) return;
  for (const voce of fs.readdirSync(da, { withFileTypes: true })) {
    const src = path.join(da, voce.name);
    const dst = path.join(a, voce.name);
    if (voce.isDirectory()) copiaCartella(src, dst);
    else { fs.mkdirSync(a, { recursive: true }); fs.copyFileSync(src, dst); }
  }
}

// ---------- lettura articoli ----------
function leggiArticoli() {
  if (!fs.existsSync(CONTENUTI)) return [];
  const errori = [];
  const articoli = fs.readdirSync(CONTENUTI)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const grezzo = fs.readFileSync(path.join(CONTENUTI, file), "utf8");
      const { data: d, content } = matter(grezzo);
      const slug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const data = d.data instanceof Date ? d.data : new Date(d.data);
      if (!d.titolo) errori.push(`${file}: manca "titolo"`);
      if (Number.isNaN(data.getTime())) errori.push(`${file}: "data" non valida (usa AAAA-MM-GG)`);
      if (d.categoria && !config.categorie[d.categoria]) {
        errori.push(`${file}: categoria "${d.categoria}" sconosciuta (usa: ${Object.keys(config.categorie).join(", ")})`);
      }
      const parole = content.split(/\s+/).filter(Boolean).length;
      return {
        file, slug,
        titolo: d.titolo || slug,
        sommario: d.sommario || "",
        data,
        categoria: config.categorie[d.categoria] ? d.categoria : "industria",
        tag: Array.isArray(d.tag) ? d.tag : [],
        viralita: Number(d.viralita) || 0,
        bozza: d.bozza === true,
        fonti: Array.isArray(d.fonti) ? d.fonti.filter((f) => f && f.url) : [],
        immagine: d.immagine || null,
        creditiImmagine: d.crediti_immagine || "",
        minuti: Math.max(1, Math.round(parole / 220)),
        html: marked.parse(content),
        url: `/articoli/${slug}/`,
      };
    });
  if (errori.length) {
    console.error("Controlla questi articoli:\n  " + errori.join("\n  "));
    process.exit(1);
  }
  return articoli
    .filter((a) => CON_BOZZE || !a.bozza)
    .sort((a, b) => b.data - a.data || b.viralita - a.viralita);
}

// ---------- componenti ----------
const pallino = (cat) => `<span class="pallino" data-colore="${config.categorie[cat].colore}" aria-hidden="true"></span>`;
const etichettaCat = (cat) =>
  `<a class="cat" href="/categoria/${cat}/">${pallino(cat)}${esc(config.categorie[cat].nome)}</a>`;
const segnoBozza = (a) => (a.bozza ? `<span class="segno-bozza">Bozza</span>` : "");

function pagina({ titolo, descrizione = config.motto, percorso = "/", corpo, tipo = "website" }) {
  const titoloCompleto = titolo ? `${titolo} – ${config.nome}` : `${config.nome} – ${config.motto}`;
  const nav = Object.entries(config.categorie)
    .map(([k, c]) => `<a href="/categoria/${k}/"${percorso.startsWith(`/categoria/${k}/`) ? ' aria-current="page"' : ""}>${pallino(k)}${esc(c.nome)}</a>`)
    .join("");
  return `<!doctype html>
<html lang="${config.lingua}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titoloCompleto)}</title>
<meta name="description" content="${esc(descrizione)}">
<link rel="canonical" href="${urlAssoluto(percorso)}">
<meta property="og:type" content="${tipo}">
<meta property="og:title" content="${esc(titolo || config.nome)}">
<meta property="og:description" content="${esc(descrizione)}">
<meta property="og:url" content="${urlAssoluto(percorso)}">
<meta property="og:site_name" content="${esc(config.nome)}">
<meta property="og:locale" content="it_IT">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${esc(config.nome)}" href="/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,400..900&family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/stile.css">
</head>
<body>
${CON_BOZZE ? `<div class="banner-anteprima">Anteprima con bozze: questa versione non va pubblicata.</div>` : ""}
<a class="salta" href="#contenuto">Vai al contenuto</a>
<header class="testata">
  <a class="marchio" href="/" aria-label="${esc(config.nome)}, pagina iniziale"><span>Premi</span><span>Start</span><i class="cursore" aria-hidden="true"></i></a>
  <nav class="categorie" aria-label="Categorie">${nav}</nav>
</header>
<main id="contenuto">
${corpo}
</main>
<footer class="piede">
  <p><strong>${esc(config.nome)}</strong> — ${esc(config.motto)}.</p>
  <p><a href="/archivio/">Archivio</a> <a href="/rss.xml">Feed RSS</a> <a href="/chi-siamo/">Chi siamo</a></p>
</footer>
</body>
</html>`;
}

function scheda(a, { grande = false } = {}) {
  return `<article class="scheda${grande ? " scheda-grande" : ""}">
  <p class="meta">${etichettaCat(a.categoria)}<time datetime="${a.data.toISOString()}">${dataBreve.format(a.data)}</time>${segnoBozza(a)}</p>
  <h${grande ? 1 : 2} class="titolo-scheda"><a href="${a.url}">${esc(a.titolo)}</a></h${grande ? 1 : 2}>
  ${a.sommario ? `<p class="sommario">${esc(a.sommario)}</p>` : ""}
</article>`;
}

function inTendenza(articoli) {
  const settimana = 7 * 24 * 3600 * 1000;
  const piuRecente = articoli[0]?.data.getTime() ?? Date.now();
  let lista = articoli.filter((a) => piuRecente - a.data.getTime() <= settimana);
  if (lista.length < 3) lista = articoli.slice(0, 10);
  return [...lista].sort((a, b) => b.viralita - a.viralita).slice(0, 5);
}

// ---------- pagine ----------
function home(articoli) {
  if (!articoli.length) {
    return pagina({
      corpo: `<section class="vuoto"><h1>Nessun articolo pubblicato</h1><p>Aggiungi un file in <code>content/articoli/</code> con <code>bozza: false</code> e rilancia la build.</p></section>`,
    });
  }
  const [apertura, ...resto] = articoli;
  const tendenza = inTendenza(articoli);
  const corpo = `
<div class="apertura">
  ${scheda(apertura, { grande: true })}
  <aside class="tendenza" aria-labelledby="t-tendenza">
    <h2 id="t-tendenza">In tendenza</h2>
    <ol>${tendenza.map((a) => `<li><a href="${a.url}">${esc(a.titolo)}</a><span class="cat-mini">${pallino(a.categoria)}${esc(config.categorie[a.categoria].nome)}</span></li>`).join("")}</ol>
  </aside>
</div>
${resto.length ? `<section class="flusso" aria-labelledby="t-ultime"><h2 id="t-ultime" class="titolo-sezione">Le ultime</h2><div class="griglia">${resto.slice(0, config.articoliPerPagina).map((a) => scheda(a)).join("")}</div>
${resto.length > config.articoliPerPagina ? `<p class="altro"><a href="/archivio/">Tutti gli articoli</a></p>` : ""}</section>` : ""}`;
  return pagina({ corpo });
}

function paginaArticolo(a, articoli) {
  const correlati = articoli.filter((x) => x !== a && x.categoria === a.categoria).slice(0, 3);
  const fonti = a.fonti.length
    ? `<section class="fonti" aria-labelledby="t-fonti"><h2 id="t-fonti">Fonti</h2><ul>${a.fonti
        .map((f) => `<li><a href="${esc(f.url)}" rel="noopener" target="_blank">${esc(f.titolo || f.url)}</a></li>`)
        .join("")}</ul></section>`
    : "";
  const immagine = a.immagine
    ? `<figure class="immagine"><img src="${esc(a.immagine)}" alt="" loading="eager">${a.creditiImmagine ? `<figcaption>${esc(a.creditiImmagine)}</figcaption>` : ""}</figure>`
    : "";
  const jsonld = {
    "@context": "https://schema.org", "@type": "NewsArticle",
    headline: a.titolo, description: a.sommario, datePublished: a.data.toISOString(),
    inLanguage: "it", publisher: { "@type": "Organization", name: config.nome },
    mainEntityOfPage: urlAssoluto(a.url),
  };
  const corpo = `
<article class="articolo">
  <header class="intestazione">
    <p class="meta">${etichettaCat(a.categoria)}<time datetime="${a.data.toISOString()}">${dataLunga.format(a.data)}</time><span>${a.minuti} min di lettura</span>${segnoBozza(a)}</p>
    <h1>${esc(a.titolo)}</h1>
    ${a.sommario ? `<p class="occhiello">${esc(a.sommario)}</p>` : ""}
  </header>
  ${immagine}
  <div class="testo">${a.html}</div>
  ${a.tag.length ? `<p class="tag">${a.tag.map((t) => `<span>#${esc(t)}</span>`).join(" ")}</p>` : ""}
  ${fonti}
</article>
${correlati.length ? `<section class="correlati" aria-labelledby="t-corr"><h2 id="t-corr" class="titolo-sezione">Altro da ${esc(config.categorie[a.categoria].nome)}</h2><div class="griglia">${correlati.map((x) => scheda(x)).join("")}</div></section>` : ""}
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>`;
  return pagina({ titolo: a.titolo, descrizione: a.sommario || config.motto, percorso: a.url, corpo, tipo: "article" });
}

function paginaElenco({ titolo, descrizione, percorso, lista, categoria }) {
  const corpo = `
<header class="intestazione-elenco"${categoria ? ` data-colore="${config.categorie[categoria].colore}"` : ""}>
  <h1>${esc(titolo)}</h1>
  ${descrizione ? `<p>${esc(descrizione)}</p>` : ""}
</header>
${lista.length
    ? `<ul class="elenco">${lista.map((a) => `<li><time datetime="${a.data.toISOString()}">${dataBreve.format(a.data)}</time><div><a href="${a.url}">${esc(a.titolo)}</a>${segnoBozza(a)}${categoria ? "" : `<span class="cat-mini">${pallino(a.categoria)}${esc(config.categorie[a.categoria].nome)}</span>`}</div></li>`).join("")}</ul>`
    : `<p class="vuoto-elenco">Ancora nessun articolo in questa sezione. Torna presto.</p>`}`;
  return pagina({ titolo, descrizione, percorso, corpo });
}

function rss(articoli) {
  const voci = articoli.filter((a) => !a.bozza).slice(0, 30).map((a) => `
  <item>
    <title>${esc(a.titolo)}</title>
    <link>${urlAssoluto(a.url)}</link>
    <guid>${urlAssoluto(a.url)}</guid>
    <pubDate>${a.data.toUTCString()}</pubDate>
    <category>${esc(config.categorie[a.categoria].nome)}</category>
    <description>${esc(a.sommario)}</description>
  </item>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${esc(config.nome)}</title>
  <link>${config.url}</link>
  <description>${esc(config.motto)}</description>
  <language>it-it</language>${voci}
</channel></rss>`;
}

function sitemap(articoli) {
  const percorsi = ["/", "/archivio/", "/chi-siamo/", ...Object.keys(config.categorie).map((k) => `/categoria/${k}/`)];
  const righe = percorsi.map((p) => `<url><loc>${urlAssoluto(p)}</loc></url>`)
    .concat(articoli.filter((a) => !a.bozza).map((a) => `<url><loc>${urlAssoluto(a.url)}</loc><lastmod>${a.data.toISOString().slice(0, 10)}</lastmod></url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${righe.join("")}</urlset>`;
}

// ---------- build ----------
const articoli = leggiArticoli();
fs.rmSync(DIST, { recursive: true, force: true });
copiaCartella(PUBBLICO, DIST);
fs.copyFileSync(path.join(ROOT, "src", "stile.css"), path.join(DIST, "stile.css"));

scrivi("index.html", home(articoli));
for (const a of articoli) scrivi(`articoli/${a.slug}/index.html`, paginaArticolo(a, articoli));
for (const [k, c] of Object.entries(config.categorie)) {
  scrivi(`categoria/${k}/index.html`, paginaElenco({
    titolo: c.nome, descrizione: c.descrizione, percorso: `/categoria/${k}/`, categoria: k,
    lista: articoli.filter((a) => a.categoria === k),
  }));
}
scrivi("archivio/index.html", paginaElenco({ titolo: "Archivio", descrizione: "Tutti gli articoli, dal più recente.", percorso: "/archivio/", lista: articoli }));
scrivi("chi-siamo/index.html", pagina({
  titolo: "Chi siamo", percorso: "/chi-siamo/",
  corpo: `<article class="articolo"><header class="intestazione"><h1>Chi siamo</h1></header><div class="testo">${marked.parse(
    fs.existsSync(path.join(ROOT, "content", "chi-siamo.md")) ? fs.readFileSync(path.join(ROOT, "content", "chi-siamo.md"), "utf8") : ""
  )}</div></article>`,
}));
scrivi("404.html", pagina({
  titolo: "Pagina non trovata", percorso: "/404.html",
  corpo: `<section class="vuoto"><h1>Game over: questa pagina non esiste</h1><p>Il link potrebbe essere cambiato. <a href="/">Torna alla prima pagina</a> o cerca nell'<a href="/archivio/">archivio</a>.</p></section>`,
}));
scrivi("rss.xml", rss(articoli));
scrivi("sitemap.xml", sitemap(articoli));
scrivi("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${urlAssoluto("/sitemap.xml")}\n`);

const nBozze = articoli.filter((a) => a.bozza).length;
console.log(`Fatto: ${articoli.length - nBozze} articoli pubblicati${CON_BOZZE ? ` + ${nBozze} bozze in anteprima` : ""} → dist/`);
