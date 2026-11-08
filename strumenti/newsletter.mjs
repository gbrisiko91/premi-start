// Prepara la newsletter "Il Soffio della settimana" a mano.
//   node strumenti/newsletter.mjs [AAAA-MM-GG] [--html]
// Senza --html stampa l'oggetto e la versione testo; con --html stampa l'HTML da incollare in Brevo
// ("Codifica il tuo HTML"), con l'oggetto e il testo di anteprima in un commento in testa.
// Prende le 5 notizie pubblicate negli ultimi 7 giorni (fino alla data indicata, di default oggi)
// con la viralità più alta, più le prossime uscite del calendario e il sondaggio in corso.
// L'invio automatico della domenica usa la stessa composizione: netlify/functions/newsletter-domenica.mjs.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { componi, oggiRoma } from "./newsletter-componi.mjs";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const ARTICOLI = path.join(ROOT, "content", "articoli");
const argomenti = process.argv.slice(2);
const HTML = argomenti.includes("--html");
const fine = argomenti.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || oggiRoma();
const iso = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

const articoli = fs.readdirSync(ARTICOLI).filter((f) => f.endsWith(".md")).map((f) => {
  const { data } = matter(fs.readFileSync(path.join(ARTICOLI, f), "utf8"));
  return { ...data, slug: f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""), giorno: iso(data.data) };
});

const n = componi(articoli, fine);
if (!n) { console.log(`Nessun articolo pubblicato nella settimana che finisce il ${fine}.`); process.exit(0); }
if (HTML) console.log(`<!-- Oggetto: ${n.oggetto} -->\n<!-- Anteprima: ${n.anteprima} -->\n${n.html}`);
else console.log(`Oggetto: ${n.oggetto}\nAnteprima: ${n.anteprima}\n\n${n.testo}`);
