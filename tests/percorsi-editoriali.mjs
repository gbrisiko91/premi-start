import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { LINGUE } from "../lingue.mjs";
import { selezionaRimando, TESTI_PERCORSI } from "../strumenti/percorsi-editoriali.mjs";

const f = (id, lingua="it", tags=["gta-6"], bozza=false) => ({ id, lingua, tag:tags, bozza, url:(lingua==="it"?"":"/"+lingua)+"/articoli/"+id+"/" });
test("rimandi alla guida GTA 6: lingua corretta, niente bozze o autolink", () => {
  const a=f("gta-6-preload-peso"), guida=f("gta-6-guida-lancio"), en=f("gta-6-guida-lancio","en");
  assert.deepEqual(selezionaRimando(a,[en,guida]),{tipo:"gta6",url:guida.url});
  assert.equal(selezionaRimando(a,[en]),null);
  assert.equal(selezionaRimando(a,[f("gta-6-guida-lancio","it",["gta-6"],true)]),null);
  assert.equal(selezionaRimando(guida,[guida]),null);
  assert.equal(selezionaRimando(f("bozza","it",["gta-6"],true),[guida]),null);
});
test("scoperte indie: collegamento soltanto per tag pertinente", () => {
  assert.deepEqual(selezionaRimando(f("pirates","it",["indie"]),[]),{tipo:"indie"});
  assert.equal(selezionaRimando(f("news","it",["rockstar-games"]),[]),null);
});
test("testi specifici presenti per le nove lingue", () => {
  for(const l of Object.keys(LINGUE)) for(const k of ["indieTitle","indieText","gtaTitle","gtaDesc","gtaCta","indieTitleBox","indieDescBox","indieCta"])
    assert.ok(TESTI_PERCORSI[l]?.[k]?.trim(), l+" "+k);
});
test("tutti gli articoli GTA 6 hanno il link alla guida nella propria lingua", () => {
  for(const l of Object.keys(LINGUE)) {
    const items=JSON.parse(fs.readFileSync("dist/indice-"+l+".json","utf8"));
    const guida=items.find(a=>a.id==="gta-6-guida-lancio");
    assert.ok(guida,"Guida mancante "+l);
    const others=items.filter(a=>a.id!==guida.id && a.tag?.includes("gta-6"));
    assert.ok(others.length>=5,"Pochi articoli GTA 6 "+l);
    for(const a of others){
      const html=fs.readFileSync("dist"+a.url+"index.html","utf8");
      assert.ok(html.includes('class="percorso-editoriale"'),"Rimando assente "+a.url);
      assert.ok(html.includes('href="'+guida.url+'"'),"Guida in lingua sbagliata "+a.url);
    }
    const html=fs.readFileSync("dist"+guida.url+"index.html","utf8");
    assert.ok(!html.includes('class="percorso-editoriale"'),"Autolink sulla guida "+l);
  }
});
test("hub indie nove lingue: testo utile, due percorsi e collegamento reciproco", () => {
  for(const l of Object.keys(LINGUE)){
    const pref=l==="it"?"":l+"/";
    const html=fs.readFileSync("dist/"+pref+"indie/index.html","utf8");
    assert.ok(html.includes('class="intro-indie"'),"Intro indie assente "+l);
    assert.ok(html.includes('aria-label="'+TESTI_PERCORSI[l].indieTitle+'"'),"Navigazione indie assente "+l);
    const indice=JSON.parse(fs.readFileSync("dist/indice-"+l+".json","utf8"));
    const indie=indice.filter(a=>a.tag?.includes("indie"));
    assert.ok(indie.length>=2,"Pochi articoli indie "+l);
    for(const a of indie){
      assert.ok(html.includes('href="'+a.url+'"'),"Link mancante nella raccolta "+a.url);
      const article=fs.readFileSync("dist"+a.url+"index.html","utf8");
      assert.ok(article.includes('href="/'+pref+'indie/"'),"Link alla raccolta mancante "+a.url);
    }
  }
});
