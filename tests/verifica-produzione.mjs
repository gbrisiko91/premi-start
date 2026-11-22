import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {verificaManifest,verificaPagina,verificaSitemap,verificaHeaderIndicizzazione,BASE_PRODUZIONE} from "../strumenti/verifica-produzione.mjs";

const sha="a".repeat(40);
test("manifest: controlla il commit esatto, senza considerare sufficiente una build precedente",()=>{
  const m={revisione:sha, generatoIl:"2026-11-22T19:00:00Z",
    ultimiArticoli:["/articoli/articolo-recente/"],specialeGta6:true};
  assert.deepEqual(verificaManifest(m,sha),[]);
  assert.match(verificaManifest({...m,revisione:"b".repeat(40)},sha).join(" "),/diversa dal commit/);
  assert.ok(verificaManifest({...m,ultimiArticoli:["https://example.org/"]},sha).length);
  assert.ok(verificaManifest({...m,ultimiArticoli:[]},sha).length);
  assert.ok(verificaManifest({...m,specialeGta6:"si"},sha).length);
  assert.ok(verificaManifest(m,"non-sha").length);
});

test("canonical e noindex rispettano i diversi tipi di pagina",()=>{
  const pagina = '<!doctype html><html><head><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://soffiacartuccia.it/speciale-gta-6/"></head><body>Guide GTA 6</body></html>';
  assert.deepEqual(verificaPagina(pagina,{path:"/speciale-gta-6/",frammenti:["Guide GTA 6"]}),[]);
  assert.ok(verificaPagina(pagina,{path:"/speciale-gta-6/",frammenti:["Manca"]}).length);
  assert.ok(verificaPagina(pagina,{path:"/altro/"}).length);
  assert.ok(verificaPagina('<html><head><meta name="robots" content="noindex, follow"></head></html>',
    {path:"/instagram/",indexabile:false}).length === 0);
  assert.ok(verificaPagina(pagina,{path:"/instagram/",indexabile:false}).length);
  assert.ok(verificaPagina("errore 404",{path:"/"}).length);
});

test("X-Robots-Tag HTTP: identifica noindex o none anche se il meta HTML dice index",()=>{
  assert.deepEqual(verificaHeaderIndicizzazione(null, "/"), []);
  assert.deepEqual(verificaHeaderIndicizzazione("all, max-snippet:-1", "/"), []);
  assert.deepEqual(verificaHeaderIndicizzazione("nofollow", "/"), []);
  assert.deepEqual(verificaHeaderIndicizzazione("noimageindex", "/"), []);
  assert.match(verificaHeaderIndicizzazione("noindex, nofollow", "/")[0],/blocca l'indicizzazione/);
  assert.match(verificaHeaderIndicizzazione("googlebot: noindex", "/")[0],/Google|googlebot/i);
  assert.equal(verificaHeaderIndicizzazione("none", "/")[0].includes("su /"),true);
});

test("sitemap include le pagine strategiche e il nuovo hub",()=>{
  const xml='<urlset><url><loc>'+BASE_PRODUZIONE+'/</loc></url><url><loc>'+BASE_PRODUZIONE+'/speciale-gta-6/</loc></url></urlset>';
  assert.deepEqual(verificaSitemap(xml,["/","/speciale-gta-6/"]),[]);
  assert.ok(verificaSitemap(xml,["/articoli/inesistente/"]).length);
});

test("la build produce un manifest che corrisponde alle ultime pagine reali",()=>{
  const raw=readFileSync(new URL("../dist/stato-deploy.json",import.meta.url),"utf8");
  const m=JSON.parse(raw);
  const expected=process.env.COMMIT_REF||process.env.GITHUB_SHA||"local";
  assert.equal(m.revisione, /^[\da-f]{40}$/i.test(expected)?expected.toLowerCase():"local");
  assert.match(m.generatoIl,/^\d{4}-\d{2}-\d{2}T/);
  assert.equal(m.ultimiArticoli.length,3);
  for(const p of m.ultimiArticoli)
    assert.ok(existsSync(new URL("../dist"+p+"index.html",import.meta.url)),"Articolo assente: "+p);
  assert.equal(m.specialeGta6,true);
});
