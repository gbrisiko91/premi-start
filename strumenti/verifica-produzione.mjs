// Controlla il deploy pubblico (non la sola build GitHub) senza scrivere su Netlify.
// Node 22, nessuna dipendenza e nessuna credenziale. Usato dal workflow su push main.
import { pathToFileURL } from "node:url";
import { giornoRoma } from "../netlify/edge-functions/sitemap-news-freshness.js";

export const BASE_PRODUZIONE = "https://soffiacartuccia.it";
const SHA_RE = /^[0-9a-f]{40}$/i;
const ARTICOLO_RE = /^\/articoli\/[a-z0-9-]+\/$/;

export function verificaManifest(dati, sha) {
  if (!SHA_RE.test(sha || "")) return ["SHA del commit atteso non valido"];
  if (!dati || typeof dati !== "object") return ["Manifest del deploy assente o non valido"];
  const errori = [];
  if (dati.revisione !== sha.toLowerCase())
    errori.push(`Versione pubblica ${dati.revisione || "sconosciuta"} diversa dal commit ${sha}`);
  if (!Array.isArray(dati.ultimiArticoli) || !dati.ultimiArticoli.length
    || dati.ultimiArticoli.length > 3 || dati.ultimiArticoli.some((p) => !ARTICOLO_RE.test(p)))
    errori.push("Elenco degli ultimi articoli assente o non valido");
  if (typeof dati.specialeGta6 !== "boolean")
    errori.push("Stato dello Speciale GTA 6 assente dal manifest");
  return errori;
}

export function verificaPagina(html, { path, indexabile = true, frammenti = [] }) {
  const errori = [];
  if (typeof html !== "string" || !/<html(?:\s|>)/i.test(html)) return [`HTML non valido: ${path}`];
  if (indexabile) {
    const canonico = `<link rel="canonical" href="${BASE_PRODUZIONE}${path}">`;
    if (!html.includes(canonico)) errori.push(`Canonical mancante o errato: ${path}`);
    if (!/<meta name="robots" content="index, follow[^"]*">/.test(html))
      errori.push(`Indicizzabilità assente: ${path}`);
  } else if (!/<meta name="robots" content="noindex, follow">/.test(html)) {
    errori.push(`Noindex previsto e assente: ${path}`);
  }
  for (const testo of frammenti) {
    if (!html.includes(testo)) errori.push(`Contenuto atteso mancante in ${path}: ${testo}`);
  }
  return errori;
}

// I meta robots nell'HTML non bastano: un X-Robots-Tag HTTP può comunque
// disabilitare l'indicizzazione, anche quando canonical e sitemap sono corretti.
export function verificaHeaderIndicizzazione(header, path) {
  if (!header) return [];
  // noindex e none (equivalente a noindex + nofollow), inclusi i prefissi per crawler.
  if (/(?:^|[\s,;:])(?:noindex|none)(?=$|[\s,;])/i.test(header))
    return [`Header X-Robots-Tag blocca l'indicizzazione su ${path}: ${header}`];
  return [];
}

export function verificaSitemap(sitemap, pathObbligatori) {
  const errori = [];
  for (const p of pathObbligatori) {
    if (!sitemap.includes(`<loc>${BASE_PRODUZIONE}${p}</loc>`))
      errori.push(`Pagina non presente in sitemap: ${p}`);
  }
  return errori;
}


