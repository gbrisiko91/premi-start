// Controlla il deploy pubblico (non la sola build GitHub) senza scrivere su Netlify.
// Node 22, nessuna dipendenza e nessuna credenziale. Usato dal workflow su push main.
import { pathToFileURL } from "node:url";

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
      ]);
      const errori = [];
      for (const r of richieste) {
        if (r.tipo === "pagina") errori.push(...verificaPagina(r.body,r.p));
        if (r.tipo === "sitemap") errori.push(...verificaSitemap(r.body,
          ["/", ...manifest.ultimiArticoli, ...(manifest.specialeGta6 ? ["/speciale-gta-6/"] : [])]));
        if (r.tipo === "robots" && !r.body.includes("Sitemap: " + BASE_PRODUZIONE + "/sitemap.xml"))
          errori.push("Sitemap non dichiarata in robots.txt");
      }
      if (errori.length) throw new Error(errori.join("; "));
      log(`✅ Deploy ${revision.slice(0,12)} verificato in produzione: ${pagine.length} pagine, sitemap e robots.txt`);
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
