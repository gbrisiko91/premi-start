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
        immagineRiserva: d.immagine_riserva || "",
        altImmagine: d.alt_immagine || d.titolo || "",
        creditiImmagine: d.crediti_immagine || "",
        parolaChiave: d.parola_chiave || "",
        titoloSeo: d.titolo_seo || "",
        aggiornato: d.aggiornato ? new Date(d.aggiornato) : null,
        minuti: Math.max(1, Math.round(parole / 220)),
        html: marked.parse(content).replace(/<p>\s*<\/p>/g, ""),
        url: `/articoli/${slug}/`,
      };
    });
  for (const a of articoli) {
    const avvisi = [];
    if (a.sommario.length > 160) avvisi.push(`sommario di ${a.sommario.length} caratteri (meglio 140-155)`);
    if ((a.titoloSeo || a.titolo).length > 65) avvisi.push(`titolo per Google di ${(a.titoloSeo || a.titolo).length} caratteri (meglio entro 60: usa titolo_seo)`);
    if (a.immagine && !a.creditiImmagine) avvisi.push("immagine senza crediti_immagine");
    if (avvisi.length) console.warn(`Avviso ${a.file}: ${avvisi.join("; ")}`);
  }
  if (errori.length) {
    console.error("Controlla questi articoli:\n  " + errori.join("\n  "));
    process.exit(1);
  }
  return articoli
    .filter((a) => CON_BOZZE || !a.bozza)
    .sort((a, b) => b.data - a.data || b.viralita - a.viralita);
}

