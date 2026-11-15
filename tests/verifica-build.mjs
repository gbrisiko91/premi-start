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

  if (lingua === "it") {
    const album = indice.find(a => a.id === "gta-6-album-tracklist-leak");
    assert.ok(album, "Articolo GTA VI The Album assente dall'indice");
    const paginaAlbum = fs.readFileSync(`dist${album.url}index.html`, "utf8");
    assert.ok(paginaAlbum.includes("announcing-grand-theft-auto-vi-the-album-coming-november-19"), "Fonte ufficiale Rockstar su The Album assente");
    assert.ok(paginaAlbum.includes("grand-theft-auto-vi-original-score-by-justice"), "Fonte ufficiale Rockstar sul disco dei Justice assente");
    assert.ok(paginaAlbum.includes("Rockstar Games non ha confermato la scaletta completa"), "Manca l'avvertenza sulla tracklist non confermata");
    assert.ok(paginaAlbum.includes("A quattro giorni dall"), "Differenza giorni GTA VI album non corretta");
    assert.ok(!paginaAlbum.includes("A cinque giorni dall"), "Rimane il conteggio errato dei giorni");
    assert.ok(!paginaAlbum.includes("NOTE PER LA REDAZIONE"), "Note redazionali visibili nell'articolo sull'album");
  }


  if (lingua === "it") {
    const majora = indice.find(a => a.id === "majoras-mask-remake-switch-2");
    assert.ok(majora, "Articolo Majora's Mask mancante dall'indice");
    const paginaMajora = fs.readFileSync(`dist${majora.url}index.html`, "utf8");
    assert.ok(paginaMajora.includes("oltre 5,2 milioni"), "Vendite Nintendo non aggiornate nell'articolo Majora's Mask");
    assert.ok(paginaMajora.includes("nintendo.co.jp/corporate/release/en/2026/261111.html"), "Fonte primaria Nintendo assente");
    assert.ok(paginaMajora.includes("non una smentita ufficiale di Nintendo"), "Rumor non distinto dalla smentita ufficiale");
    assert.ok(!paginaMajora.includes("NOTE PER LA REDAZIONE"), "Note interne visibili nell'articolo Majora's Mask");
  }

  assert.ok(home.includes("data-checkpoint-toggle"), `Consenso Checkpoint assente: ${lingua}`);
  assert.ok(home.includes("data-ricerca-apri"), `Pulsante ricerca assente: ${lingua}`);
  assert.ok(home.includes("digest-griglia"), `Digest assente: ${lingua}`);

  if (lingua === "it") {
    const takeTwo = indice.find(a => a.id === "take-two-ia-cloni-giochi");
    assert.ok(takeTwo, "Articolo Take-Two mancante dall'indice");
    const paginaTakeTwo = fs.readFileSync(`dist${takeTwo.url}index.html`, "utf8");
    assert.ok(paginaTakeTwo.includes("openai.com/policies/usage-policies/"), "Fonti ufficiali OpenAI assenti dall'articolo Take-Two");
    assert.ok(paginaTakeTwo.includes("diritti di proprietà intellettuale altrui"), "Chiarimento su tutela copyright assente");
    assert.ok(!paginaTakeTwo.includes("restrizioni simili"), "Rimane una generalizzazione sulle regole OpenAI");
    assert.ok(!paginaTakeTwo.includes("NOTE PER LA REDAZIONE"), "Note interne visibili nell'articolo Take-Two");
  }

  assert.ok(home.includes('class="flusso homepage-ultime"'), `Ultime notizie non evidenziate in homepage: ${lingua}`);
  assert.ok(home.indexOf('class="flusso homepage-ultime"') < home.indexOf('id="t-digest"'), `Ultime notizie troppo in basso: ${lingua}`);
  assert.ok(home.indexOf('class="flusso homepage-ultime"') < home.indexOf('id="t-uscite"'), `Calendario prima delle notizie: ${lingua}`);
  const sezioniHome = ['homepage-ultime','t-digest','t-retro','t-archivio'];
  const collegamentiHome = [];
  for (let j = 0; j < sezioniHome.length; j++) {
    const marker = sezioniHome[j] === 'homepage-ultime' ? 'class="flusso homepage-ultime"' : `id="${sezioniHome[j]}"`;
    const pos = home.indexOf(marker);
    if (pos < 0) continue;
    const next = sezioniHome.slice(j + 1).map(x => home.indexOf(x === 'homepage-ultime' ? 'class="flusso homepage-ultime"' : `id="${x}"`, pos + marker.length)).filter(x=>x > pos);
    const end = next.length ? Math.min(...next) : home.indexOf('</main>',pos);
    const snippet = home.slice(pos,end > 0 ? end : undefined);
    const matches = [...snippet.matchAll(/<a href="(\/[^"]*\/)"[^>]*>/g)].map(m=>m[1]).filter(x=>x.includes('/articoli/'));
    collegamentiHome.push(...matches);
  }
  assert.ok(new Set(collegamentiHome).size === collegamentiHome.length, `Articoli duplicati in homepage: ${lingua}`);
  assert.ok(home.includes("mondi-griglia"), `Categorie assenti: ${lingua}`);
  assert.ok(home.includes("classifica-nota"), `Spiegazione Hype mancante: ${lingua}`);
  assert.ok(home.includes('id="t-indie"'), `Scoperta indie non presente in homepage: ${lingua}`);
  const indiePercorso = `${prefix}indie/index.html`;
  assert.ok(fs.existsSync(`dist/${indiePercorso}`), `Hub indie mancante: ${lingua}`);
  const indieHtml = fs.readFileSync(`dist/${indiePercorso}`, "utf8");
  assert.ok(indieHtml.includes('class="intestazione-elenco"'), `Hub indie senza intestazione: ${lingua}`);
  assert.ok(home.includes(`href="/${prefix}indie/"`), `Link homepage verso hub indie mancante: ${lingua}`);
  for (const item of indice.filter(a => a.tag.some(x => String(x).toLowerCase() === 'indie'))) {
    assert.ok(indieHtml.includes(`href="${item.url}"`), `Articolo indie assente nell'hub: ${lingua}: ${item.url}`);
  }

  assert.ok(home.indexOf('id="t-ultime"') < home.indexOf('id="t-indie"'), `Scoperta indie prima delle notizie: ${lingua}`);
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
  const primo = indice.find(a=>a.url && a.url.startsWith('/') && a.url.endsWith('/'));
  assert.ok(primo, `Nessun articolo disponibile per test redazionali: ${lingua}`);
  const urlArticolo = new URL(primo.url, 'https://soffiacartuccia.it').pathname;
  const paginaArticolo = fs.readFileSync(`dist${urlArticolo}index.html`, "utf8");
  assert.ok(paginaArticolo.includes('class="articolo-trasparenza"'), `Firma redazionale assente: ${lingua}`);
  assert.ok(paginaArticolo.includes('class="articolo-firma"'), `Attribuzione articolo assente: ${lingua}`);
  assert.ok(paginaArticolo.includes('rel="author">Gianmarco Buono</a>'), `Firma Gianmarco Buono assente: ${lingua}`);
  const percorsoProfilo = `/${prefix}autore/gianmarco-buono/`;
  assert.ok(paginaArticolo.includes(`href="${percorsoProfilo}" rel="author"`), `Firma non collegata al profilo corretto: ${lingua}`);
  const profiloAutore = fs.readFileSync(`dist${percorsoProfilo}index.html`, "utf8");
  assert.ok(profiloAutore.includes('<h1>Gianmarco Buono</h1>'), `Titolo autore assente: ${lingua}`);
  assert.ok(profiloAutore.includes('class="profilo-autore-biografia"'), `Biografia personale assente: ${lingua}`);
  assert.ok(profiloAutore.includes('Soffia Cartuccia'), `Biografia priva del riferimento alla testata: ${lingua}`);
  assert.ok(profiloAutore.includes('"@type":"ProfilePage"'), `Dati strutturati profilo mancanti: ${lingua}`);
  assert.ok(profiloAutore.includes(`href="${primo.url}"`), `Articolo recente non presente nel profilo: ${lingua}`);
  assert.ok(home.includes(`href="${percorsoProfilo}"`), `Footer senza link al profilo autore: ${lingua}`);

  assert.ok(paginaArticolo.includes('"@type":"Person","name":"Gianmarco Buono"'), `Autore Person nel JSON-LD non corretto: ${lingua}`);
  assert.ok(paginaArticolo.includes(`"url":"https://soffiacartuccia.it${percorsoProfilo}"`), `URL autore JSON-LD non aggiornato: ${lingua}`);
  assert.ok(paginaArticolo.includes('"@type":"Organization","name":"Soffia Cartuccia"'), `Editore Organization nel JSON-LD mancante: ${lingua}`);
  assert.ok(paginaArticolo.includes('class="articolo-verifica"'), `Link metodo di verifica assente: ${lingua}`);
  const intestazioneArticolo = paginaArticolo.slice(paginaArticolo.indexOf('<header class="eroe-articolo">'), paginaArticolo.indexOf('</header>', paginaArticolo.indexOf('<header class="eroe-articolo">')));
  assert.ok(!intestazioneArticolo.includes('class="articolo-verifica"'), `Il link del metodo di verifica non deve comparire vicino alla firma: ${lingua}`);
  assert.ok(paginaArticolo.includes('class="metodo-fonti"'), `Link di verifica non spostato in fondo all'articolo: ${lingua}`);
  assert.ok(paginaArticolo.includes('come-lavoriamo') || lingua !== 'it', `Metodo di verifica italiano non collegato`);
    assert.ok(Array.isArray(indice), `Indice invalido: ${lingua}`);
  const pirates = indice.find(x => x.id === "pirates-black-sails-of-the-sea-gioco-offline");
  assert.ok(pirates, `Pirates mancante dall'indice: ${lingua}`);
  const pirateHtml = fs.readFileSync(`dist${pirates.url}index.html`, "utf8");
  assert.ok(pirateHtml.includes("com.pirates.bsos.game"), `Google Play non collegato nell'articolo Pirates: ${lingua}`);
  assert.ok(pirateHtml.includes("id6745219811"), `App Store non collegato nell'articolo Pirates: ${lingua}`);
  assert.ok(!pirateHtml.includes("NOTE PER LA REDAZIONE"), `Note interne di Pirates presenti in HTML: ${lingua}`);

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
    assert.ok(!html.includes("NOTE PER LA REDAZIONE") && !html.includes("DA COMPLETARE PRIMA DI PUBBLICARE"), `Nota interna esposta: ${item.url}`);
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
console.log("OK: tutte le lingue, indici, articoli e asset verificati.");
