import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { LINGUE } from "../lingue.mjs";
import { QUIZ } from "../quiz.mjs";
import { SONDAGGI, R } from "../rubriche.mjs";
import { QUIZ_ARCHIVIO_LABEL } from "../strumenti/quiz-archivio-label.mjs";

const root = new URL("../dist/", import.meta.url);
const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const html = (p) => fs.readFileSync(new URL(p.replace(/^\//,"")+"index.html",root),"utf8");
const pathQuiz = (l) => (l==="it"?"":l+"/")+"quiz/";
const pathPoll = (l) => (l==="it"?"":l+"/")+R[l].seg.sondaggio+"/";
const oggi = new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Rome"}).format(new Date());

test("i nove quiz hanno tre domande d'archivio accessibili senza JavaScript e senza risposte aperte",()=>{
  assert.deepEqual(Object.keys(QUIZ_ARCHIVIO_LABEL).sort(),Object.keys(LINGUE).sort());
  for(const l of Object.keys(LINGUE)) {
    const page = html(pathQuiz(l));
    assert.match(page,/<section class="quiz-archivio" aria-labelledby="quiz-archivio-titolo">/);
    assert.ok(page.includes(esc(QUIZ_ARCHIVIO_LABEL[l].title)));
    assert.equal((page.match(/<details>/g)||[]).length,3,l+": il numero delle curiosità è diverso da 3");
    for(const [domanda,risposte,spiegazione] of QUIZ[l].items.slice(-3)) {
      assert.ok(page.includes("<summary>"+esc(domanda)+"</summary>"),l+": domanda assente");
      assert.ok(page.includes("<strong>"+esc(QUIZ_ARCHIVIO_LABEL[l].answer)+": "+esc(risposte[0])+"</strong>"),l+": risposta assente");
      assert.ok(page.includes("<p>"+esc(spiegazione)+"</p>"),l+": spiegazione mancante");
    }
    assert.match(page,/<script id="quiz-dati" type="application\/json">/);
    assert.match(page,/<script src="\/quiz\.js" defer><\/script>/);
    assert.ok(page.includes('<meta name="robots" content="index, follow'));
  }
});

test("i nove sondaggi mostrano solo le domande già pubblicate, senza conteggi inventati",()=>{
  const current=SONDAGGI.filter(s=>s.dal<=oggi).at(-1) || SONDAGGI[0];
  const vecchi=SONDAGGI.filter(s=>s.dal<=oggi&&s.id!==current.id);
  for(const l of Object.keys(LINGUE)) {
    const page=html(pathPoll(l));
    assert.match(page,/<section class="sondaggi-passati" data-sondaggi-passati/);
    assert.ok(page.includes('<script src="/sondaggio.js" defer></script>'));
    assert.equal((page.match(/<article class="sondaggio-passato" data-sondaggio-passato=/g)||[]).length,vecchi.length,l+": archivio incompleto");
    for(const s of vecchi) {
      assert.ok(page.includes('data-sondaggio-passato="'+esc(s.id)+'"'),l+": ID precedente mancante");
      assert.ok(page.includes("<h3>"+esc(s.testi[l][0])+"</h3>"),l+": domanda precedente mancante");
      for(const opzione of s.testi[l][1]) assert.ok(page.includes("<li>"+esc(opzione)+"</li>"),l+": opzione assente");
    }
    for(const s of SONDAGGI.filter(s=>s.dal>oggi)) {
      assert.ok(!page.includes('data-sondaggio-passato="'+esc(s.id)+'"'),l+": sondaggio futuro anticipato");
    }
    assert.ok(page.includes('<meta name="robots" content="index, follow'));
  }
});

test("il client aggiorna le schede statiche invece di duplicarle",()=>{
  const js=fs.readFileSync(new URL("../public/sondaggio.js",import.meta.url),"utf8");
  assert.ok(js.includes('dataset.sondaggioPassato === s.id'),"Il client non riconosce le schede prerenderizzate");
  assert.ok(js.includes('if (!box) {'),"Manca il fallback quando cambia la settimana");
  assert.ok(js.includes('box.querySelector(".sondaggio-passato-opzioni")?.remove()'),"Le opzioni devono cedere il posto ai risultati reali");
  assert.ok(!js.includes('box.innerHTML = `<h3>'),"Client precedente che duplica le schede ancora presente");
});