// ---------- immagini ----------
// Se l'immagine principale non si carica, si prova quella di riserva; se manca anche quella, resta la copertina colorata.
const QUANDO_ERRORE = `if(this.dataset.riserva){this.src=this.dataset.riserva;this.dataset.riserva=''}else{(this.closest('figure')||this).remove()}`;
function img({ src, riserva = "", alt = "", lazy = true, priorita = false, classe = "" }) {
  return `<img${classe ? ` class="${classe}"` : ""} src="${esc(src)}"${riserva ? ` data-riserva="${esc(riserva)}"` : ""} alt="${esc(alt)}" loading="${lazy ? "lazy" : "eager"}"${priorita ? ' fetchpriority="high"' : ""} decoding="async" referrerpolicy="no-referrer" onerror="${QUANDO_ERRORE}">`;
}
// Immagini nel testo: ![testo alternativo](url "crediti") diventa una figura con didascalia
marked.use({
  renderer: {
    image({ href, title, text }) {
      return `</p><figure class="immagine-testo">${img({ src: href, alt: text })}${title ? `<figcaption>${esc(title)}</figcaption>` : ""}</figure><p>`;
    },
  },
});
const urlImmagine = (u) => (!u ? "" : /^https?:\/\//.test(u) ? u : urlAssoluto(u.startsWith("/") ? u : `/${u}`));

// ---------- componenti ----------
const colore = (cat) => config.categorie[cat].colore;
const pallino = (cat) => `<span class="pallino" data-colore="${colore(cat)}" aria-hidden="true"></span>`;
const etichettaCat = (cat) =>
  `<a class="cat" href="/categoria/${cat}/" data-colore="${colore(cat)}">${esc(config.categorie[cat].nome)}</a>`;
const segnoBozza = (a) => (a.bozza ? `<span class="segno-bozza">Bozza</span>` : "");
const hype = (v) => {
  const pieni = Math.round(Math.max(0, Math.min(100, v)) / 10);
  const tacche = Array.from({ length: 10 }, (_, i) => `<i${i < pieni ? ' class="on"' : ""}></i>`).join("");
  return v ? `<span class="hype" role="img" aria-label="Hype ${v} su 100"><span class="hype-nome" aria-hidden="true">Hype</span><span class="hype-barra" aria-hidden="true">${tacche}</span><b aria-hidden="true">${v}</b></span>` : "";
};

// Tasto "Mi piace": solo sugli articoli pubblicati. Il conteggio arriva da /api/like (funzione Netlify).
const tastoLike = (a) =>
  a.bozza
    ? ""
    : `<button type="button" class="tasto-like" data-like="${esc(a.slug)}" aria-pressed="false"><svg class="cuore" viewBox="0 0 9 8" aria-hidden="true"><path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z"/></svg><span class="like-testo">Mi piace</span><span class="like-conto" aria-live="polite"></span></button>`;

// Pulsanti di condivisione: link diretti (funzionano anche senza JavaScript) + condivisione nativa del telefono e "copia link".
const ICONE = {
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"/>',
  telegram: '<path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.2 1.8 11.7c-1-.3-1-1 .2-1.5L20.5 3.1c.9-.3 1.6.2 1.4 1.2z"/>',
  x: '<path d="M17.8 2.5h3.3l-7.2 8.2 8.5 10.8h-6.6l-5.2-6.7-6 6.7H1.3l7.7-8.8L.9 2.5h6.8l4.7 6.1 5.4-6.1zm-1.2 17.1h1.8L6.6 4.3H4.6l12 15.3z"/>',
  facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>',
  link: '<path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0zm-2.8 6.4a4.5 4.5 0 0 1-3.2-7.7l2.5-2.5a1 1 0 1 1 1.4 1.4L6 13.5a2.5 2.5 0 0 0 3.5 3.5L12 14.5a1 1 0 1 1 1.4 1.4L11 18.4a4.5 4.5 0 0 1-3.2 1.4zm8.2-5.6a1 1 0 0 1-.7-1.7L18 10a2.5 2.5 0 0 0-3.5-3.5L12 9a1 1 0 1 1-1.4-1.4L13 5a4.5 4.5 0 0 1 6.4 6.4L16.7 14a1 1 0 0 1-.7.2z"/>',
  condividi: '<path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/>',
};
const icona = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONE[n]}</svg>`;
function condivisione(a) {
  if (a.bozza) return "";
  const url = urlAssoluto(a.url);
  const testo = a.titolo;
  const e = encodeURIComponent;
  const voci = [
    ["whatsapp", "WhatsApp", `https://wa.me/?text=${e(`${testo} ${url}`)}`],
    ["telegram", "Telegram", `https://t.me/share/url?url=${e(url)}&text=${e(testo)}`],
    ["x", "X", `https://x.com/intent/post?text=${e(testo)}&url=${e(url)}`],
    ["facebook", "Facebook", `https://www.facebook.com/sharer/sharer.php?u=${e(url)}`],
  ];
  return `<div class="condividi" id="condividi" data-url="${esc(url)}" data-titolo="${esc(testo)}">
  <p class="condividi-titolo">Passala a un amico</p>
  <div class="condividi-tasti">
    <button type="button" class="tasto-condividi nativo" hidden>${icona("condividi")}<span>Condividi</span></button>
    ${voci.map(([k, nome, href]) => `<a class="tasto-condividi" data-rete="${k}" href="${esc(href)}" target="_blank" rel="noopener">${icona(k)}<span>${nome}</span></a>`).join("\n    ")}
    <button type="button" class="tasto-condividi copia">${icona("link")}<span class="copia-testo">Copia link</span></button>
  </div>
</div>`;
}

