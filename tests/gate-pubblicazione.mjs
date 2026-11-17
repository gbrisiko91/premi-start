import { test } from "node:test";
import assert from "node:assert/strict";
import { leggiCambiamenti, valutaCambiamenti } from "../strumenti/gate-pubblicazione.mjs";

const art = "content/articoli/2026-11-17-test.md";
const base = `---
titolo: "Un aggiornamento rilevante sulla nuova console"
titolo_seo: "Nuova console: tutti i dettagli"
sommario: "La nuova console viene presentata ufficialmente, con informazioni confermate sulle principali novità e sui dettagli della disponibilità in Europa."
parola_chiave: "nuova console"
data: 2026-11-17
categoria: console
bozza: false
immagine: "https://example.com/immagine.png"
alt_immagine: "Console in primo piano"
crediti_immagine: "Immagine: produttore"
fonti:
  - titolo: "Comunicato"
    url: "https://example.com/news"
verifica:
  stato: verificata
  natura: ufficiale
  fonti_primarie: 1
  dubbi: []
---
Il produttore ha comunicato la novità sul proprio sito ufficiale.
`;
const opts = (sources, today="2026-11-17") => ({ oggi: today, leggi: file => sources[file], esiste: file => file.startsWith("content/articoli/") });
test("legge la lista git name-status", () => {
  assert.deepEqual(leggiCambiamenti("A\tcontent/articoli/a.md\nM\tbuild.mjs\n"), [{stato:"A",file:"content/articoli/a.md"},{stato:"M",file:"build.mjs"}]);
});
test("gate di prova: rileva articolo verificato senza abilitare auto-merge", () => {
  const r=valutaCambiamenti([{stato:"A",file:art}],opts({[art]:base}));
  assert.equal(r.autoMergeAbilitato,false);
  assert.equal(r.candidata,true, JSON.stringify(r.problemi));
});
test("blocca bozze e note editoriali", () => {
  const r=valutaCambiamenti([{stato:"A",file:art}],opts({[art]:base.replace("bozza: false","bozza: true")+"\n<!-- TODO -->"}));
  assert.ok(r.problemi.some(p=>p.controllo==="G1"));
  assert.ok(r.problemi.some(p=>p.controllo==="G4"));
});
test("blocca HTML grezzo e tema sensibile", () => {
  const testo=base.replace('Un aggiornamento rilevante sulla nuova console','Licenziato dirigente della nuova console').concat('\n<img src=x onerror=alert(1)>');
  const r=valutaCambiamenti([{stato:"A",file:art}],opts({[art]:testo}));
  assert.ok(r.problemi.some(p=>p.controllo==="G3"));
  assert.ok(r.problemi.some(p=>p.controllo==="G8"));
});
test("non propone auto-merge di file modificati o file tecnici", () => {
  const r=valutaCambiamenti([{stato:"M",file:art},{stato:"A",file:"build.mjs"}],opts({[art]:base}));
  assert.ok(r.problemi.filter(p=>p.controllo==="S3").length>=2);
});
test("traduzione richiede originale", () => {
  const f="content/traduzioni/en/2026-11-17-other.md";
  const r=valutaCambiamenti([{stato:"A",file:f}],{
    oggi:"2026-11-17",leggi:()=> "---\ntitolo: \"Other\"\nslug: \"other\"\n---\nTesto\n",esiste:()=>false,
  });
  assert.ok(r.problemi.some(p=>p.controllo==="G10"));
});


test("senza immagine la verifica meccanica non segnala G6", () => {
  const testo = base.replace(/^immagine:.*\nalt_immagine:.*\ncrediti_immagine:.*\n/m, "");
  const r = valutaCambiamenti([{stato:"A",file:art}],opts({[art]:testo}));
  assert.equal(r.candidata,true,JSON.stringify(r.problemi));
});
test("immagini senza diritti descritti o con URL insicuri sono segnalate", () => {
  for (const testo of [
    base.replace(/^crediti_immagine:.*\n/m, ""),
    base.replace("https://example.com/immagine.png","http://example.com/immagine.png"),
    base.replace(/^immagine:.*\n/m, ""),
    base.replace("alt_immagine:",'immagine_riserva: "javascript:alert(1)"\nalt_immagine:')
  ]) {
    const r=valutaCambiamenti([{stato:"A",file:art}],opts({[art]:testo}));
    assert.ok(r.problemi.some(p=>p.controllo==="G6"));
  }
});
test("interviste, recensioni e indiscrezioni sempre a revisione umana", () => {
  for (const natura of ["intervista","recensione","indiscrezione"]) {
    const testo=base.replace("natura: ufficiale", "natura: "+natura);
    const r=valutaCambiamenti([{stato:"A",file:art}],opts({[art]:testo}));
    assert.ok(r.problemi.some(p=>p.controllo==="G3"),natura);
    assert.equal(r.autoMergeAbilitato,false);
  }
});
