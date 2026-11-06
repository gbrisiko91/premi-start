// Prepara il testo della newsletter "Il Soffio della settimana".
//   node strumenti/newsletter.mjs [AAAA-MM-GG]
// Prende le 5 notizie pubblicate negli ultimi 7 giorni (fino alla data indicata, di default oggi)
// con la viralità più alta, più le prossime uscite del calendario e il sondaggio in corso.
// Stampa un testo in Markdown pronto da incollare nel servizio di invio.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import config from "../sito.config.mjs";
import { USCITE, SONDAGGI, NEWSLETTER } from "../rubriche.mjs";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const ARTICOLI = path.join(ROOT, "content", "articoli");
const fine = process.argv[2] || new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
const inizio = new Date(new Date(`${fine}T00:00:00Z`).getTime() - 6 * 864e5).toISOString().slice(0, 10);
const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
const url = (p) => config.url.replace(/\/$/, "") + p;
const elide = (prep, testo) => (/^(8|11)\b/.test(testo) ? `${prep}ll'${testo}` : `${prep}l ${testo}`);
const giorno = (d) => new Intl.DateTimeFormat("it-IT", { timeZone: "UTC", day: "numeric", month: "long" }).format(new Date(`${d}T00:00:00Z`));

const notizie = fs.readdirSync(ARTICOLI).filter((f) => f.endsWith(".md")).map((f) => {
  const { data } = matter(fs.readFileSync(path.join(ARTICOLI, f), "utf8"));
  return { ...data, slug: f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""), giorno: iso(data.data) };
}).filter((a) => a.bozza === false && a.giorno >= inizio && a.giorno <= fine)
  .sort((a, b) => (b.viralita || 0) - (a.viralita || 0)).slice(0, 5);

if (!notizie.length) { console.log(`Nessun articolo pubblicato tra il ${inizio} e il ${fine}.`); process.exit(0); }

const uscite = USCITE.filter((u) => u.data && u.data > fine).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);
const sondaggio = SONDAGGI.filter((s) => s.dal <= fine).at(-1);
const utm = "";

console.log(`Oggetto: ${notizie[0].titolo_seo || notizie[0].titolo} e le altre notizie della settimana

# ${NEWSLETTER.nome}

Ciao! Ecco le 5 notizie gaming più importanti della settimana, ${elide("da", giorno(inizio))} ${elide("a", giorno(fine))}.

${notizie.map((a, i) => `## ${i + 1}. ${a.titolo}

${a.sommario}

[Leggi su ${config.nome}](${url(`/articoli/${a.slug}/`)}${utm})`).join("\n\n")}

## In arrivo

${uscite.map((u) => `- **${u.gioco}**: ${giorno(u.data)} (${u.piattaforme.join(", ")})`).join("\n")}

[Tutto il calendario delle uscite](${url("/uscite/")}${utm})
${sondaggio ? `\n## Il sondaggio della settimana\n\n**${sondaggio.testi.it[0]}** [Vota sul sito](${url("/sondaggio/")}${utm})\n` : ""}
---

Ricevi questa email perché ti sei iscritto al ${NEWSLETTER.nome.replace(/^Il /, "")} di ${config.nome}. Per cancellarti usa il link qui sotto oppure rispondi a questa email.`);