function pagina({ titolo, titoloSeo = "", descrizione = config.motto, percorso = "/", corpo, tipo = "website", ticker = [], articolo = null }) {
  const titoloCompleto = titolo ? `${titoloSeo || titolo} – ${config.nome}` : `${config.nome} – ${config.motto}`;
  const immagineSocial = articolo?.immagine ? urlImmagine(articolo.immagine) : urlAssoluto("/condivisione.png");
  const metaArticolo = articolo
    ? `\n<meta property="article:published_time" content="${articolo.data.toISOString()}">${articolo.aggiornato ? `\n<meta property="article:modified_time" content="${articolo.aggiornato.toISOString()}">` : ""}\n<meta property="article:section" content="${esc(config.categorie[articolo.categoria].nome)}">${articolo.tag.map((t) => `\n<meta property="article:tag" content="${esc(t)}">`).join("")}`
    : "";
  const nav = Object.entries(config.categorie)
    .map(([k, c]) => `<a href="/categoria/${k}/" data-colore="${c.colore}"${percorso.startsWith(`/categoria/${k}/`) ? ' aria-current="page"' : ""}>${pallino(k)}${esc(c.nome)}</a>`)
    .join("");
  const vociTicker = ticker.map((a) => `<a href="${a.url}">${pallino(a.categoria)}${esc(a.titolo)}</a>`).join("");
  const nastro = ticker.length
    ? `<div class="ticker" aria-label="Ultime notizie"><span class="ticker-etichetta">Live</span><div class="ticker-finestra"><div class="ticker-nastro">${vociTicker}<span class="ticker-copia" aria-hidden="true">${vociTicker.replace(/<a /g, '<a tabindex="-1" ')}</span></div></div></div>`
    : "";
  return `<!doctype html>
<html lang="${config.lingua}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titoloCompleto)}</title>
<meta name="description" content="${esc(descrizione)}">
<meta name="theme-color" content="#15122b">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${urlAssoluto(percorso)}">
<meta property="og:type" content="${tipo}">
<meta property="og:title" content="${esc(titolo || config.nome)}">
<meta property="og:description" content="${esc(descrizione)}">
<meta property="og:url" content="${urlAssoluto(percorso)}">
<meta property="og:site_name" content="${esc(config.nome)}">
<meta property="og:locale" content="it_IT">
<meta property="og:image" content="${esc(immagineSocial)}">
<meta property="og:image:alt" content="${esc(articolo?.immagine ? articolo.altImmagine : config.nome)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titoloSeo || titolo || config.nome)}">
<meta name="twitter:description" content="${esc(descrizione)}">
<meta name="twitter:image" content="${esc(immagineSocial)}">${metaArticolo}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${esc(config.nome)}" href="/rss.xml">
${FONT_PRECARICA}<link rel="stylesheet" href="/font.css">
<link rel="stylesheet" href="/stile.css">${config.googleVerifica ? `\n<meta name="google-site-verification" content="${esc(config.googleVerifica)}">` : ""}
</head>
<body>
${CON_BOZZE ? `<div class="banner-anteprima">Anteprima con bozze: questa versione non va pubblicata.</div>` : ""}
<a class="salta" href="#contenuto">Vai al contenuto</a>
<header class="testata">
  <div class="testata-riga">
    <a class="marchio" href="/" aria-label="${esc(config.nome)}, pagina iniziale"><span>Soffia</span><span>Cartuccia</span><i class="cursore" aria-hidden="true"></i></a>
    <nav class="categorie" aria-label="Categorie">${nav}</nav>
  </div>
  ${nastro}
</header>
<main id="contenuto">
${corpo}
</main>
<footer class="piede">
  <p class="piede-marchio">Soffia Cartuccia</p>
  <p>${esc(config.motto)}. Ogni articolo cita le sue fonti.</p>
  <p class="piede-link"><a href="/archivio/">Archivio</a><a href="/rss.xml">Feed RSS</a><a href="/chi-siamo/">Chi siamo</a><a href="/privacy/">Privacy</a></p>
</footer>
</body>
</html>`;
}

