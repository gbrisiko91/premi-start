// Verifica editoriale e pulizia delle note interne per il sito pubblico.
// Le note in articoli preesistenti sono tollerate SOLO finché il file non cambia;
// ogni articolo nuovo/modificato deve essere controllato e privo di note pendenti.
import { createHash } from "node:crypto";
import matter from "gray-matter";
import { LEGACY_NOTES } from "./note-pregresse.mjs";

const NOTE = /<!--[\s\S]*?-->/g;
const PENDING = /\b(?:NOTE PER LA REDAZIONE|DA COMPLETARE|DA VERIFICARE|TODO|FIXME|TBD)\b/i;
const SECRET = /(?:BREVO_API_KEY|VOTE_HASH_SECRET)\s*[:=]\s*['"][^'"]+/i;
const gitSha = (source) => {
  const bytes = Buffer.from(source, "utf8");
  return createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
};
export const rimuoviNote = (testo) => String(testo).replace(NOTE, "");
export function validaArticolo(file, source, { categorie = [], bozza = false, base = LEGACY_NOTES } = {}) {
  const errori = [], avvisi = [];
  const { data, content } = matter(source);
  if (!data.titolo || typeof data.titolo !== "string") errori.push("titolo mancante");
  if (!data.sommario || typeof data.sommario !== "string") errori.push("sommario mancante");
  const giorno = data.data instanceof Date ? data.data : new Date(data.data);
  if (!data.data || Number.isNaN(giorno.getTime())) errori.push("data non valida");
  if (!categorie.includes(data.categoria)) errori.push("categoria non valida");
  if (data.immagine && (!data.alt_immagine || !data.crediti_immagine)) errori.push("immagine priva di alt o crediti");
  if (SECRET.test(source)) errori.push("possibile segreto scritto nel contenuto");
  if (!content.trim()) errori.push("contenuto vuoto");
  // Nelle bozze sono permesse note di lavorazione, ma non segreti.
  if (!bozza) {
    const comments = [...source.matchAll(NOTE)].map(m => m[0]);
    const flagged = comments.some(c => PENDING.test(c)) || PENDING.test(rimuoviNote(source));
    const name = file.split("/").at(-1);
    const tolerated = Boolean(base[name] && base[name] === gitSha(source));
    if (flagged || comments.length) {
      if (tolerated) avvisi.push("note redazionali pregresse: rivedere alla prossima modifica");
      else errori.push("note interne o marcatori di lavoro in articolo pubblicato");
    }
  }
  return { errori, avvisi };
}