// La sitemap Google News deve avere solo oggi e ieri (fuso Europe/Rome):
// la build crea l'XML e l'Edge Function scarta le voci obsolete senza nuovi deploy.
// Validiamo la risposta HTTP effettiva, non solamente la sitemap costruita in CI.
export function verificaSitemapNewsPubblicata(xml, headers, istante = new Date()) {
  const errori = [];
  if (typeof xml !== "string" || !/^\s*<\?xml\b/.test(xml) ||
      !/<urlset\b[^>]*xmlns:news="http:\/\/www\.google\.com\/schemas\/sitemap-news\/0\.9"[^>]*>/.test(xml) ||
      !/<\/urlset>\s*$/.test(xml)) {
    return ["Sitemap Google News: documento XML o namespace non valido"];
  }

  const contentType = headers?.get?.("content-type") || "";
  const cacheControl = headers?.get?.("cache-control") || "";
  if (!/^application\/xml(?:\s*;|$)/i.test(contentType))
    errori.push("Google News: Content-Type HTTP non XML (" + contentType + ")");
  if (!/(?:^|[,\s])no-store(?:$|[,\s])/i.test(cacheControl))
    errori.push("Google News: Cache-Control HTTP senza no-store (" + cacheControl + ")");

  const oggi = giornoRoma(istante);
  const precedente = new Date(oggi + "T00:00:00Z");
  precedente.setUTCDate(precedente.getUTCDate() - 1);
  const consentiti = new Set([oggi, precedente.toISOString().slice(0, 10)]);

  const blocchi = [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map(x => x[0]);
  const aperture = (xml.match(/<url(?:\s|>)/g) || []).length;
  if (blocchi.length !== aperture || blocchi.length > 1000)
    errori.push("Google News: blocchi URL incompleti o più di 1000");
  const giaViste = new Set();
  for (const blocco of blocchi) {
    const loc = blocco.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc || !loc.startsWith(BASE_PRODUZIONE + "/"))
      errori.push("Google News: loc assente o fuori dal dominio");
    else if (giaViste.has(loc))
      errori.push("Google News: URL duplicato " + loc);
    else giaViste.add(loc);
    const dati = [...blocco.matchAll(/<news:publication_date>([^<]+)<\/news:publication_date>/g)];
    const date = dati[0]?.[1]?.trim() || "";
    const valida = /^(\d{4}-\d{2}-\d{2})(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?$/.exec(date);
    if (dati.length !== 1 || !valida)
      errori.push("Google News: publication_date assente o non valida per " + (loc || "?"));
    else if (!consentiti.has(valida[1]))
      errori.push("Google News: articolo scaduto o futuro " + valida[1] + " in " + (loc || "?"));
    if ((blocco.match(/<news:news>/g) || []).length !== 1 ||
        !/<news:name>[^<]+<\/news:name>/.test(blocco) ||
        !/<news:language>[^<]+<\/news:language>/.test(blocco) ||
        !/<news:title>[^<]+<\/news:title>/.test(blocco))
      errori.push("Google News: metadati news incompleti per " + (loc || "?"));
  }
  return errori;
}

const dormi = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const indirizzo = (path, nonce) => new URL(path + (path.includes("?") ? "&" : "?") + "_sc_verifica=" + nonce, BASE_PRODUZIONE);

async function leggi(path, sha, { indexabile = false } = {}) {
  const res = await fetch(indirizzo(path, sha.slice(0, 12)), {
    headers: { "cache-control": "no-cache", accept: "*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} su ${path}`);
  if (new URL(res.url).origin !== BASE_PRODUZIONE) throw new Error(`Redirect esterno su ${path}`);
  if (indexabile) {
    const problemi = verificaHeaderIndicizzazione(res.headers.get("x-robots-tag"), path);
    if (problemi.length) throw new Error(problemi.join("; "));
  }
  return res.text();
}


async function leggiNews(sha) {
  const path = "/sitemap-news.xml";
  const res = await fetch(indirizzo(path, sha.slice(0, 12)), {
    headers: { "cache-control": "no-cache", accept: "application/xml" },
    redirect: "follow",
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("HTTP " + res.status + " sulla sitemap Google News");
  if (new URL(res.url).origin !== BASE_PRODUZIONE)
    throw new Error("Redirect esterno sulla sitemap Google News");
  return { body: await res.text(), headers: res.headers };
}

export async function verificaDeploy(sha, { tentativi = 24, pausaMs = 15000, log = console.log } = {}) {
  if (!SHA_RE.test(sha || "")) throw new Error("EXPECTED_SHA deve contenere i 40 caratteri del commit");
  const revision = sha.toLowerCase();
  let ultimoErrore = "Nessuna risposta";
  for (let i = 1; i <= tentativi; i++) {
    try {
      const manifest = JSON.parse(await leggi("/stato-deploy.json", revision));
      const mErrori = verificaManifest(manifest, revision);
      if (mErrori.length) throw new Error(mErrori.join("; "));
      const pagine = [
        {path:"/",indexabile:true,frammenti:["<main id=\"contenuto\">"]},
        {path:"/instagram/",indexabile:false,frammenti:["bio-premio"]},
        {path:"/sfondi/",indexabile:true,frammenti:["soffiacartuccia-sfondo-01-cartuccia.png"]},
        ...manifest.ultimiArticoli.map((path) => ({path,indexabile:true,frammenti:[]})),
      ];
      if (manifest.specialeGta6) {
        pagine.push({path:"/speciale-gta-6/",indexabile:true,frammenti:['id="gta6-speciale-titolo"']});
      }
      const richieste = await Promise.all([
        ...pagine.map(async (p) => ({tipo:"pagina", p, body:await leggi(p.path, revision, { indexabile:p.indexabile })})),
        leggi("/sitemap.xml", revision).then((body) => ({tipo:"sitemap",body})),
        leggi("/robots.txt", revision).then((body) => ({tipo:"robots",body})),
        leggiNews(revision).then(({body,headers}) => ({tipo:"news",body,headers})),
      ]);
      const errori = [];
      for (const r of richieste) {
        if (r.tipo === "pagina") errori.push(...verificaPagina(r.body,r.p));
        if (r.tipo === "news") errori.push(...verificaSitemapNewsPubblicata(r.body, r.headers));
        if (r.tipo === "sitemap") errori.push(...verificaSitemap(r.body,
          ["/", ...manifest.ultimiArticoli, ...(manifest.specialeGta6 ? ["/speciale-gta-6/"] : [])]));
        if (r.tipo === "robots" && !r.body.includes("Sitemap: " + BASE_PRODUZIONE + "/sitemap.xml"))
          errori.push("Sitemap non dichiarata in robots.txt");
      }
      if (errori.length) throw new Error(errori.join("; "));
      log(`✅ Deploy ${revision.slice(0,12)} verificato in produzione: ${pagine.length} pagine, sitemap, sitemap News e robots.txt`);
      return { revisione:revision,pagine:pagine.map((p)=>p.path) };
    } catch (e) {
      ultimoErrore = e?.message || String(e);
      log(`Controllo produzione ${i}/${tentativi}: ${ultimoErrore}`);
      if (i < tentativi && pausaMs > 0) await dormi(pausaMs);
    }
  }
  throw new Error(`Deploy ${revision.slice(0,12)} non confermato: ${ultimoErrore}`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  verificaDeploy(process.env.EXPECTED_SHA)
    .catch((err) => { console.error("❌ " + err.message); process.exitCode = 1; });
}