function scheda(a) {
  const copertina = `<span class="copertina-nome" aria-hidden="true">${esc(config.categorie[a.categoria].nome)}</span>${
    a.immagine ? img({ src: a.immagine, riserva: a.immagineRiserva, alt: a.altImmagine }) : ""}`;
  return `<article class="scheda" data-colore="${colore(a.categoria)}">
  <div class="copertina">${copertina}</div>
  <div class="scheda-corpo">
    <p class="meta">${etichettaCat(a.categoria)}<time datetime="${a.data.toISOString()}">${dataBreve.format(a.data)}</time>${segnoBozza(a)}</p>
    <h2 class="titolo-scheda"><a href="${a.url}">${esc(a.titolo)}</a></h2>
    ${a.sommario ? `<p class="sommario">${esc(a.sommario)}</p>` : ""}
    ${hype(a.viralita)}
  </div>
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
      corpo: `<section class="schermata-titolo">
  <p class="schermata-sopra">Il blog delle notizie gaming di cui si parla oggi</p>
  <h1 class="schermata-logo"><span>Soffia</span><span>Cartuccia</span></h1>
  <p class="schermata-lampeggia">Soffia e premi Start</p><p class="schermata-sotto">Le prime notizie stanno caricando.</p>
  <p class="schermata-sotto">Torna tra poco, oppure seguici dal <a href="/rss.xml">feed RSS</a>.</p>
</section>`,
    });
  }
  const [apertura, ...resto] = articoli;
  const tendenza = inTendenza(articoli);
  const corpo = `
<section class="eroe${apertura.immagine ? " eroe-con-arte" : ""}" data-colore="${colore(apertura.categoria)}" aria-labelledby="t-apertura">
  ${apertura.immagine ? `<div class="eroe-arte" aria-hidden="true">${img({ src: apertura.immagine, riserva: apertura.immagineRiserva, lazy: false, priorita: true })}</div>` : ""}
  <div class="eroe-testo">
    <p class="meta">${etichettaCat(apertura.categoria)}<time datetime="${apertura.data.toISOString()}">${dataLunga.format(apertura.data)}</time>${segnoBozza(apertura)}</p>
    <h1 id="t-apertura" class="eroe-titolo"><a href="${apertura.url}">${esc(apertura.titolo)}</a></h1>
    ${apertura.sommario ? `<p class="eroe-sommario">${esc(apertura.sommario)}</p>` : ""}
    <div class="eroe-azioni"><a class="tasto-start" href="${apertura.url}">Leggi l'articolo</a>${hype(apertura.viralita)}</div>
  </div>
  <aside class="classifica" aria-labelledby="t-classifica">
    <h2 id="t-classifica">Classifica hype</h2>
    <ol>${tendenza.map((a) => `<li data-colore="${colore(a.categoria)}"><a href="${a.url}">${esc(a.titolo)}</a><span class="punti">${a.viralita || "–"}</span></li>`).join("")}</ol>
  </aside>
</section>
${resto.length ? `<section class="flusso" aria-labelledby="t-ultime"><h2 id="t-ultime" class="titolo-sezione">Le ultime</h2><div class="griglia">${resto.slice(0, config.articoliPerPagina).map((a) => scheda(a)).join("")}</div>
${resto.length > config.articoliPerPagina ? `<p class="altro"><a class="tasto-start" href="/archivio/">Tutti gli articoli</a></p>` : ""}</section>` : ""}`;
  return pagina({ corpo, ticker: articoli.slice(0, 8) });
}

function paginaArticolo(a, articoli) {
  const correlati = articoli.filter((x) => x !== a && x.categoria === a.categoria).slice(0, 3);
  const fonti = a.fonti.length
    ? `<section class="fonti" aria-labelledby="t-fonti"><h2 id="t-fonti">Fonti</h2><ul>${a.fonti
        .map((f) => `<li><a href="${esc(f.url)}" rel="noopener" target="_blank">${esc(f.titolo || f.url)}</a></li>`)
        .join("")}</ul></section>`
    : "";
  const immagine = a.immagine
    ? `<figure class="immagine">${img({ src: a.immagine, riserva: a.immagineRiserva, alt: a.altImmagine, lazy: false, priorita: true })}${a.creditiImmagine ? `<figcaption>${esc(a.creditiImmagine)}</figcaption>` : ""}</figure>`
    : "";
  const editore = { "@type": "Organization", name: config.nome, url: config.url, logo: { "@type": "ImageObject", url: urlAssoluto("/logo.png"), width: 512, height: 512 } };
  const jsonld = [
    {
      "@context": "https://schema.org", "@type": "NewsArticle",
      headline: (a.titoloSeo || a.titolo).slice(0, 110), description: a.sommario,
      datePublished: a.data.toISOString(), dateModified: (a.aggiornato || a.data).toISOString(),
      inLanguage: "it-IT", articleSection: config.categorie[a.categoria].nome,
      keywords: [a.parolaChiave, ...a.tag].filter(Boolean).join(", "),
      ...(a.immagine ? { image: [urlImmagine(a.immagine)] } : {}),
      author: { "@type": "Organization", name: `Redazione ${config.nome}`, url: urlAssoluto("/chi-siamo/") },
      publisher: editore, mainEntityOfPage: { "@type": "WebPage", "@id": urlAssoluto(a.url) },
      ...(a.fonti.length ? { citation: a.fonti.map((f) => f.url) } : {}),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: config.nome, item: urlAssoluto("/") },
        { "@type": "ListItem", position: 2, name: config.categorie[a.categoria].nome, item: urlAssoluto(`/categoria/${a.categoria}/`) },
        { "@type": "ListItem", position: 3, name: a.titolo, item: urlAssoluto(a.url) },
      ],
    },
  ];
  const corpo = `
<article class="articolo" data-colore="${colore(a.categoria)}">
  <header class="eroe-articolo">
    <nav class="briciole" aria-label="Percorso"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/categoria/${a.categoria}/">${esc(config.categorie[a.categoria].nome)}</a></nav>
    <p class="meta">${etichettaCat(a.categoria)}<time datetime="${a.data.toISOString()}">${dataLunga.format(a.data)}</time><span>${a.minuti} min di lettura</span>${segnoBozza(a)}</p>
    <h1>${esc(a.titolo)}</h1>
    ${a.sommario ? `<p class="occhiello">${esc(a.sommario)}</p>` : ""}
    <div class="eroe-azioni-articolo">${hype(a.viralita)}${tastoLike(a)}${a.bozza ? "" : `<a class="tasto-vai-condividi" href="#condividi">${icona("condividi")}<span>Condividi</span></a>`}</div>
  </header>
  ${immagine}
  <div class="testo">${a.html}</div>
  ${a.tag.length ? `<p class="tag">${a.tag.map((t) => `<span>#${esc(t)}</span>`).join("")}</p>` : ""}
  ${a.bozza ? "" : `<div class="like-fine"><p>Ti è piaciuta questa notizia?</p>${tastoLike(a)}</div>`}
  ${condivisione(a)}
  ${fonti}
</article>
${a.bozza ? "" : `<script src="/like.js" defer></script>\n<script src="/condividi.js" defer></script>`}
${correlati.length ? `<section class="correlati" aria-labelledby="t-corr"><h2 id="t-corr" class="titolo-sezione">Altro da ${esc(config.categorie[a.categoria].nome)}</h2><div class="griglia">${correlati.map((x) => scheda(x)).join("")}</div></section>` : ""}
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>`;
  return pagina({ titolo: a.titolo, titoloSeo: a.titoloSeo, descrizione: a.sommario || config.motto, percorso: a.url, corpo, tipo: "article", articolo: a });
}

function paginaElenco({ titolo, descrizione, percorso, lista, categoria }) {
  const corpo = `
<header class="intestazione-elenco"${categoria ? ` data-colore="${colore(categoria)}"` : ""}>
  <h1>${esc(titolo)}</h1>
  ${descrizione ? `<p>${esc(descrizione)}</p>` : ""}
</header>
${lista.length
    ? `<div class="griglia">${lista.map((a) => scheda(a)).join("")}</div>`
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
    <description>${esc(a.sommario)}</description>${a.immagine ? `\n    <media:content url="${esc(urlImmagine(a.immagine))}" medium="image"/>` : ""}
  </item>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel>
  <title>${esc(config.nome)}</title>
  <link>${config.url}</link>
  <description>${esc(config.motto)}</description>
  <language>it-it</language>${voci}
</channel></rss>`;
}

function sitemap(articoli) {
  const percorsi = ["/", "/archivio/", "/chi-siamo/", "/privacy/", ...Object.keys(config.categorie).map((k) => `/categoria/${k}/`)];
  const righe = percorsi.map((p) => `<url><loc>${urlAssoluto(p)}</loc></url>`)
    .concat(articoli.filter((a) => !a.bozza).map((a) => `<url><loc>${urlAssoluto(a.url)}</loc><lastmod>${(a.aggiornato || a.data).toISOString().slice(0, 10)}</lastmod>${a.immagine ? `<image:image><image:loc>${esc(urlImmagine(a.immagine))}</image:loc></image:image>` : ""}</url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${righe.join("")}</urlset>`;
}

// ---------- font ospitati sul sito (nessuna connessione a Google Fonts) ----------
// I file arrivano dai pacchetti npm di Fontsource e vengono copiati in /font durante la build.
function preparaFont() {
  const regole = [];
  const precarica = [];
  const copia = (pacchetto, filtro) => {
    const cartella = path.join(ROOT, "node_modules", ...pacchetto.split("/"), "files");
    if (!fs.existsSync(cartella)) return [];
    const scelti = fs.readdirSync(cartella).filter((f) => f.endsWith(".woff2") && filtro(f));
    fs.mkdirSync(path.join(DIST, "font"), { recursive: true });
    for (const f of scelti) fs.copyFileSync(path.join(cartella, f), path.join(DIST, "font", f));
    return scelti;
  };
  // Anybody variabile (larghezza e peso), alfabeto latino
  const anybody = copia("@fontsource-variable/anybody", (f) => /-latin-(full|standard|wdth|wght)-(normal|italic)\.woff2$/.test(f));
  for (const stile of ["normal", "italic"]) {
    const f = ["full", "standard", "wdth", "wght"].map((a) => `anybody-latin-${a}-${stile}.woff2`).find((n) => anybody.includes(n));
    if (f) {
      regole.push(`@font-face{font-family:"Anybody";font-style:${stile};font-display:swap;font-weight:100 900;font-stretch:50% 150%;src:url(/font/${f}) format("woff2-variations"),url(/font/${f}) format("woff2");}`);
      if (stile === "italic") precarica.push(f);
    }
  }
  // Atkinson Hyperlegible per il testo
  const atkinson = copia("@fontsource/atkinson-hyperlegible", (f) => /-latin-(400|700)-(normal|italic)\.woff2$/.test(f));
  for (const f of atkinson) {
    const [, peso, stile] = f.match(/-latin-(\d+)-(normal|italic)\.woff2$/);
    regole.push(`@font-face{font-family:"Atkinson Hyperlegible";font-style:${stile};font-display:swap;font-weight:${peso};src:url(/font/${f}) format("woff2");}`);
    if (peso === "400" && stile === "normal") precarica.push(f);
  }
  if (!regole.length) console.warn("Font non trovati (esegui npm install): il sito userà i caratteri di sistema.");
  return { css: regole.join("\n") + "\n", precarica };
}

// ---------- build ----------
const articoli = leggiArticoli();
fs.rmSync(DIST, { recursive: true, force: true });
copiaCartella(PUBBLICO, DIST);
fs.copyFileSync(path.join(ROOT, "src", "stile.css"), path.join(DIST, "stile.css"));
const FONT = preparaFont();
fs.writeFileSync(path.join(DIST, "font.css"), FONT.css);
var FONT_PRECARICA = FONT.precarica.map((f) => `<link rel="preload" href="/font/${f}" as="font" type="font/woff2" crossorigin>\n`).join("");

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
  corpo: `<article class="articolo"><header class="eroe-articolo"><h1>Chi siamo</h1></header><div class="testo">${marked.parse(
    fs.existsSync(path.join(ROOT, "content", "chi-siamo.md")) ? fs.readFileSync(path.join(ROOT, "content", "chi-siamo.md"), "utf8") : ""
  )}</div></article>`,
}));
scrivi("privacy/index.html", pagina({
  titolo: "Privacy", percorso: "/privacy/", descrizione: `Informativa privacy di ${config.nome}`,
  corpo: `<article class="articolo"><header class="eroe-articolo"><h1>Informativa privacy</h1></header><div class="testo">${marked.parse(
    fs.readFileSync(path.join(ROOT, "content", "privacy.md"), "utf8")
      .replaceAll("{{NOME_SITO}}", config.nome)
      .replaceAll("{{TITOLARE}}", config.titolare || "[titolare da completare in sito.config.mjs]")
      .replaceAll("{{EMAIL}}", config.emailContatto || "[email da completare in sito.config.mjs]")
      .replaceAll("{{AGGIORNATA}}", dataLunga.format(new Date(config.privacyAggiornata || Date.now())))
  )}</div></article>`,
}));
if (!config.titolare || !config.emailContatto) console.warn("Avviso: completa titolare ed emailContatto in sito.config.mjs per la pagina privacy.");
scrivi("404.html", pagina({
  titolo: "Pagina non trovata", percorso: "/404.html",
  corpo: `<section class="schermata-titolo"><p class="schermata-sopra">Errore 404</p><h1 class="schermata-logo"><span>Game</span><span>Over</span></h1><p class="schermata-sotto">Questa pagina non esiste. Il link potrebbe essere cambiato.</p><p><a class="tasto-start" href="/">Torna alla prima pagina</a></p></section>`,
}));
scrivi("rss.xml", rss(articoli));
scrivi("sitemap.xml", sitemap(articoli));
// Elenco degli articoli pubblicati per la funzione dei "Mi piace" (accetta voti solo per questi)
fs.mkdirSync(path.join(ROOT, "netlify", "dati"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "netlify", "dati", "articoli.mjs"),
  `// File generato da build.mjs: non modificarlo a mano.\nexport default ${JSON.stringify(articoli.filter((a) => !a.bozza).map((a) => a.slug))};\n`
);

scrivi("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${urlAssoluto("/sitemap.xml")}\n`);

const nBozze = articoli.filter((a) => a.bozza).length;
console.log(`Fatto: ${articoli.length - nBozze} articoli pubblicati${CON_BOZZE ? ` + ${nBozze} bozze in anteprima` : ""} → dist/`);
