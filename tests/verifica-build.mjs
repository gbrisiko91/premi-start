import fs from "node:fs";
import assert from "node:assert/strict";
import matter from "gray-matter";
import { LINGUE } from "../lingue.mjs";
import { QUIZ } from "../quiz.mjs";
import { R, SONDAGGI, USCITE } from "../rubriche.mjs";

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
assert.equal(new Set(SONDAGGI.map((s) => s.id)).size, SONDAGGI.length, "Id dei sondaggi duplicati");
assert.ok(SONDAGGI.every((s, i) => i === 0 || s.dal > SONDAGGI[i - 1].dal), "Sondaggi non in ordine di data");
assert.ok(USCITE.every((u) => (u.data ? /^\d{4}-\d{2}-\d{2}$/.test(u.data) : /^\d{4}$/.test(u.anno)) && u.piattaforme.length && /^https:\/\//.test(u.fonte)), "Uscita senza data, piattaforme o fonte");
assert.ok(/data-netlify="true"|data-newsletter-esterna/.test(fs.readFileSync("dist/index.html", "utf8")), "Modulo newsletter assente");
assert.ok(fs.existsSync("dist/newsletter/grazie/index.html"), "Pagina di ringraziamento newsletter mancante");
for (const f of ["dist/rubriche.css","dist/uscite.js","dist/sondaggio.js","dist/novita.css","dist/quiz.css","dist/quiz.js","dist/esperienza.js","dist/sitemap.xml","dist/rss.xml","dist/stile.css"]) {
  assert.ok(fs.existsSync(f), `File mancante: ${f}`);
}
console.log("OK: tutte le lingue, indici, articoli e asset verificati.");
