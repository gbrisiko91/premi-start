/* Conteggio clic volontari sui tre wallpaper.
 * Non memorizziamo IP, user agent, cookie né identificatori del visitatore.
 * Un evento per chiave: niente contatori condivisi soggetti a race condition.
 */
import { randomUUID } from "node:crypto";

export const SFONDI = Object.freeze({
  cartuccia: "La cartuccia",
  mappa: "La mappa del Mondo 2",
  "press-start": "Press Start",
});

export const sfondoValido = (id) => Object.hasOwn(SFONDI, id);

// Firefox può omettere Origin su un sendBeacon same-origin. In tal caso
// accettiamo solo Sec-Fetch-Site: same-origin (non richieste da altri siti).
export const origineConsentita = (origin, site, expected) =>
  (!site || site === "same-origin") &&
  (origin === expected || (!origin && site === "same-origin"));


export const giornoRoma = (d = new Date()) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

export function nuovaChiave(id, d = new Date()) {
  if (!sfondoValido(id)) throw new Error("Sfondo sconosciuto");
  return "v1/" + giornoRoma(d) + "/" + id + "/" + d.getTime() + "-" + randomUUID();
}

export function riassumiClic(blobs, oggi = giornoRoma()) {
  const perSfondo = Object.fromEntries(Object.keys(SFONDI).map((id) => [id, 0]));
  const perGiorno = {};
  let totale = 0, clicOggi = 0;
  for (const { key } of blobs) {
    const m = /^v1\/(\d{4}-\d{2}-\d{2})\/(cartuccia|mappa|press-start)\/\d{13}-[\da-f-]{36}$/.exec(key || "");
    if (!m) continue;
    const [, giorno, id] = m;
    totale++;
    perSfondo[id]++;
    perGiorno[giorno] = (perGiorno[giorno] || 0) + 1;
    if (giorno === oggi) clicOggi++;
  }
  return { totale, oggi: clicOggi, perSfondo, perGiorno };
}
