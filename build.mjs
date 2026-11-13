// Genera il sito statico multilingua in /dist.
// Uso:  node build.mjs            → sito pubblico (le bozze restano escluse)
//       node build.mjs --bozze    → anteprima con anche le bozze, segnalate da un banner
//
// Contenuti:
//   content/articoli/*.md                 articoli in italiano (lingua principale)
//   content/traduzioni/<lingua>/*.md      traduzioni, stesso nome file dell'originale
//   content/pagine/<lingua>/*.md          pagine fisse (Chi siamo, Contatti, ecc.)
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import config from "./sito.config.mjs";
import { validaArticolo, rimuoviNote } from "./strumenti/verifica-editoriale.mjs";
import { LINGUE, PRINCIPALE, T } from "./lingue.mjs";
import { U } from "./novita.mjs";
import { QUIZ } from "./quiz.mjs";
import { R, USCITE, SONDAGGI, NEWSLETTER } from "./rubriche.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CONTENUTI = path.join(ROOT, "content", "articoli");
const TRADUZIONI = path.join(ROOT, "content", "traduzioni");
const PAGINE = path.join(ROOT, "content", "pagine");
const PUBBLICO = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");
const CON_BOZZE = process.argv.includes("--bozze");
const CODICI = Object.keys(LINGUE);

// ---------- utilità ----------
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const urlAssoluto = (p) => config.url.replace(/\/$/, "") + p;
const formati = {};
const data = (l, d, tipo) => {
  const k = `${l}-${tipo}`;
  formati[k] ??= new Intl.DateTimeFormat(LINGUE[l].intl, tipo === "lunga"
    ? { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Rome" }
    : { day: "numeric", month: "short", timeZone: "Europe/Rome" });
  return formati[k].format(d);
};

// Percorsi: l'italiano non ha prefisso, le altre lingue sì (/en/, /de/...)
const pre = (l) => (l === PRINCIPALE ? "" : `/${l}`);
const P = {
  home: (l) => `${pre(l)}/`,
  articolo: (l, slug) => `${pre(l)}/${T[l].seg.articoli}/${slug}/`,
  categoria: (l, k) => `${pre(l)}/${T[l].seg.categoria}/${k}/`,
  archivio: (l) => `${pre(l)}/${T[l].seg.archivio}/`,
  rss: (l) => `${pre(l)}/rss.xml`,
  quiz: (l) => `${pre(l)}/quiz/`,
  uscite: (l) => `${pre(l)}/${R[l].seg.uscite}/`,
  sondaggio: (l) => `${pre(l)}/${R[l].seg.sondaggio}/`,
  newsletterGrazie: "/newsletter/grazie/",
  newsletterConfermata: "/newsletter/confermata/",
  pagina: (l, slug) => `${pre(l)}/${slug}/`,
};
const tuttePerLingua = (f) => Object.fromEntries(CODICI.map((l) => [l, f(l)]));

function scrivi(rel, contenuto) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contenuto);
}
const scriviPagina = (percorso, html) => scrivi(percorso.endsWith("/") ? `${percorso}index.html` : percorso, html);

function copiaCartella(da, a) {
  if (!fs.existsSync(da)) return;
  for (const voce of fs.readdirSync(da, { withFileTypes: true })) {
    const src = path.join(da, voce.name);
    const dst = path.join(a, voce.name);
    if (voce.isDirectory()) copiaCartella(src, dst);
    else { fs.mkdirSync(a, { recursive: true }); fs.copyFileSync(src, dst); }
  }
}

const minutiLettura = (l, testo) =>
  Math.max(1, Math.round(l === "ja" ? testo.replace(/\s+/g, "").length / 500 : testo.split(/\s+/).filter(Boolean).length / 220));
const leggiDataFm = (v) => (v instanceof Date ? v : new Date(v));

