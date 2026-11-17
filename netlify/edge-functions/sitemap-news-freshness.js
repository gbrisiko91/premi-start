// Rimuove in tempo reale dalla sitemap Google News le notizie scadute.
// La sitemap statica e pubblicata da build.mjs: questa Edge Function filtra
// soltanto gli URL gia presenti; non modifica gli articoli o altre sitemap.

const NS_NEWS = 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"';

export function giornoRoma(istante = new Date()) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(istante);
  const v = Object.fromEntries(p.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
  return `${v.year}-${v.month}-${v.day}`;
}

function ieri(oggi) {
  const d = new Date(`${oggi}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== oggi)
    throw new Error("Data News non valida");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Limite conservativo (oggi e ieri in Europe/Rome), coerente con la build.
 * Ritorna una sitemap vuota quando tutte le notizie sono scadute.
 * Non introduce URL e non sostituisce la sitemap XML generale.
 */
export function filtraSitemapNews(xml, oggi) {
  const sorgente = String(xml);
  if (!sorgente.includes(NS_NEWS) || !sorgente.includes("</urlset>"))
    return sorgente;
  const valide = new Set([oggi, ieri(oggi)]);
  return sorgente.replace(/<url>[\s\S]*?<\/url>/g, blocco => {
    const m = blocco.match(/<news:publication_date>\s*(\d{4}-\d{2}-\d{2})(?:T[^<]*)?\s*<\/news:publication_date>/);
    return m && valide.has(m[1]) ? blocco : "";
  });
}

// Il parametro istante serve soltanto ai test: la funzione Netlify usa sempre ora reale.
export async function rispostaSitemapNews(request, context, istante = new Date()) {
  if (request.method !== "GET") return context.next();
  const original = await context.next();
  if (!original.ok) return original;
  const xml = await original.text();
  const filtrato = filtraSitemapNews(xml, giornoRoma(istante));
  const headers = new Headers(original.headers);
  for (const nome of ["content-length", "content-encoding", "etag", "last-modified"])
    headers.delete(nome);
  headers.set("content-type", "application/xml; charset=utf-8");
  // Vietato servire una copia datata dopo il cambio di giorno a Roma.
  headers.set("cache-control", "no-store");
  headers.set("netlify-cdn-cache-control", "no-store");
  return new Response(filtrato, {
    status: original.status, statusText: original.statusText, headers,
  });
}

export default async function onRequest(request, context) {
  return rispostaSitemapNews(request, context);
}

// La dichiarazione inline evita cambiamenti a netlify.toml.
export const config = { path: "/sitemap-news.xml" };
