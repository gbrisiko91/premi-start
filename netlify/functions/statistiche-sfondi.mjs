/* Statistiche dei pulsanti Scarica, senza cookie e senza salvare dati personali.
 * Il link del PNG continua a funzionare indipendentemente da questa funzione.
 * Una chiave Blob per ogni clic impedisce di perdere incrementi concorrenti.
 */
import { getStore, getDeployStore } from "@netlify/blobs";
import { SFONDI, sfondoValido, giornoRoma, nuovaChiave, riassumiClic } from "../sfondi-conteggi.mjs";

const json = (data, code = 200) => new Response(JSON.stringify(data), {
  status: code,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex, nofollow",
    "x-content-type-options": "nosniff",
  },
});
const escapeHtml = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function pagina(dati) {
  const righe = Object.entries(SFONDI).map(([id, nome]) =>
    "<tr><th scope='row'>" + escapeHtml(nome) + "</th><td>" + dati.perSfondo[id] + "</td></tr>"
  ).join("");
  const giorni = Object.entries(dati.perGiorno).sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 14).map(([data, n]) => "<tr><th scope='row'>" + data + "</th><td>" + n + "</td></tr>").join("");
  return "<!doctype html><html lang='it'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" +
    "<meta name='robots' content='noindex,nofollow'><title>Statistiche sfondi | Soffia Cartuccia</title>" +
    "<style>body{font:18px system-ui,sans-serif;color:#f3f1ff;background:#15122b;margin:0;padding:2rem 1rem}" +
    "main{max-width:720px;margin:auto}h1{line-height:1.2}a{color:#ffc21a}section{background:#211c40;padding:1rem 1.5rem;border-radius:16px;margin:1.2rem 0}" +
    "strong{font-size:2rem}table{width:100%;border-collapse:collapse}td{text-align:right;font-variant-numeric:tabular-nums}" +
    "td,th{padding:.6rem 0;border-bottom:1px solid #4b456c}th{text-align:left}small{color:#c6bfdf}</style></head><body>" +
    "<main><p><a href='/sfondi/'>← Torna agli sfondi</a></p><h1>🎮 Statistic​he dei wallpaper</h1>" +
    "<p>Missione 5K · conteggio dei clic sui pulsanti Scarica</p>" +
    "<section><p>Clic complessivi registrati</p><strong>" + dati.totale + "</strong><p>Oggi (fuso di Roma): " + dati.oggi + "</p></section>" +
    "<section><h2>Per wallpaper</h2><table><tbody>" + righe + "</tbody></table></section>" +
    "<section><h2>Ultimi giorni con clic</h2><table><tbody>" + (giorni || "<tr><td>Nessun clic registrato</td></tr>") + "</tbody></table></section>" +
    "<p><small>I conteggi iniziano dall'attivazione di questa funzione. Non misurano download completati o persone uniche." +
    " Clic ripetuti e richieste automatizzate possono influire sul totale; gli accessi diretti ai PNG non sono conteggiati." +
    " Nessun cookie, IP o identificatore del visitatore viene memorizzato nel conteggio.</small></p></main></body></html>";
}

export default async function sfondiStatistiche(req) {
  if (!["GET", "POST"].includes(req.method)) return json({errore:"Metodo non consentito"}, 405);
  const url = new URL(req.url);
  if (req.method === "POST") {
    const origin = req.headers.get("origin");
    const site = req.headers.get("sec-fetch-site");
    // Limitazione anti-abuso best effort: una richiesta cross-site non deve incrementare il contatore.
    if (origin !== url.origin || (site && site !== "same-origin")) return json({errore:"Origine non consentita"},403);
    const len = Number(req.headers.get("content-length") || 0);
    if (len > 80) return json({errore:"Richiesta troppo grande"},413);
    const id = (await req.text()).trim();
    if (id.length > 40 || !sfondoValido(id)) return json({errore:"Sfondo non valido"},400);
    try {
      const store = process.env.CONTEXT === "production"
        ? getStore({name:"sfondi-click", consistency:"strong"})
        : getDeployStore({name:"sfondi-click", consistency:"strong"});
      await store.set(nuovaChiave(id), "1");
      return new Response(null,{status:204,headers:{"cache-control":"no-store"}});
    } catch (err) {
      console.error("Contatore sfondi non disponibile", err?.message);
      return json({errore:"Contatore temporaneamente non disponibile"},503);
    }
  }
  try {
    const store = process.env.CONTEXT === "production"
      ? getStore({name:"sfondi-click", consistency:"strong"})
      : getDeployStore({name:"sfondi-click", consistency:"strong"});
    const {blobs} = await store.list({prefix:"v1/"});
    const dati = riassumiClic(blobs, giornoRoma());
    if (url.searchParams.get("format") === "json") return json(dati);
    return new Response(pagina(dati), {status:200,headers:{
      "content-type":"text/html; charset=utf-8",
      "cache-control":"no-store",
      "x-robots-tag":"noindex, nofollow",
      "x-content-type-options":"nosniff",
      "content-security-policy":"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
    }});
  } catch (err) {
    console.error("Statistiche sfondi non disponibili", err?.message);
    return json({errore:"Statistiche temporaneamente non disponibili"},503);
  }
}

export const config = {path:"/api/statistiche-sfondi"};
