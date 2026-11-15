import { test } from "node:test";
import assert from "node:assert/strict";
import { analizzaArticolo, analizzaCartella, inMarkdown } from "../strumenti/report-editoriale.mjs";

const articolo=(front,testo)=>"---\ntitolo: Test articolo\nsommario: Sintesi\ncategoria: industria\ndata: 2026-11-15\n"+front+"\n---\n"+testo+"\n";

test("Le note pendenti su un articolo pubblicato sono segnalate",()=>{
  const x=analizzaArticolo("pezzo.md",articolo("bozza: false", "Testo.\n\n<!-- NOTE PER LA REDAZIONE: DA VERIFICARE il prezzo -->"));
  assert.equal(x.bozza,false);
  assert.equal(x.notePendenti,1);
  assert.equal(x.priorita,2);
  assert.ok(x.flag.some(f=>f.includes("verifiche esplicite")));
});
test("Una fonte primaria senza URL non viene erroneamente dichiarata inesistente",()=>{
  const x=analizzaArticolo("originale.md",articolo("bozza: false\nimmagine: /media/cover.jpg","Testo originale confermato direttamente dallo sviluppatore."));
  assert.ok(x.flag.some(f=>f.includes("fonti dirette")));
  assert.ok(!x.flag.some(f=>f.includes("nessuna fonte disponibile")));
});
test("Le bozze non entrano nel report delle pubblicazioni",()=>{
  const [d]=analizzaCartella();
  assert.ok(d && typeof d.file==="string");
  const x=analizzaArticolo("bozza.md",articolo("bozza: true","Appunti."));
  assert.equal(x.bozza,true);
});
test("Il report Markdown espone gli avvisi senza certificare i fatti",()=>{
  const rows=[analizzaArticolo("articolo.md",articolo("bozza: false","Testo."))];
  const out=inMarkdown(rows);
  assert.ok(out.includes("articolo.md"));
  assert.ok(out.includes("non verifica l'esattezza dei fatti"));
});
