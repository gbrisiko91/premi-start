// Iscrizione alla newsletter: riceve il modulo del sito e lo inoltra al modulo Brevo dal server.
// Così il browser del visitatore non deve contattare sibforms.com (spesso bloccato dai filtri pubblicità).
//   POST /api/newsletter  (application/x-www-form-urlencoded: EMAIL, consenso, ...)
//   - con "Accept: application/json" (invio dal nostro script) risponde { ok: true } o { ok: false, errore }
//   - senza JavaScript risponde con un reindirizzamento alla pagina di ringraziamento
import sito from "../../sito.config.mjs";

const nl = sito.newsletter || {};
const GRAZIE = "/newsletter/grazie/";
const EMAIL_VALIDA = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async (req) => {
  if (req.method !== "POST") return new Response("Metodo non consentito", { status: 405 });
  const vuoleJson = (req.headers.get("accept") || "").includes("application/json");
  const rispondi = (ok, errore = "", stato = ok ? 200 : 400) =>
    vuoleJson
      ? new Response(JSON.stringify({ ok, errore }), { status: stato, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } })
      : ok
        ? new Response(null, { status: 303, headers: { location: GRAZIE } })
        : new Response(`Iscrizione non riuscita: ${errore}. Torna indietro e riprova.`, { status: stato, headers: { "content-type": "text/plain; charset=utf-8" } });

  if (!nl.azione) return rispondi(false, "newsletter non configurata", 503);
  let dati;
  try {
    dati = new URLSearchParams(await req.text());
  } catch {
    return rispondi(false, "richiesta non valida");
  }
  const campo = nl.campo || "email";
  const email = (dati.get(campo) || "").trim();
  if (!EMAIL_VALIDA.test(email) || email.length > 254) return rispondi(false, "indirizzo email non valido");
  if (dati.get("consenso") !== "si") return rispondi(false, "manca il consenso");
  // Trappola anti-spam: le persone non vedono questo campo, i bot lo compilano.
  if ((dati.get("email_address_check") || "").trim()) return rispondi(true);

  const inoltro = new URLSearchParams({ [campo]: email, ...(nl.campiExtra || {}) });
  try {
    const r = await fetch(nl.azione, {
      method: "POST",
      body: inoltro,
      redirect: "manual",
      headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "SoffiaCartuccia-Newsletter/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    const testo = (await r.text().catch(() => "")).replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`Brevo: stato ${r.status}, location ${r.headers.get("location") || "-"}, testo: ${testo.slice(0, 400) || "-"}`);
    if (r.status >= 400) {
      console.error("Brevo ha risposto", r.status);
      return rispondi(false, "il servizio della newsletter ha rifiutato l'iscrizione", 502);
    }
    return rispondi(true);
  } catch (e) {
    console.error("Brevo non raggiungibile", e?.message);
    return rispondi(false, "il servizio della newsletter non risponde", 502);
  }
};

export const config = { path: "/api/newsletter" };
