import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validaArticolo, rimuoviNote } from "../strumenti/verifica-editoriale.mjs";
import { LEGACY_NOTES } from "../strumenti/note-pregresse.mjs";
import { secretValid, tokenVoter, deltaLike, effectiveLike, sumDeltas, countBallots } from "../netlify/voti-sicuri.mjs";

const categoria=["console","pc","retro","industria"];
const baseArticle=(body)=>`---
titolo: "Test"
sommario: "Sommario dimostrativo."
data: 2026-11-08
categoria: pc
bozza: false
---
${body}`;

test("Nuove note redazionali irrisolte bloccano la pubblicazione",()=>{
  const text=baseArticle("Testo valido.\n\n<!-- NOTE PER LA REDAZIONE: verifica -->");
  const result=validaArticolo("2026-11-08-test.md",text,{categorie:categoria});
  assert.ok(result.errori.some(x=>x.includes("note interne")));
  assert.ok(!rimuoviNote(text).includes("NOTE PER LA REDAZIONE"));
});
test("Bozze consentono note redazionali, ma non credenziali",()=>{
  const text=baseArticle("Testo.\n\n<!-- NOTE PER LA REDAZIONE: verifica -->");
  assert.deepEqual(validaArticolo("bozza.md",text,{categorie:categoria,bozza:true}).errori,[]);
});
test("Un vecchio articolo intatto non blocca la build",()=>{
  const filename="2026-11-05-pirates-black-sails-of-the-sea-gioco-offline.md";
  const content=fs.readFileSync(`content/articoli/${filename}`,"utf8");
  assert.ok(LEGACY_NOTES[filename]);
  const current=validaArticolo(filename,content,{categorie:categoria});
  assert.deepEqual(current.errori,[]);
  assert.ok(current.avvisi.length);
  const changed=validaArticolo(filename,content+"\nmodifica necessaria",{categorie:categoria});
  assert.ok(changed.errori.length);
});
test("Metadati incompleti bloccano nuove pubblicazioni",()=>{
  const text=baseArticle("Notizia.");
  assert.ok(validaArticolo("new.md",text.replace("categoria: pc","categoria: errore"),{categorie:categoria}).errori.length);
});
test("Identificativi HMAC stabili e non pubblicamente prevedibili",()=>{
  const secret="un-segreto-di-esempio-di-almeno-32-caratteri";
  assert.ok(secretValid(secret));
  assert.equal(tokenVoter(secret,"like","articolo-1","127.0.0.1"),tokenVoter(secret,"like","articolo-1","127.0.0.1"));
  assert.notEqual(tokenVoter(secret,"like","articolo-1","127.0.0.1"),tokenVoter(secret,"poll","articolo-1","127.0.0.1"));
  assert.notEqual(tokenVoter(secret,"like","articolo-1","127.0.0.1"),tokenVoter(secret,"like","articolo-2","127.0.0.1"));
  assert.throws(()=>tokenVoter("breve","like","a","1"));
});
test("Like storici e delta reversibili",()=>{
  assert.equal(deltaLike(true,false),-1);
  assert.equal(deltaLike(false,true),1);
  assert.equal(deltaLike(true,true),0);
  assert.equal(effectiveLike(true,null),true);
  assert.equal(effectiveLike(true,"-1"),false);
  assert.equal(effectiveLike(false,"1"),true);
});
test("Conteggio aggregato di ballot senza aggiornare la chiave totale",async()=>{
  const contents=new Map([["v2/demo/uno","1"],["v2/demo/due","1"],["v2/demo/tre","-1"],["v2/demo/quattro","0"]]);
  const store={
    list:async({prefix})=>({blobs:[...contents.keys()].filter(x=>x.startsWith(prefix)).map(key=>({key,etag:"a"}))}),
    get:async(key)=>contents.get(key)??null
  };
  assert.equal(await sumDeltas(store,"v2/demo/"),1);
  contents.set("v2/poll/uno","0");contents.set("v2/poll/due","1");contents.set("v2/poll/tre","1");
  assert.deepEqual(await countBallots(store,"v2/poll/",3),[1,2,0]);
});
