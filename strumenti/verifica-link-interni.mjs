// Verifica i collegamenti generati dalle pagine HTML e le URL della sitemap.
// Solo file locali, senza chiamate esterne o nuove dipendenze.
// Esegue una scansione di TUTTE le lingue dopo la build, non un campione.
import fs from "node:fs";
import path from "node:path";

export const ORIGINE = "https://soffiacartuccia.it";

export function destinazioneInterna(href, pagina = "/", origine = ORIGINE) {
  if (typeof href !== "string" || !href.trim()) return null;
  const pulito = href.trim().replaceAll("&amp;", "&");
  if (/^(?:#|mailto:|tel:|sms:|data:|blob:)/i.test(pulito)) return null;
  if (/^(?:javascript|vbscript):/i.test(pulito)) return { errore: "Protocollo non consentito" };
  try {
    const url = new URL(pulito, new URL(pagina, origine));
    if (url.origin !== origine || url.pathname.startsWith("/api/")) return null;
    const percorso = decodeURIComponent(url.pathname);
    if (!percorso.startsWith("/") || percorso.includes("\0")) return { errore: "Percorso non valido" };
    return { percorso };
  } catch {
    return { errore: "URL non valido" };
  }
}

function listaHtml(root) {
  const risultato = [];
  const cammina = (dir) => {
    for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, voce.name);
      if (voce.isDirectory()) cammina(p);
      else if (voce.isFile() && voce.name.endsWith(".html")) risultato.push(p);
    }
  };
  cammina(root);
  return risultato;
}

export function esisteDestinazione(root, percorso) {
  const base = path.resolve(root);
  const destinazione = path.resolve(base, "." + percorso);
  // Anche la radice / è una destinazione valida: dist/index.html.
  if (destinazione !== base && !destinazione.startsWith(base + path.sep)) return false;
  const candidati = percorso.endsWith("/")
    ? [path.join(destinazione, "index.html")]
    : [destinazione, path.join(destinazione, "index.html")];
  return candidati.some((p) => fs.existsSync(p) && fs.statSync(p).isFile());
}

export function verificaLinkInterni(root) {
  const errori = [];
  let pagine = 0, link = 0, linkInterni = 0, urlSitemap = 0;
  const segnala = (da, href, motivo) => errori.push({ da, href, motivo });
  for (const file of listaHtml(root)) {
    pagine++;
    const relativo = path.relative(root, file).split(path.sep).join("/");
    const urlPagina = relativo.endsWith("/index.html")
      ? "/" + relativo.slice(0, -"index.html".length)
      : relativo === "index.html" ? "/" : "/" + relativo;
    const html = fs.readFileSync(file, "utf8");
    // Si verificano i veri link HTML <a href>, non gli hreflang o i link degli asset.
    for (const m of html.matchAll(/<a\b[^>]*?\shref\s*=\s*(["'])(.*?)\1/gi)) {
      link++;
      const dest = destinazioneInterna(m[2], urlPagina);
      if (!dest) continue;
      if (dest.errore) { segnala(urlPagina, m[2], dest.errore); continue; }
      linkInterni++;
      if (!esisteDestinazione(root, dest.percorso))
        segnala(urlPagina, m[2], "Pagina o file di destinazione assente da dist");
    }
  }
  for (const nome of ["sitemap.xml", "sitemap-news.xml"]) {
    const file = path.join(root, nome);
    if (!fs.existsSync(file)) { segnala(nome, "", "Sitemap mancante"); continue; }
    const xml = fs.readFileSync(file, "utf8");
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      urlSitemap++;
      const dest = destinazioneInterna(m[1], "/");
      if (!dest || dest.errore || !esisteDestinazione(root, dest.percorso))
        segnala("/" + nome, m[1], "URL in sitemap priva di pagina generata");
    }
  }
  return { pagine, link, linkInterni, urlSitemap, errori };
}