// ---------- lettura articoli ----------
function leggiOriginali() {
  if (!fs.existsSync(CONTENUTI)) return [];
  const errori = [];
  const articoli = fs.readdirSync(CONTENUTI)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const originale = fs.readFileSync(path.join(CONTENUTI, file), "utf8");
      const { data: d, content } = matter(originale);
      const verifica = validaArticolo(file, originale, { categorie: Object.keys(config.categorie), bozza: d.bozza === true });
      for (const problema of verifica.errori) errori.push(`${file}: ${problema}`);
      for (const avviso of verifica.avvisi) console.warn(`Avviso ${file}: ${avviso}`);
      const slug = file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
      const dataPub = leggiDataFm(d.data);
      if (!d.titolo) errori.push(`${file}: manca "titolo"`);
      if (Number.isNaN(dataPub.getTime())) errori.push(`${file}: "data" non valida (usa AAAA-MM-GG)`);
      if (d.categoria && !config.categorie[d.categoria]) {
        errori.push(`${file}: categoria "${d.categoria}" sconosciuta (usa: ${Object.keys(config.categorie).join(", ")})`);
      }
      return {
        lingua: PRINCIPALE, file, id: slug, slug,
        titolo: d.titolo || slug,
        sommario: d.sommario || "",
        data: dataPub,
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
        aggiornato: d.aggiornato ? leggiDataFm(d.aggiornato) : null,
        minuti: minutiLettura(PRINCIPALE, content),
        html: marked.parse(rimuoviNote(content)).replace(/<p>\s*<\/p>/g, ""),
        url: P.articolo(PRINCIPALE, slug),
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
  return articoli;
}

// Una traduzione prende dall'originale data, categoria, immagini, fonti e stato (bozza o pubblicato).
function leggiTraduzioni(originali) {
  const perFile = new Map(originali.map((a) => [a.file, a]));
  const risultato = [];
  for (const l of CODICI) {
    if (l === PRINCIPALE) continue;
    const cartella = path.join(TRADUZIONI, l);
    if (!fs.existsSync(cartella)) continue;
    for (const file of fs.readdirSync(cartella).filter((f) => f.endsWith(".md"))) {
      const base = perFile.get(file);
      if (!base) { console.warn(`Avviso traduzioni/${l}/${file}: manca l'articolo italiano con lo stesso nome, ignorata.`); continue; }
      const { data: d, content } = matter(fs.readFileSync(path.join(cartella, file), "utf8"));
      if (!d.titolo || !content.trim()) { console.warn(`Avviso traduzioni/${l}/${file}: mancano titolo o testo, ignorata.`); continue; }
      const slug = String(d.slug || base.slug).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || base.slug;
      risultato.push({
        ...base,
        lingua: l, file, slug,
        titolo: d.titolo,
        titoloSeo: d.titolo_seo || "",
        sommario: d.sommario || "",
        altImmagine: d.alt_immagine || d.titolo,
        creditiImmagine: d.crediti_immagine || base.creditiImmagine,
        tag: Array.isArray(d.tag) ? d.tag : base.tag,
        parolaChiave: d.parola_chiave || "",
        minuti: minutiLettura(l, content),
        html: marked.parse(rimuoviNote(content)).replace(/<p>\s*<\/p>/g, ""),
        url: P.articolo(l, slug),
        originale: base,
      });
    }
  }
  return risultato;
}

const ordina = (lista) => lista.sort((a, b) => b.data - a.data || b.viralita - a.viralita);

// ---------- pagine fisse ----------
function leggiPagine() {
  const pagine = [];
  for (const l of CODICI) {
    const cartella = path.join(PAGINE, l);
    if (!fs.existsSync(cartella)) continue;
    for (const file of fs.readdirSync(cartella).filter((f) => f.endsWith(".md"))) {
      const { data: d, content } = matter(fs.readFileSync(path.join(cartella, file), "utf8"));
      const id = file.replace(/\.md$/, "");
      pagine.push({
        lingua: l, id,
        titolo: d.titolo || id, menu: d.menu || d.titolo || id,
        slug: d.slug || id, ordine: Number(d.ordine) || 99,
        descrizione: d.descrizione || "", sopratitolo: d.sopratitolo || "", occhiello: d.occhiello || "",
        corpo: content,
        url: P.pagina(l, d.slug || id),
      });
    }
  }
  return pagine;
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
// Tabelle: una cornice che scorre di lato su telefono; i punteggi (es. 3-1) non vanno mai a capo
marked.use({
  hooks: {
    postprocess(html) {
      return html
        .replace(/<table>/g, '<div class="tabella" tabindex="0"><table>')
        .replace(/<\/table>/g, "</table></div>")
        .replace(/<td>(\d{1,2}\s?[-–]\s?\d{1,2})<\/td>/g, '<td class="punteggio">$1</td>');
    },
  },
});
const urlImmagine = (u) => (!u ? "" : /^https?:\/\//.test(u) ? u : urlAssoluto(u.startsWith("/") ? u : `/${u}`));

// ---------- componenti ----------
const colore = (cat) => config.categorie[cat].colore;
const nomeCat = (l, cat) => T[l].categorie[cat]?.nome || config.categorie[cat].nome;
const pallino = (cat) => `<span class="pallino" data-colore="${colore(cat)}" aria-hidden="true"></span>`;
const etichettaCat = (l, cat) =>
  `<a class="cat" href="${P.categoria(l, cat)}" data-colore="${colore(cat)}">${esc(nomeCat(l, cat))}</a>`;
// Stessa etichetta senza link, per i riquadri che sono già un link
const etichettaCatSemplice = (l, cat) => `<span class="cat" data-colore="${colore(cat)}">${esc(nomeCat(l, cat))}</span>`;
const segnoBozza = (a) => (a.bozza ? `<span class="segno-bozza">${esc(T[a.lingua].bozza)}</span>` : "");
const hype = (l, v) => {
  const pieni = Math.round(Math.max(0, Math.min(100, v)) / 10);
  const tacche = Array.from({ length: 10 }, (_, i) => `<i${i < pieni ? ' class="on"' : ""}></i>`).join("");
  return v ? `<span class="hype" role="img" aria-label="${esc(T[l].hypeAria(v))}"><span class="hype-nome" aria-hidden="true">Hype</span><span class="hype-barra" aria-hidden="true">${tacche}</span><b aria-hidden="true">${v}</b></span>` : "";
};

// Tasto "Mi piace": il conteggio è condiviso tra tutte le lingue (usa l'identificativo dell'articolo italiano).
const tastoLike = (a) =>
  a.bozza
    ? ""
    : `<button type="button" class="tasto-like" data-like="${esc(a.id)}" data-no="${esc(T[a.lingua].miPiace)}" data-si="${esc(T[a.lingua].tiPiace)}" aria-pressed="false"><svg class="cuore" viewBox="0 0 9 8" aria-hidden="true"><path d="M1 0h2v1h1v1h1V1h1V0h2v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z"/></svg><span class="like-testo">${esc(T[a.lingua].miPiace)}</span><span class="like-conto" aria-live="polite"></span></button>`;

const ICONE = {
  whatsapp: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3z"/>',
  telegram: '<path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.2 1.8 11.7c-1-.3-1-1 .2-1.5L20.5 3.1c.9-.3 1.6.2 1.4 1.2z"/>',
  x: '<path d="M17.8 2.5h3.3l-7.2 8.2 8.5 10.8h-6.6l-5.2-6.7-6 6.7H1.3l7.7-8.8L.9 2.5h6.8l4.7 6.1 5.4-6.1zm-1.2 17.1h1.8L6.6 4.3H4.6l12 15.3z"/>',
  facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/>',
  link: '<path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0zm-2.8 6.4a4.5 4.5 0 0 1-3.2-7.7l2.5-2.5a1 1 0 1 1 1.4 1.4L6 13.5a2.5 2.5 0 0 0 3.5 3.5L12 14.5a1 1 0 1 1 1.4 1.4L11 18.4a4.5 4.5 0 0 1-3.2 1.4zm8.2-5.6a1 1 0 0 1-.7-1.7L18 10a2.5 2.5 0 0 0-3.5-3.5L12 9a1 1 0 1 1-1.4-1.4L13 5a4.5 4.5 0 0 1 6.4 6.4L16.7 14a1 1 0 0 1-.7.2z"/>',
  condividi: '<path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/>',
  globo: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4H4.3zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.4-3.6A15.7 15.7 0 0 0 8.1 8zM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.2 5.6a15.7 15.7 0 0 0 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.8-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4h-3.4z"/>',
};
const icona = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONE[n]}</svg>`;
function condivisione(a) {
  if (a.bozza) return "";
  const t = T[a.lingua];
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
  <p class="condividi-titolo">${esc(t.passala)}</p>
  <div class="condividi-tasti">
    <button type="button" class="tasto-condividi nativo" hidden>${icona("condividi")}<span>${esc(t.condividi)}</span></button>
    ${voci.map(([k, nome, href]) => `<a class="tasto-condividi" data-rete="${k}" href="${esc(href)}" target="_blank" rel="noopener">${icona(k)}<span>${nome}</span></a>`).join("\n    ")}
    <button type="button" class="tasto-condividi copia" data-testo="${esc(t.copiaLink)}" data-fatto="${esc(t.linkCopiato)}">${icona("link")}<span class="copia-testo">${esc(t.copiaLink)}</span></button>
  </div>
</div>`;
}

// Selettore della lingua: porta alla stessa pagina nelle altre lingue, o alla loro prima pagina se non è tradotta.
function selettoreLingua(l, alternative) {
  const voci = CODICI.map((x) => {
    const href = alternative[x] || P.home(x);
    return `<li><a href="${href}" hreflang="${LINGUE[x].hreflang}" lang="${LINGUE[x].hreflang}"${x === l ? ' aria-current="true"' : ""}><span class="lingua-codice">${LINGUE[x].bandiera}</span>${esc(LINGUE[x].nome)}</a></li>`;
  }).join("");
  return `<details class="lingue"><summary aria-label="${esc(T[l].lingua)}: ${esc(LINGUE[l].nome)}">${icona("globo")}<span>${LINGUE[l].bandiera}</span></summary><ul>${voci}</ul></details>`;
}

let PAGINE_FISSE = [];
const pagineDi = (l) => PAGINE_FISSE.filter((p) => p.lingua === l).sort((a, b) => a.ordine - b.ordine);
const urlPaginaFissa = (l, id) => (PAGINE_FISSE.find((p) => p.lingua === l && p.id === id) || PAGINE_FISSE.find((p) => p.lingua === PRINCIPALE && p.id === id))?.url || P.home(l);

function pagina({ l, titolo, titoloSeo = "", descrizione, percorso, corpo, tipo = "website", ticker = [], articolo = null, alternative = {}, robots = "index, follow, max-image-preview:large, max-snippet:-1", errore = false }) {
  // Pagine di errore (404): fuori da Google, senza canonical, hreflang né og:url
  if (errore) robots = "noindex, follow";
  const t = T[l];
  const u = U[l];
  descrizione ??= t.motto;
  alternative = errore ? {} : { ...alternative, [l]: percorso };
  const titoloCompleto = titolo ? `${titoloSeo || titolo} – ${config.nome}` : `${config.nome} – ${t.motto}`;
  const immagineSocial = articolo?.immagine ? urlImmagine(articolo.immagine) : urlAssoluto("/condivisione.png");
  const metaArticolo = articolo
    ? `\n<meta property="article:published_time" content="${articolo.data.toISOString()}">${articolo.aggiornato ? `\n<meta property="article:modified_time" content="${articolo.aggiornato.toISOString()}">` : ""}\n<meta property="article:section" content="${esc(nomeCat(l, articolo.categoria))}">${articolo.tag.map((x) => `\n<meta property="article:tag" content="${esc(x)}">`).join("")}`
    : "";
  const hreflang = CODICI.filter((x) => alternative[x])
    .map((x) => `\n<link rel="alternate" hreflang="${LINGUE[x].hreflang}" href="${urlAssoluto(alternative[x])}">`).join("")
    + (alternative[PRINCIPALE] ? `\n<link rel="alternate" hreflang="x-default" href="${urlAssoluto(alternative[PRINCIPALE])}">` : "");
  const ogAlt = CODICI.filter((x) => x !== l && alternative[x]).map((x) => `\n<meta property="og:locale:alternate" content="${LINGUE[x].og}">`).join("");
  const nav = Object.keys(config.categorie)
    .map((k) => `<a href="${P.categoria(l, k)}" data-colore="${colore(k)}"${percorso === P.categoria(l, k) ? ' aria-current="page"' : ""}>${pallino(k)}${esc(nomeCat(l, k))}</a>`)
    .join("");
  const vociTicker = ticker.map((a) => `<a href="${a.url}">${pallino(a.categoria)}${esc(a.titolo)}</a>`).join("");
  const nastro = ticker.length
    ? `<div class="ticker" aria-label="${esc(t.ultimeNotizie)}"><span class="ticker-etichetta">${esc(t.live)}</span><div class="ticker-finestra"><div class="ticker-nastro">${vociTicker}<span class="ticker-copia" aria-hidden="true">${vociTicker.replace(/<a /g, '<a tabindex="-1" ')}</span></div></div></div>`
    : "";
  const linkPiede = [`<a href="${P.archivio(l)}">${esc(t.archivio)}</a>`, `<a href="${P.uscite(l)}">${esc(R[l].uscite.nome)}</a>`, `<a href="${P.sondaggio(l)}">${esc(R[l].poll.nome)}</a>`, ...pagineDi(l).map((p) => `<a href="${p.url}">${esc(p.menu)}</a>`), `<a href="${P.rss(l)}">${esc(t.feedRss)}</a>`].join("");
  return `<!doctype html>
<html lang="${LINGUE[l].hreflang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titoloCompleto)}</title>
<meta name="description" content="${esc(descrizione)}">
<meta name="theme-color" content="#15122b">
<meta name="robots" content="${robots}">
${errore ? "" : `<link rel="canonical" href="${urlAssoluto(percorso)}">${hreflang}`}
<meta property="og:type" content="${tipo}">
<meta property="og:title" content="${esc(titolo || config.nome)}">
<meta property="og:description" content="${esc(descrizione)}">
${errore ? "" : `<meta property="og:url" content="${urlAssoluto(percorso)}">`}
<meta property="og:site_name" content="${esc(config.nome)}">
<meta property="og:locale" content="${LINGUE[l].og}">${ogAlt}
<meta property="og:image" content="${esc(immagineSocial)}">
<meta property="og:image:alt" content="${esc(articolo?.immagine ? articolo.altImmagine : config.nome)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titoloSeo || titolo || config.nome)}">
<meta name="twitter:description" content="${esc(descrizione)}">
<meta name="twitter:image" content="${esc(immagineSocial)}">${metaArticolo}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${esc(config.nome)}" href="${P.rss(l)}">
${FONT_PRECARICA}<link rel="stylesheet" href="/font.css">
<link rel="stylesheet" href="/stile.css">
<link rel="stylesheet" href="/novita.css">
<link rel="stylesheet" href="/quiz.css">
<link rel="stylesheet" href="/rubriche.css">${config.googleVerifica ? `\n<meta name="google-site-verification" content="${esc(config.googleVerifica)}">` : ""}
</head>
<body>
${CON_BOZZE ? `<div class="banner-anteprima">${esc(t.banner)}</div>` : ""}
<a class="salta" href="#contenuto">${esc(t.vaiContenuto)}</a>
<header class="testata">
  <div class="testata-riga">
    <a class="marchio" href="${P.home(l)}" aria-label="${esc(config.nome)}, ${esc(t.home)}"><span>Soffia</span><span>Cartuccia</span><i class="cursore" aria-hidden="true"></i></a>
    <div class="testata-destra">
      <nav class="categorie" aria-label="${esc(t.navCategorie)}">${nav}</nav>
      <a class="quiz-nav" href="${P.quiz(l)}">✦ ${esc(QUIZ[l].nome)}</a>
      <button type="button" class="bottone-ricerca" data-ricerca-apri hidden aria-haspopup="dialog">${esc(u.search)} ⌕</button>
      ${selettoreLingua(l, alternative)}
    </div>
  </div>
  ${nastro}
</header>
<main id="contenuto">
${corpo}
</main>
<footer class="piede">
  <p class="piede-marchio">Soffia Cartuccia</p>
  <p>${esc(t.motto)}. ${esc(t.fontiPiede)}</p>
  <p class="piede-link">${linkPiede}</p>
  <nav class="piede-lingue" aria-label="${esc(t.lingua)}">${CODICI.map((x) => `<a href="${alternative[x] || P.home(x)}" hreflang="${LINGUE[x].hreflang}" lang="${LINGUE[x].hreflang}"${x === l ? ' aria-current="true"' : ""}>${esc(LINGUE[x].nome)}</a>`).join("")}</nav>
</footer>
<dialog class="ricerca-dialog" data-ricerca-dialog data-scrivi="${esc(u.searchType)}" data-vuoto="${esc(u.searchEmpty)}" data-errore="${esc(u.searchError)}" aria-labelledby="ricerca-titolo">
 <div class="ricerca-top"><h2 id="ricerca-titolo">${esc(u.search)}</h2><button class="bottone-ricerca" type="button" data-ricerca-chiudi>${esc(u.close)}</button></div>
 <label for="ricerca-input">${esc(u.searchHint)}</label>
 <input id="ricerca-input" type="search" data-ricerca-input autocomplete="off" maxlength="120" placeholder="${esc(u.searchHint)}">
 <p class="ricerca-stato" data-ricerca-stato role="status" aria-live="polite">${esc(u.searchType)}</p><ul class="ricerca-risultati" data-ricerca-risultati></ul>
</dialog>
<script src="/esperienza.js" defer></script>
<script>document.addEventListener("click",function(e){document.querySelectorAll("details.lingue[open]").forEach(function(d){if(!d.contains(e.target))d.removeAttribute("open")})});</script>
</body>
</html>`;
}

function scheda(a) {
  const l = a.lingua;
  const copertina = `<span class="copertina-nome" aria-hidden="true">${esc(nomeCat(l, a.categoria))}</span>${
    a.immagine ? img({ src: a.immagine, riserva: a.immagineRiserva, alt: a.altImmagine }) : ""}`;
  return `<article class="scheda" data-colore="${colore(a.categoria)}">
  <div class="copertina">${copertina}</div>
  <div class="scheda-corpo">
    <p class="meta">${etichettaCat(l, a.categoria)}<time datetime="${a.data.toISOString()}">${data(l, a.data, "breve")}</time>${segnoBozza(a)}</p>
    <h2 class="titolo-scheda"><a href="${a.url}">${esc(a.titolo)}</a></h2>
    ${a.sommario ? `<p class="sommario">${esc(a.sommario)}</p>` : ""}
    ${hype(l, a.viralita)}
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
function home(l, articoli) {
  const t = T[l];
  const u = U[l];
  const alternative = tuttePerLingua(P.home);
  if (!articoli.length) {
    return pagina({
      l, percorso: P.home(l), alternative,
      corpo: `<section class="schermata-titolo">
  <p class="schermata-sopra">${esc(t.vuotoSopra)}</p>
  <h1 class="schermata-logo"><span>Soffia</span><span>Cartuccia</span></h1>
  <p class="schermata-lampeggia">${esc(t.vuotoLampeggia)}</p><p class="schermata-sotto">${esc(t.vuotoSotto)}</p>
  <p class="schermata-sotto"><a href="${P.rss(l)}">${esc(t.feedRss)}</a></p>
</section>`,
    });
  }
  const [apertura, ...resto] = articoli;
  const tendenza = inTendenza(articoli);
  const digest = articoli.slice(0, 3);
  const retro = articoli.filter((a) => a.categoria === "retro").slice(0,3);
  const mondi = Object.keys(config.categorie).map((k)=>`<a class="mondo-link" data-colore="${colore(k)}" href="${P.categoria(l,k)}"><strong>${esc(nomeCat(l,k))}</strong><span>${esc(T[l].categorie[k]?.descrizione || config.categorie[k].descrizione)}</span></a>`).join("");
  const corpo = `
<div class="intro-ritmo"><div><span class="eyebrow">${esc(config.nome)}</span><p>${esc(t.motto)}</p></div><a class="intro-link" href="${P.archivio(l)}">${esc(u.viewArchive)} ↗</a></div>
<section class="eroe${apertura.immagine ? " eroe-con-arte" : ""}" data-colore="${colore(apertura.categoria)}" aria-labelledby="t-apertura">
  ${apertura.immagine ? `<div class="eroe-arte" aria-hidden="true">${img({ src: apertura.immagine, riserva: apertura.immagineRiserva, lazy: false, priorita: true })}</div>` : ""}
  <div class="eroe-testo">
    <p class="meta">${etichettaCat(l, apertura.categoria)}<time datetime="${apertura.data.toISOString()}">${data(l, apertura.data, "lunga")}</time>${segnoBozza(apertura)}</p>
    <h1 id="t-apertura" class="eroe-titolo"><a href="${apertura.url}">${esc(apertura.titolo)}</a></h1>
    ${apertura.sommario ? `<p class="eroe-sommario">${esc(apertura.sommario)}</p>` : ""}
    <div class="eroe-azioni"><a class="tasto-start" href="${apertura.url}">${esc(t.leggi)}</a>${hype(l, apertura.viralita)}</div>
  </div>
  <aside class="classifica" aria-labelledby="t-classifica">
    <h2 id="t-classifica">${esc(t.classifica)}</h2>
    <ol>${tendenza.map((a) => `<li data-colore="${colore(a.categoria)}"><a href="${a.url}">${esc(a.titolo)}</a><span class="punti">${a.viralita || "–"}</span></li>`).join("")}</ol>
  </aside>
</section>
<section class="blocco-novita" aria-labelledby="t-digest"><div class="blocco-heading"><div><span class="eyebrow">01 / ${esc(u.digest)}</span><h2 id="t-digest" class="titolo-sezione">${esc(u.digest)}</h2><p>${esc(u.digestLead)}</p></div></div><div class="digest-griglia">${digest.map((a,i)=>`<article class="digest-voce"><span class="digest-numero" aria-hidden="true">0${i+1}</span><h3><a href="${a.url}">${esc(a.titolo)}</a></h3><p>${esc(a.sommario)}</p></article>`).join("")}</div></section>
${bloccoUscite(l, articoli)}
<section class="blocco-novita" aria-labelledby="t-mondi"><div class="blocco-heading"><div><span class="eyebrow">03 / ${esc(u.world)}</span><h2 id="t-mondi" class="titolo-sezione">${esc(u.world)}</h2><p>${esc(u.worldLead)}</p></div></div><div class="mondi-griglia">${mondi}</div></section>
<section class="blocco-novita checkpoint" id="checkpoint" data-checkpoint data-prima="${esc(u.checkpointFirst)}" data-nuovi="${esc(u.checkpointFresh)}" data-aggiornato="${esc(u.checkpointNoNew)}" data-vuoto="${esc(u.checkpointNoNew)}" data-nessun-salvato="${esc(u.savedEmpty)}" data-errore="${esc(u.searchError)}" data-attiva="${esc(u.checkpointOn)}" data-disattiva="${esc(u.checkpointOff)}" data-spento="${esc(u.checkpointOffText)}" aria-labelledby="t-checkpoint"><div class="blocco-heading"><div><span class="eyebrow">04 / Checkpoint</span><h2 id="t-checkpoint" class="titolo-sezione">${esc(u.checkpoint)}</h2><p>${esc(u.checkpointLead)}</p></div><button type="button" class="bottone-salva" data-checkpoint-toggle aria-pressed="false">${esc(u.checkpointOn)}</button></div><div class="checkpoint-layout"><div class="checkpoint-gruppo"><h3>${esc(u.checkpointFresh)}</h3><p class="checkpoint-stato" data-checkpoint-stato aria-live="polite"></p><ul class="checkpoint-lista" data-checkpoint-news></ul></div><div class="checkpoint-gruppo"><h3>${esc(u.checkpointSaved)}</h3><ul class="checkpoint-lista" data-checkpoint-salvati></ul></div></div></section>
${retro.length ? `<section class="blocco-novita" aria-labelledby="t-retro"><div class="blocco-heading"><div><span class="eyebrow">05 / Retro</span><h2 id="t-retro" class="titolo-sezione">${esc(u.retro)}</h2><p>${esc(u.retroLead)}</p></div><a class="intro-link" href="${P.categoria(l,"retro")}">${esc(u.viewAll)} ↗</a></div><div class="griglia">${retro.map(scheda).join("")}</div></section>` : ""}
<section class="blocco-novita quiz-richiamo" aria-labelledby="t-quiz"><div><span class="eyebrow">06 / Daily Quest</span><h2 id="t-quiz" class="titolo-sezione">${esc(QUIZ[l].nome)}</h2><p>${esc(QUIZ[l].intro)}</p></div><a class="tasto-start" href="${P.quiz(l)}">${esc(QUIZ[l].data)}</a></section>
${bloccoSondaggio(l)}
${boxNewsletter(l)}
${resto.length ? `<section class="flusso" aria-labelledby="t-ultime"><h2 id="t-ultime" class="titolo-sezione">${esc(t.ultime)}</h2><div class="griglia">${resto.slice(0, config.articoliPerPagina).map((a) => scheda(a)).join("")}</div>
${resto.length > config.articoliPerPagina ? `<p class="altro"><a class="tasto-start" href="${P.archivio(l)}">${esc(t.tutti)}</a></p>` : ""}</section>` : ""}`;
  return pagina({ l, percorso: P.home(l), corpo, ticker: articoli.slice(0, 8), alternative });
}

function paginaArticolo(a, stessaLingua, versioni) {
  const l = a.lingua;
  const t = T[l];
  const u = U[l];
  const correlati = stessaLingua.filter((x) => x !== a && x.categoria === a.categoria).slice(0, 3);
  const fonti = a.fonti.length
    ? `<section class="fonti" aria-labelledby="t-fonti"><h2 id="t-fonti">${esc(t.fonti)}</h2><ul>${a.fonti
        .map((f) => `<li><a href="${esc(f.url)}" rel="noopener" target="_blank">${esc(f.titolo || f.url)}</a></li>`)
        .join("")}</ul></section>`
    : "";
  const immagine = a.immagine
    ? `<figure class="immagine">${img({ src: a.immagine, riserva: a.immagineRiserva, alt: a.altImmagine, lazy: false, priorita: true })}${a.creditiImmagine ? `<figcaption>${esc(a.creditiImmagine)}</figcaption>` : ""}</figure>`
    : "";
  const alternative = Object.fromEntries(versioni.map((v) => [v.lingua, v.url]));
  const notaTraduzione = a.originale ? `<p class="nota-traduzione">${t.tradotto(a.originale.url)}</p>` : "";
  const altreLingue = versioni.filter((v) => v.lingua !== l);
  const editore = { "@type": "Organization", name: config.nome, url: config.url, logo: { "@type": "ImageObject", url: urlAssoluto("/logo.png"), width: 512, height: 512 } };
  const jsonld = [
    {
      "@context": "https://schema.org", "@type": "NewsArticle",
      headline: (a.titoloSeo || a.titolo).slice(0, 110), description: a.sommario,
      datePublished: a.data.toISOString(), dateModified: (a.aggiornato || a.data).toISOString(),
      inLanguage: LINGUE[l].intl, articleSection: nomeCat(l, a.categoria),
      keywords: [a.parolaChiave, ...a.tag].filter(Boolean).join(", "),
      ...(a.immagine ? { image: [urlImmagine(a.immagine)] } : {}),
      author: { "@type": "Organization", name: `${t.redazione} ${config.nome}`, url: urlAssoluto(urlPaginaFissa(l, "chi-siamo")) },
      publisher: editore, mainEntityOfPage: { "@type": "WebPage", "@id": urlAssoluto(a.url) },
      ...(a.originale ? { translationOfWork: { "@id": urlAssoluto(a.originale.url) } } : {}),
      ...(a.fonti.length ? { citation: a.fonti.map((f) => f.url) } : {}),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: config.nome, item: urlAssoluto(P.home(l)) },
        { "@type": "ListItem", position: 2, name: nomeCat(l, a.categoria), item: urlAssoluto(P.categoria(l, a.categoria)) },
        { "@type": "ListItem", position: 3, name: a.titolo, item: urlAssoluto(a.url) },
      ],
    },
  ];
  const corpo = `
<div class="lettura-progresso" data-lettura-progresso aria-hidden="true"></div>
<article class="articolo" data-colore="${colore(a.categoria)}">
  <header class="eroe-articolo">
    <nav class="briciole" aria-label="${esc(t.percorso)}"><a href="${P.home(l)}">${esc(t.home)}</a><span aria-hidden="true">/</span><a href="${P.categoria(l, a.categoria)}">${esc(nomeCat(l, a.categoria))}</a></nav>
    <p class="meta">${etichettaCat(l, a.categoria)}<time datetime="${a.data.toISOString()}">${data(l, a.data, "lunga")}</time><span>${esc(t.minuti(a.minuti))}</span>${segnoBozza(a)}</p>
    <h1>${esc(a.titolo)}</h1>
    ${a.sommario ? `<p class="occhiello">${esc(a.sommario)}</p>` : ""}
    <div class="eroe-azioni-articolo">${hype(l, a.viralita)}${tastoLike(a)}${a.bozza ? "" : `<button type="button" hidden class="bottone-salva" data-salva-articolo="${esc(a.id)}" data-salva="${esc(u.save)}" data-salvato="${esc(u.saved)}" aria-pressed="false">${esc(u.save)}</button>`}${a.bozza ? "" : `<a class="tasto-vai-condividi" href="#condividi">${icona("condividi")}<span>${esc(t.condividi)}</span></a>`}</div>
  </header>
  ${immagine}
  <div class="testo">${a.html}</div>
  ${notaTraduzione}
  ${a.tag.length ? `<p class="tag">${a.tag.map((x) => `<span>#${esc(x)}</span>`).join("")}</p>` : ""}
  ${a.bozza ? "" : `<div class="like-fine"><p>${esc(t.tiPiaciuta)}</p>${tastoLike(a)}</div>`}
  ${condivisione(a)}
  ${a.bozza ? "" : boxNewsletter(l)}
  ${fonti}
  ${altreLingue.length ? `<nav class="altre-lingue" aria-label="${esc(t.altreLingue)}"><p>${icona("globo")}${esc(t.altreLingue)}</p><ul>${altreLingue.map((v) => `<li><a href="${v.url}" hreflang="${LINGUE[v.lingua].hreflang}" lang="${LINGUE[v.lingua].hreflang}">${esc(LINGUE[v.lingua].nome)}</a></li>`).join("")}</ul></nav>` : ""}
</article>
${a.bozza ? "" : `<script src="/like.js" defer></script>\n<script src="/condividi.js" defer></script>`}
${correlati.length ? `<section class="correlati" aria-labelledby="t-corr"><h2 id="t-corr" class="titolo-sezione">${esc(t.altroDa(nomeCat(l, a.categoria)))}</h2><div class="griglia">${correlati.map((x) => scheda(x)).join("")}</div></section>` : ""}
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>`;
  return pagina({ l, titolo: a.titolo, titoloSeo: a.titoloSeo, descrizione: a.sommario || t.motto, percorso: a.url, corpo, tipo: "article", articolo: a, alternative });
}

function paginaQuiz(l) {
  const q = QUIZ[l];
  const dati = JSON.stringify(q).replace(/</g, "\\u003c");
  const corpo = `<section class="quiz-pagina" aria-labelledby="quiz-titolo">
    <a class="intro-link" href="${P.home(l)}">← ${esc(T[l].home)}</a>
    <div class="quiz-shell" data-quiz>
      <span class="eyebrow">DAILY QUEST / 01</span>
      <h1 id="quiz-titolo">${esc(q.nome)}</h1>
      <p class="quiz-intro">${esc(q.intro)}</p>
      <p class="quiz-data">${esc(q.data)} · <time data-giorno></time></p>
      <h2 class="quiz-domanda" data-domanda>${esc(q.prepara)}</h2>
      <div data-opzioni></div>
      <button type="button" hidden class="tasto-start quiz-verifica" data-verifica>${esc(q.verifica)}</button>
      <div class="quiz-esito" data-esito tabindex="-1" aria-live="polite" hidden></div>
      <button type="button" class="intro-link" data-condividi hidden>${esc(q.condividi)}</button>
      <noscript><p>${esc(q.errore)}</p></noscript>
    </div>
    <p class="quiz-torna"><a class="intro-link" href="${P.archivio(l)}">${esc(q.altro)} ↗</a></p>
  </section>
  <script id="quiz-dati" type="application/json">${dati}</script>
  <script src="/quiz.js" defer></script>`;
  return pagina({ l, titolo:q.nome, descrizione:q.intro, percorso:P.quiz(l),corpo,alternative:tuttePerLingua(P.quiz) });
}

// ---------- rubriche: calendario uscite, sondaggio, newsletter ----------
const OGGI = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
const dataUTC = (iso) => new Date(`${iso}T00:00:00Z`);
const fmtData = (l, opzioni) => new Intl.DateTimeFormat(LINGUE[l].intl, { timeZone: "UTC", ...opzioni });
const maiuscola = (s) => s.charAt(0).toLocaleUpperCase() + s.slice(1);
const prossimeUscite = () =>
  USCITE.filter((u) => !u.data || u.data >= OGGI).sort((a, b) => (a.data || `${a.anno}-99`).localeCompare(b.data || `${b.anno}-99`));
const linkArticolo = (lista, id) => (id ? lista.find((a) => a.id === id && !a.bozza)?.url : undefined);

function voceUscita(l, u, lista, completa) {
  const t = R[l].uscite;
  const quando = u.data
    ? `<time class="uscita-data" datetime="${u.data}"><span class="uscita-giorno">${fmtData(l, { day: "numeric" }).format(dataUTC(u.data))}</span><span class="uscita-mese">${esc(fmtData(l, { month: "short" }).format(dataUTC(u.data)))}</span></time>`
    : `<span class="uscita-data uscita-tbd"><span class="uscita-giorno">${esc(u.anno)}</span><span class="uscita-mese">TBA</span></span>`;
  const url = linkArticolo(lista, u.articolo);
  const link = url
    ? `<a class="uscita-link" href="${url}">${esc(t.notizia)} →</a>`
    : completa ? `<a class="uscita-link" href="${esc(u.fonte)}" rel="noopener" target="_blank">${esc(t.fonte)} ↗</a>` : "";
  return `<li class="uscita${u.evidenza ? " uscita-top" : ""}"${u.data ? ` data-uscita="${u.data}"` : ""}>${quando}<div class="uscita-info"><strong class="uscita-gioco">${esc(u.gioco)}</strong><span class="uscita-piattaforme">${u.piattaforme.map((p) => `<span>${esc(p)}</span>`).join("")}${u.tipo ? `<span class="uscita-tipo">${esc(t.tipi[u.tipo])}</span>` : ""}</span></div><div class="uscita-lato"><span class="uscita-mancano"${u.data ? " data-mancano" : ""}>${u.data ? "" : esc(t.senzaData)}</span>${link}</div></li>`;
}

function contoGrande(l, u, lista) {
  const t = R[l].uscite;
  const url = linkArticolo(lista, u.articolo);
  const nome = url ? `<a href="${url}">${esc(u.gioco)}</a>` : esc(u.gioco);
  const celle = ["day", "hour", "minute", "second"].map((k) => `<span class="conto-cella" data-unita="${k}"><b>–</b><small></small></span>`).join("");
  return `<div class="conto" data-conto="${u.data}" data-uscito="${esc(t.uscito)}"><p class="conto-etichetta">${esc(t.conto)}</p><p class="conto-gioco">${nome}</p><div class="conto-celle" aria-hidden="true">${celle}</div><p class="conto-quando"><time datetime="${u.data}">${esc(maiuscola(fmtData(l, { dateStyle: "full" }).format(dataUTC(u.data))))}</time> · ${esc(u.piattaforme.join(", "))}</p><p class="conto-stato" data-conto-stato></p></div>`;
}

function bloccoUscite(l, lista) {
  const t = R[l].uscite;
  const pros = prossimeUscite().filter((u) => u.data);
  if (!pros.length) return "";
  const top = pros.find((u) => u.evidenza) || pros[0];
  return `<section class="blocco-novita uscite-box" aria-labelledby="t-uscite"><div class="blocco-heading"><div><span class="eyebrow">02 / ${esc(t.conto)}</span><h2 id="t-uscite" class="titolo-sezione">${esc(t.prossime)}</h2><p>${esc(t.intro)}</p></div><a class="intro-link" href="${P.uscite(l)}">${esc(t.tutto)} ↗</a></div>
<div class="uscite-griglia">${contoGrande(l, top, lista)}<ol class="uscite-lista uscite-compatte" data-uscite-max="5">${pros.filter((u) => u !== top).slice(0, 8).map((u) => voceUscita(l, u, lista, false)).join("")}</ol></div></section>
<script src="/uscite.js" defer></script>`;
}

function paginaUscite(l, lista) {
  const t = R[l].uscite;
  const pros = prossimeUscite();
  const top = pros.find((u) => u.evidenza && u.data) || pros.find((u) => u.data);
  const gruppi = [];
  for (const u of pros) {
    const chiave = u.data ? u.data.slice(0, 7) : `anno-${u.anno}`;
    let g = gruppi.find((x) => x.chiave === chiave);
    if (!g) gruppi.push((g = { chiave, titolo: u.data ? maiuscola(fmtData(l, { month: "long", year: "numeric" }).format(dataUTC(u.data))) : t.anno.replace("{y}", u.anno), voci: [] }));
    g.voci.push(u);
  }
  const corpo = `<section class="rubrica-pagina">
  <header class="rubrica-testa"><span class="eyebrow">${esc(config.nome)} / ${esc(t.conto)}</span><h1>${esc(t.nome)}</h1><p>${esc(t.intro)}</p></header>
  ${top ? contoGrande(l, top, lista) : ""}
  ${gruppi.map((g) => `<section class="uscite-mese" data-mese><h2>${esc(g.titolo)}</h2><ol class="uscite-lista">${g.voci.map((u) => voceUscita(l, u, lista, true)).join("")}</ol></section>`).join("\n  ")}
  <p class="rubrica-nota">${esc(t.nota)}</p>
</section>
<script src="/uscite.js" defer></script>`;
  return pagina({ l, titolo: t.nome, descrizione: t.descr, percorso: P.uscite(l), corpo, alternative: tuttePerLingua(P.uscite) });
}

const sondaggioCorrente = () => SONDAGGI.filter((s) => s.dal <= OGGI).at(-1) || SONDAGGI[0];
function datiSondaggi(l) {
  const p = R[l].poll;
  const dati = {
    lingua: LINGUE[l].intl, voti: p.voti,
    testi: { vota: p.vota, grazie: p.grazie, gia: p.gia, errore: p.errore, caricamento: p.caricamento, scegli: p.scegli },
    lista: SONDAGGI.map((s) => ({ id: s.id, dal: s.dal, domanda: s.testi[l][0], opzioni: s.testi[l][1] })),
  };
  return `<script type="application/json" data-sondaggi-dati>${JSON.stringify(dati).replace(/</g, "\\u003c")}</script>\n<script src="/sondaggio.js" defer></script>`;
}
function formSondaggio(l, s) {
  const [domanda, opzioni] = s.testi[l];
  return `<form class="sondaggio" data-sondaggio data-id="${s.id}"><fieldset><legend class="sondaggio-domanda">${esc(domanda)}</legend><div class="sondaggio-opzioni">${opzioni.map((o, i) => `<label class="sondaggio-opzione"><input type="radio" name="scelta" value="${i}" required><span>${esc(o)}</span></label>`).join("")}</div></fieldset><button class="tasto-start" type="submit">${esc(R[l].poll.vota)}</button><p class="sondaggio-stato" data-stato role="status" aria-live="polite"></p></form>`;
}
function bloccoSondaggio(l) {
  const p = R[l].poll;
  return `<section class="blocco-novita sondaggio-box" aria-labelledby="t-sondaggio"><div class="blocco-heading"><div><span class="eyebrow">07 / Poll</span><h2 id="t-sondaggio" class="titolo-sezione">${esc(p.nome)}</h2><p>${esc(p.intro)}</p></div><a class="intro-link" href="${P.sondaggio(l)}">${esc(p.passati)} ↗</a></div>${formSondaggio(l, sondaggioCorrente())}</section>
${datiSondaggi(l)}`;
}
function paginaSondaggio(l) {
  const p = R[l].poll;
  const corpo = `<section class="rubrica-pagina">
  <header class="rubrica-testa"><span class="eyebrow">${esc(config.nome)} / Poll</span><h1>${esc(p.nome)}</h1><p>${esc(p.intro)}</p></header>
  <div class="sondaggio-box">${formSondaggio(l, sondaggioCorrente())}</div>
  <section class="sondaggi-passati" data-sondaggi-passati hidden aria-labelledby="t-passati"><h2 id="t-passati">${esc(p.passati)}</h2><div class="sondaggi-passati-lista" data-passati-lista></div></section>
</section>
${datiSondaggi(l)}`;
  return pagina({ l, titolo: p.nome, descrizione: p.intro, percorso: P.sondaggio(l), corpo, alternative: tuttePerLingua(P.sondaggio) });
}

function boxNewsletter(l) {
  if (l !== PRINCIPALE) return "";
  const nl = config.newsletter || {};
  const n = NEWSLETTER;
  const esterno = Boolean(nl.azione);
  const attributi = esterno
    ? `action="/api/newsletter" method="post"`
    : `name="newsletter" method="POST" action="${P.newsletterGrazie}" data-netlify="true" netlify-honeypot="sito-web"`;
  const extra = Object.entries(nl.campiExtra || {})
    .map(([k, v]) => (k === "email_address_check"
      ? `<p hidden><label>Lascia vuoto questo campo: <input type="text" name="${esc(k)}" value="" tabindex="-1" autocomplete="off"></label></p>`
      : `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`)).join("");
  return `<section class="newsletter" aria-labelledby="t-newsletter">
  <div class="newsletter-testo"><span class="eyebrow">Newsletter</span><h2 id="t-newsletter">${esc(n.nome)}</h2><p>${esc(n.intro)}</p></div>
  <form class="newsletter-form" ${attributi}${esterno ? ` data-newsletter-esterna data-grazie="${P.newsletterGrazie}" data-errore="${esc(n.errore)}"` : ""}>
    ${esterno ? extra : `<input type="hidden" name="form-name" value="newsletter"><p hidden><label>Lascia vuoto questo campo: <input name="sito-web" tabindex="-1" autocomplete="off"></label></p>`}
    <div class="newsletter-riga"><label class="vh" for="nl-email">${esc(n.segnaposto)}</label><input id="nl-email" type="email" name="${esc(nl.campo || "email")}" required autocomplete="email" placeholder="${esc(n.segnaposto)}"><button class="tasto-start" type="submit">${esc(n.bottone)}</button></div>
    <label class="newsletter-consenso"><input type="checkbox" name="consenso" value="si" required><span>${n.consenso.replace("{privacy}", urlPaginaFissa(l, "privacy"))}</span></label>
  </form>
</section>${esterno ? `\n<script src="/newsletter.js" defer></script>` : ""}`;
}
function paginaGrazie() {
  const n = NEWSLETTER;
  return pagina({
    l: PRINCIPALE, titolo: n.grazieTitolo, percorso: P.newsletterGrazie, robots: "noindex, follow", alternative: {},
    corpo: `<section class="schermata-titolo"><p class="schermata-sopra">Newsletter</p><h1 class="schermata-logo"><span>Soffia</span><span>Cartuccia</span></h1><p class="schermata-sotto"><strong>${esc(n.grazieTitolo)}</strong> ${esc(n.grazieTesto)}</p><p><a class="tasto-start" href="${P.home(PRINCIPALE)}">${esc(n.torna)}</a></p></section>`,
  });
}

function paginaConfermata() {
  const n = NEWSLETTER;
  const l = PRINCIPALE;
  return pagina({
    l, titolo: n.confermataTitolo, percorso: P.newsletterConfermata, robots: "noindex, follow", alternative: {},
    corpo: `<section class="schermata-titolo"><p class="schermata-sopra">Newsletter</p><h1 class="schermata-logo"><span>Soffia</span><span>Cartuccia</span></h1><p class="schermata-sotto"><strong>${esc(n.confermataTitolo)}</strong> ${esc(n.confermataTesto)}</p><p class="confermata-azioni"><a class="tasto-start" href="${P.uscite(l)}">${esc(R[l].uscite.nome)}</a> <a class="tasto-start" href="${P.sondaggio(l)}">${esc(R[l].poll.nome)}</a> <a class="tasto-start" href="${P.home(l)}">${esc(n.torna)}</a></p></section>`,
  });
}
// Pagina per il link in bio di Instagram (solo italiano): le ultime notizie in grande, una per riquadro.
// I link portano l'etichetta utm, così le statistiche separano chi arriva da Instagram.
const PERCORSO_INSTAGRAM = "/instagram/";
function paginaInstagram(lista) {
  const l = PRINCIPALE;
  const utm = (u) => `${u}?utm_source=instagram&utm_medium=social&utm_campaign=link-in-bio`;
  const notizie = lista.filter((a) => !a.bozza).slice(0, 12);
  const [prima, ...altre] = notizie;
  const copertina = (a, grande) => `<span class="bio-copertina${grande ? " bio-copertina-grande" : ""}" data-colore="${colore(a.categoria)}"><span class="copertina-nome" aria-hidden="true">${esc(nomeCat(l, a.categoria))}</span>${a.immagine ? img({ src: a.immagine, riserva: a.immagineRiserva, alt: "", lazy: !grande, priorita: grande }) : ""}</span>`;
  const voce = (a) => `<li><a class="bio-voce" href="${utm(a.url)}" data-colore="${colore(a.categoria)}">${copertina(a, false)}<span class="bio-voce-testo"><span class="meta">${etichettaCatSemplice(l, a.categoria)}<time datetime="${a.data.toISOString()}">${data(l, a.data, "breve")}</time></span><span class="bio-voce-titolo">${esc(a.titolo)}</span></span></a></li>`;
  const scorciatoie = [
    [P.quiz(l), `✦ ${QUIZ[l].nome}`],
    [P.sondaggio(l), R[l].poll.nome],
    [P.uscite(l), R[l].uscite.nome],
    ["#newsletter", "Newsletter"],
  ].map(([u, t]) => `<a class="bio-scorciatoia" href="${u.startsWith("#") ? u : utm(u)}">${esc(t)}</a>`).join("");
  const corpo = `
<section class="bio" aria-labelledby="t-bio">
  <header class="bio-testa">
    <span class="eyebrow">Dal nostro Instagram</span>
    <h1 id="t-bio">Le notizie dei post</h1>
    <p>Tocca la notizia che hai visto su Instagram e leggila per intero.</p>
  </header>
  ${prima ? `<a class="bio-apertura" href="${utm(prima.url)}" data-colore="${colore(prima.categoria)}">${copertina(prima, true)}<span class="bio-apertura-testo"><span class="meta">${etichettaCatSemplice(l, prima.categoria)}<time datetime="${prima.data.toISOString()}">${data(l, prima.data, "breve")}</time></span><span class="bio-apertura-titolo">${esc(prima.titolo)}</span><span class="tasto-start">${esc(T[l].leggi || "Leggi l'articolo")}</span></span></a>` : ""}
  <ol class="bio-lista">${altre.map(voce).join("")}</ol>
  <nav class="bio-scorciatoie" aria-label="Altro da Soffia Cartuccia">${scorciatoie}</nav>
  <div id="newsletter">${boxNewsletter(l)}</div>
  <p class="bio-tutte"><a class="intro-link" href="${utm(P.archivio(l))}">Tutte le notizie ↗</a></p>
</section>`;
  return pagina({ l, titolo: "Le notizie dei post Instagram", descrizione: "Le ultime notizie di Soffia Cartuccia, dal link in bio di Instagram.", percorso: PERCORSO_INSTAGRAM, corpo, robots: "noindex, follow", alternative: {} });
}

function paginaElenco({ l, titolo, descrizione, percorso, lista, categoria, alternative }) {
  const corpo = `
<header class="intestazione-elenco"${categoria ? ` data-colore="${colore(categoria)}"` : ""}>
  <h1>${esc(titolo)}</h1>
  ${descrizione ? `<p>${esc(descrizione)}</p>` : ""}
</header>
${lista.length
    ? `<div class="griglia">${lista.map((a) => scheda(a)).join("")}</div>`
    : `<p class="vuoto-elenco">${esc(T[l].vuotoSezione)}</p>`}`;
  return pagina({ l, titolo, descrizione, percorso, corpo, alternative });
}

// Segnaposto utilizzabili nelle pagine fisse
function sostituisci(testo, l, stessaLingua) {
  const conteggio = (k) => stessaLingua.filter((a) => a.categoria === k && !a.bozza).length;
  const tessere = `<div class="tessere-cat">${Object.keys(config.categorie).map((k) => `<a class="tessera" data-colore="${colore(k)}" href="${P.categoria(l, k)}"><span class="tessera-nome">${pallino(k)}${esc(nomeCat(l, k))}</span><span class="tessera-testo">${esc(T[l].categorie[k]?.descrizione || config.categorie[k].descrizione)}</span><span class="tessera-conto">${esc(T[l].nArticoli(conteggio(k)))}</span></a>`).join("")}</div>`;
  return testo
    .replaceAll("{{NOME_SITO}}", config.nome)
    .replaceAll("{{TITOLARE}}", config.titolare || "[titolare da completare in sito.config.mjs]")
    .replaceAll("{{EMAIL}}", config.emailContatto || "[email da completare in sito.config.mjs]")
    .replaceAll("{{AGGIORNATA}}", data(l, new Date(config.privacyAggiornata || Date.now()), "lunga"))
    .replaceAll("{{NL_FORNITORE}}", config.newsletter?.fornitore || "Netlify, Inc. (servizio Netlify Forms)")
    .replaceAll("{{NUMERO_ARTICOLI}}", String(stessaLingua.filter((a) => !a.bozza).length))
    .replaceAll("{{CATEGORIE}}", `\n\n${tessere}\n\n`)
    .replace(/\{\{LINK:([a-z-]+)\}\}/g, (_, id) => urlPaginaFissa(l, id));
}

function paginaFissa(p, stessaLingua) {
  const versioni = PAGINE_FISSE.filter((x) => x.id === p.id);
  const alternative = Object.fromEntries(versioni.map((v) => [v.lingua, v.url]));
  const corpo = `
<article class="articolo pagina-fissa">
  <header class="eroe-articolo eroe-pagina">
    ${p.sopratitolo ? `<p class="sopratitolo">${esc(sostituisci(p.sopratitolo, p.lingua, stessaLingua))}</p>` : ""}
    <h1>${esc(p.titolo)}</h1>
    ${p.occhiello ? `<p class="occhiello">${esc(sostituisci(p.occhiello, p.lingua, stessaLingua))}</p>` : ""}
  </header>
  <div class="testo">${marked.parse(sostituisci(p.corpo, p.lingua, stessaLingua))}</div>
</article>`;
  return pagina({ l: p.lingua, titolo: p.titolo, descrizione: p.descrizione, percorso: p.url, corpo, alternative });
}

function rss(l, articoli) {
  const voci = articoli.filter((a) => !a.bozza).slice(0, 30).map((a) => `
  <item>
    <title>${esc(a.titolo)}</title>
    <link>${urlAssoluto(a.url)}</link>
    <guid>${urlAssoluto(a.url)}</guid>
    <pubDate>${a.data.toUTCString()}</pubDate>
    <category>${esc(nomeCat(l, a.categoria))}</category>
    <description>${esc(a.sommario)}</description>${a.immagine ? `\n    <media:content url="${esc(urlImmagine(a.immagine))}" medium="image"/>` : ""}
  </item>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/"><channel>
  <title>${esc(config.nome)}</title>
  <link>${urlAssoluto(P.home(l))}</link>
  <description>${esc(T[l].motto)}</description>
  <language>${LINGUE[l].intl.toLowerCase()}</language>${voci}
</channel></rss>`;
}

// Sitemap con le versioni nelle altre lingue (hreflang) per ogni pagina
function sitemap(gruppi) {
  const righe = gruppi.flatMap(({ versioni, lastmod, immagine }) =>
    versioni.map((v) => `<url><loc>${urlAssoluto(v.url)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}${
      versioni.length > 1 ? versioni.map((x) => `<xhtml:link rel="alternate" hreflang="${LINGUE[x.lingua].hreflang}" href="${urlAssoluto(x.url)}"/>`).join("") : ""}${
      immagine ? `<image:image><image:loc>${esc(urlImmagine(immagine))}</image:loc></image:image>` : ""}</url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${righe.join("")}</urlset>`;
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
  const anybody = copia("@fontsource-variable/anybody", (f) => /-latin-(full|standard|wdth|wght)-(normal|italic)\.woff2$/.test(f));
  for (const stile of ["normal", "italic"]) {
    const f = ["full", "standard", "wdth", "wght"].map((a) => `anybody-latin-${a}-${stile}.woff2`).find((n) => anybody.includes(n));
    if (f) {
      regole.push(`@font-face{font-family:"Anybody";font-style:${stile};font-display:swap;font-weight:100 900;font-stretch:50% 150%;src:url(/font/${f}) format("woff2-variations"),url(/font/${f}) format("woff2");}`);
      if (stile === "italic") precarica.push(f);
    }
  }
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
const originali = leggiOriginali();
const traduzioni = leggiTraduzioni(originali);
const visibile = (a) => CON_BOZZE || !a.bozza;
const tutti = [...originali, ...traduzioni].filter(visibile);
const perLingua = tuttePerLingua((l) => ordina(tutti.filter((a) => a.lingua === l)));
const versioniDi = (id) => CODICI.map((l) => perLingua[l].find((a) => a.id === id)).filter(Boolean);
PAGINE_FISSE = leggiPagine();

fs.rmSync(DIST, { recursive: true, force: true });
copiaCartella(PUBBLICO, DIST);
fs.copyFileSync(path.join(ROOT, "src", "stile.css"), path.join(DIST, "stile.css"));
fs.copyFileSync(path.join(ROOT, "src", "novita.css"), path.join(DIST, "novita.css"));
fs.copyFileSync(path.join(ROOT, "src", "quiz.css"), path.join(DIST, "quiz.css"));
fs.copyFileSync(path.join(ROOT, "src", "rubriche.css"), path.join(DIST, "rubriche.css"));
const FONT = preparaFont();
fs.writeFileSync(path.join(DIST, "font.css"), FONT.css);
var FONT_PRECARICA = FONT.precarica.map((f) => `<link rel="preload" href="/font/${f}" as="font" type="font/woff2" crossorigin>\n`).join("");

const gruppiSitemap = [];
const pubblicati = (lista) => lista.filter((a) => !a.bozza);
const redirect404 = [];

for (const l of CODICI) {
  const t = T[l];
  const lista = perLingua[l];
  scriviPagina(P.home(l), home(l, lista));
  scriviPagina(P.quiz(l), paginaQuiz(l));
  scriviPagina(P.uscite(l), paginaUscite(l, lista));
  scriviPagina(P.sondaggio(l), paginaSondaggio(l));
  scrivi(`indice-${l}.json`, JSON.stringify(pubblicati(lista).map((a)=>({id:a.id,url:a.url,titolo:a.titolo,sommario:a.sommario,categoria:nomeCat(l,a.categoria),tag:a.tag,data:a.data.toISOString(),dataBreve:data(l,a.data,"breve")}))));
  for (const a of lista) scriviPagina(a.url, paginaArticolo(a, lista, versioniDi(a.id)));
  for (const k of Object.keys(config.categorie)) {
    scriviPagina(P.categoria(l, k), paginaElenco({
      l, titolo: nomeCat(l, k), descrizione: t.categorie[k]?.descrizione || config.categorie[k].descrizione,
      percorso: P.categoria(l, k), categoria: k, lista: lista.filter((a) => a.categoria === k),
      alternative: tuttePerLingua((x) => P.categoria(x, k)),
    }));
  }
  scriviPagina(P.archivio(l), paginaElenco({ l, titolo: t.archivio, descrizione: t.archivioDesc, percorso: P.archivio(l), lista, alternative: tuttePerLingua(P.archivio) }));
  for (const p of pagineDi(l)) scriviPagina(p.url, paginaFissa(p, lista));
  const percorso404 = l === PRINCIPALE ? "/404.html" : `${pre(l)}/404.html`;
  scrivi(percorso404.slice(1), pagina({
    l, titolo: t.nonTrovato, percorso: percorso404, alternative: {}, errore: true,
    corpo: `<section class="schermata-titolo"><p class="schermata-sopra">${esc(t.errore)}</p><h1 class="schermata-logo"><span>Game</span><span>Over</span></h1><p class="schermata-sotto">${esc(t.nonTrovatoTesto)}</p><p><a class="tasto-start" href="${P.home(l)}">${esc(t.tornaHome)}</a></p></section>`,
  }));
  if (l !== PRINCIPALE) redirect404.push(`${pre(l)}/*  ${pre(l)}/404.html  404`);
  scrivi(P.rss(l).slice(1), rss(l, lista));
}

// Gruppi per la sitemap (solo contenuti pubblici)
gruppiSitemap.push({ versioni: CODICI.map((l) => ({ lingua: l, url: P.home(l) })) });
gruppiSitemap.push({ versioni: CODICI.map((l) => ({ lingua: l, url: P.quiz(l) })) });
gruppiSitemap.push({ versioni: CODICI.map((l) => ({ lingua: l, url: P.uscite(l) })) });
gruppiSitemap.push({ versioni: CODICI.map((l) => ({ lingua: l, url: P.sondaggio(l) })) });
scriviPagina(P.newsletterGrazie, paginaGrazie());
scriviPagina(PERCORSO_INSTAGRAM, paginaInstagram(perLingua[PRINCIPALE]));
scriviPagina(P.newsletterConfermata, paginaConfermata());
gruppiSitemap.push({ versioni: CODICI.map((l) => ({ lingua: l, url: P.archivio(l) })) });
for (const k of Object.keys(config.categorie)) gruppiSitemap.push({ versioni: CODICI.map((l) => ({ lingua: l, url: P.categoria(l, k) })) });
for (const id of new Set(PAGINE_FISSE.map((p) => p.id))) gruppiSitemap.push({ versioni: PAGINE_FISSE.filter((p) => p.id === id) });
for (const a of pubblicati(perLingua[PRINCIPALE])) {
  gruppiSitemap.push({ versioni: versioniDi(a.id).filter((v) => !v.bozza), lastmod: (a.aggiornato || a.data).toISOString().slice(0, 10), immagine: a.immagine });
}
scrivi("sitemap.xml", sitemap(gruppiSitemap));
scrivi("_redirects", redirect404.join("\n") + "\n");

// Elenco degli articoli pubblicati per la funzione dei "Mi piace" (accetta voti solo per questi)
fs.mkdirSync(path.join(ROOT, "netlify", "dati"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "netlify", "dati", "articoli.mjs"),
  `// File generato da build.mjs: non modificarlo a mano.\nexport default ${JSON.stringify(originali.filter((a) => !a.bozza).map((a) => a.id))};\n`
);
// Articoli pubblicati per l'invio automatico della newsletter della domenica (netlify/functions/newsletter-domenica.mjs)
fs.writeFileSync(
  path.join(ROOT, "netlify", "dati", "newsletter.mjs"),
  `// File generato da build.mjs: non modificarlo a mano.\nexport default ${JSON.stringify(originali.filter((a) => !a.bozza).map((a) => ({ titolo: a.titolo, titolo_seo: a.titoloSeo, sommario: a.sommario, slug: a.slug, giorno: a.data.toISOString().slice(0, 10), viralita: a.viralita, bozza: false })))};\n`
);
scrivi("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${urlAssoluto("/sitemap.xml")}\n`);

const ultimoSondaggio = SONDAGGI.at(-1).dal;
if (ultimoSondaggio <= new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)) console.warn(`Avviso: l'ultimo sondaggio parte il ${ultimoSondaggio}: aggiungine di nuovi in rubriche.mjs.`);
if (!config.titolare || !config.emailContatto) console.warn("Avviso: completa titolare ed emailContatto in sito.config.mjs per la pagina privacy.");
const nBozze = perLingua[PRINCIPALE].filter((a) => a.bozza).length;
const riepilogoLingue = CODICI.filter((l) => l !== PRINCIPALE).map((l) => `${l} ${pubblicati(perLingua[l]).length}`).join(", ");
console.log(`Fatto: ${perLingua[PRINCIPALE].length - nBozze} articoli pubblicati${CON_BOZZE ? ` + ${nBozze} bozze in anteprima` : ""}; traduzioni: ${riepilogoLingue} → dist/`);
