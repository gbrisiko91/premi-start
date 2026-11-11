import fs from "node:fs";
import assert from "node:assert/strict";
import matter from "gray-matter";
import { LINGUE } from "../lingue.mjs";
import { QUIZ } from "../quiz.mjs";
import { R, SONDAGGI, USCITE } from "../rubriche.mjs";
import { componi } from "../strumenti/newsletter-componi.mjs";
import ARTICOLI_NL from "../netlify/dati/newsletter.mjs";

for (const lingua of Object.keys(LINGUE)) {
  const prefix = lingua === "it" ? "" : lingua + "/";
  const home = fs.readFileSync(`dist/${prefix}index.html`, "utf8");
  const indice = JSON.parse(fs.readFileSync(`dist/indice-${lingua}.json`, "utf8"));
  assert.ok(home.includes("data-ricerca-dialog"), `Ricerca assente: ${lingua}`);
  assert.ok(home.includes("data-checkpoint"), `Checkpoint assente: ${lingua}`);
  assert.ok(home.includes("data-checkpoint-toggle"), `Consenso Checkpoint assente: ${lingua}`);
  assert.ok(home.includes("data-ricerca-apri"), `Pulsante ricerca assente: ${lingua}`);
  assert.ok(home.includes("digest-griglia"), `Digest assente: ${lingua}`);
  assert.ok(home.includes("mondi-griglia"), `Categorie assenti: ${lingua}`);
  assert.ok(home.includes("quiz-richiamo"), `Richiamo quiz assente: ${lingua}`);
  assert.ok(home.includes(`href="${prefix ? "/" + prefix : "/"}quiz/"`), `Link quiz assente: ${lingua}`);
  const quizHtml = fs.readFileSync(`dist/${prefix}quiz/index.html`, "utf8");
  assert.ok(quizHtml.includes("data-quiz"), `Quiz assente: ${lingua}`);
  assert.ok(quizHtml.includes('id="quiz-dati"'), `Domande del quiz assenti: ${lingua}`);
  assert.ok(quizHtml.includes('src="/quiz.js"'), `Script quiz assente: ${lingua}`);
  assert.equal(QUIZ[lingua].items.length, 14, `Servono quattordici domande: ${lingua}`);
  assert.equal(new Set(QUIZ[lingua].items.map(([question]) => question)).size, QUIZ[lingua].items.length, `Domande duplicate: ${lingua}`);
  for (const [question, options, explanation] of QUIZ[lingua].items) {
    assert.ok(question && explanation, `Quiz incompleto: ${lingua}`);
    assert.equal(options.length, 4, `Risposte non valide: ${lingua}`);
    assert.equal(new Set(options).size, 4, `Opzioni duplicate: ${lingua}`);
  }
  assert.ok(Array.isArray(indice), `Indice invalido: ${lingua}`);
  const uscite = fs.readFileSync(`dist/${prefix}${R[lingua].seg.uscite}/index.html`, "utf8");
  assert.ok(uscite.includes("data-conto") && uscite.includes("data-uscita="), `Calendario uscite incompleto: ${lingua}`);
  assert.ok(home.includes("uscite-box") && home.includes("data-sondaggio"), `Uscite o sondaggio assenti dalla home: ${lingua}`);
  const sondaggio = fs.readFileSync(`dist/${prefix}${R[lingua].seg.sondaggio}/index.html`, "utf8");
  assert.ok(sondaggio.includes("data-sondaggi-dati") && sondaggio.includes('src="/sondaggio.js"'), `Sondaggio incompleto: ${lingua}`);
  assert.equal(home.includes('class="newsletter"'), lingua === "it", `Newsletter nella lingua sbagliata: ${lingua}`);
  for (const s of SONDAGGI) {
    const [domanda, opzioni] = s.testi[lingua] || [];
    assert.ok(domanda && opzioni?.length === s.testi.it[1].length, `Sondaggio ${s.id} non tradotto bene: ${lingua}`);
  }
  const privacySlug = matter(fs.readFileSync(`content/pagine/${lingua}/privacy.md`, "utf8")).data.slug;
  const privacy = fs.readFileSync(`dist/${prefix}${privacySlug}/index.html`, "utf8");
  assert.ok(privacy.includes("localStorage"), `Informativa privacy non aggiornata: ${lingua}`);
  assert.ok(!indice.some((a) => a.bozza === true), `Bozze nell’indice: ${lingua}`);
  assert.ok(indice.every(a => a.id && a.url.startsWith("/") && a.titolo), `Dati indice invalidi: ${lingua}`);
  for (const item of indice) {
    const relative = item.url.slice(1) + "index.html";
    assert.ok(fs.existsSync("dist/" + relative), `Indice punta a pagina mancante: ${item.url}`);
    const html = fs.readFileSync("dist/" + relative, "utf8");
    assert.ok(html.includes("data-salva-articolo"), `Preferiti assenti: ${item.url}`);
  }
}
{
  const ultimo = ARTICOLI_NL.map((a) => a.giorno).sort().at(-1);
  const nl = componi(ARTICOLI_NL, ultimo);
  assert.ok(nl && nl.notizie.length >= 1 && nl.html.includes("{{ unsubscribe }}") && nl.oggetto.length > 10, "Newsletter automatica non componibile");
}
assert.equal(new Set(SONDAGGI.map((s) => s.id)).size, SONDAGGI.length, "Id dei sondaggi duplicati");
assert.ok(SONDAGGI.every((s, i) => i === 0 || s.dal > SONDAGGI[i - 1].dal), "Sondaggi non in ordine di data");
assert.ok(USCITE.every((u) => (u.data ? /^\d{4}-\d{2}-\d{2}$/.test(u.data) : /^\d{4}$/.test(u.anno)) && u.piattaforme.length && /^https:\/\//.test(u.fonte)), "Uscita senza data, piattaforme o fonte");
assert.ok(/data-netlify="true"|data-newsletter-esterna/.test(fs.readFileSync("dist/index.html", "utf8")), "Modulo newsletter assente");
assert.ok(fs.existsSync("dist/newsletter/grazie/index.html") && fs.existsSync("dist/newsletter/confermata/index.html"), "Pagine della newsletter mancanti");
for (const f of ["dist/rubriche.css","dist/uscite.js","dist/sondaggio.js","dist/novita.css","dist/quiz.css","dist/quiz.js","dist/esperienza.js","dist/sitemap.xml","dist/rss.xml","dist/stile.css"]) {
  assert.ok(fs.existsSync(f), `File mancante: ${f}`);
}
{
  // Google: niente link a indirizzi che reindirizzano (es. /404.html → /404) e 404 fuori dall'indice
  const pagine = [];
  const giro = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const x = `${d}/${f.name}`; if (f.isDirectory()) giro(x); else if (x.endsWith(".html")) pagine.push(x); } };
  giro("dist");
  for (const f of pagine) {
    const h = fs.readFileSync(f, "utf8");
    assert.ok(!/(href|content)="(\/|https?:\/\/(www\.)?soffiacartuccia\.it)[^"]*\.html"/.test(h), `Link interno a una pagina .html (Netlify la reindirizza) in ${f}`);
    assert.ok(!/"(http:\/\/|https:\/\/www\.)soffiacartuccia\.it/.test(h), `Link interno con http o www (reindirizzato) in ${f}`);
    if (f.endsWith("404.html")) assert.ok(h.includes('content="noindex') && !h.includes('rel="canonical"'), `404 indicizzabile: ${f}`);
  }
  const sm = fs.readFileSync("dist/sitemap.xml", "utf8");
  assert.ok([...sm.matchAll(/<loc>([^<]*)<\/loc>/g)].every((m) => /^https:\/\/soffiacartuccia\.it\/(.*\/)?$/.test(m[1])), "Sitemap con indirizzi che reindirizzano");
}
{
  // Missione 2K: pagina di voto della top 100
  const { TOP100, pulisciVoto, contaVoti, statoVoto } = await import("../top100.mjs");
  const h = fs.readFileSync("dist/top-100/index.html", "utf8");
  assert.ok(h.includes("data-top100-dati") && h.includes('src="/top100.js"'), "Pagina top 100 incompleta");
  const ids = TOP100.candidati.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, "Giochi duplicati nella top 100");
  assert.ok(ids.length >= 100, "Servono almeno 100 giochi candidati");
  assert.ok(TOP100.apertura <= TOP100.chiusura, "Date del voto invertite");
  assert.equal(pulisciVoto({ scelte: ["inventato"] }), null, "Accettato un gioco fuori elenco");
  assert.equal(pulisciVoto({ scelte: ids.slice(0, TOP100.maxScelte + 1) }), null, "Accettati troppi giochi");
  assert.equal(contaVoti([{ scelte: [ids[0], ids[1]] }, { scelte: [ids[1]] }]).classifica[0].id, ids[1], "Conteggio dei voti sbagliato");
  assert.equal(statoVoto("2000-01-01"), "prima", "Stato del voto sbagliato");
}
console.log("OK: tutte le lingue, indici, articoli e asset verificati.");
