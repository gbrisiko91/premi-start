import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {verificaManifest,verificaPagina,verificaSitemap,verificaHeaderIndicizzazione,verificaSitemapNewsPubblicata,BASE_PRODUZIONE} from "../strumenti/verifica-produzione.mjs";

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


test("sitemap News pubblicata: accetta oggi, ieri e XML vuoto con no-store", () => {
  const headers=new Headers({"content-type":"application/xml; charset=utf-8","cache-control":"no-store"});
  const wrap=(body)=>'<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">'
    + body + '</urlset>';
  const item=(date,id)=>'<url><loc>https://soffiacartuccia.it/articoli/'+id+'/</loc><news:news><news:publication>'
    + '<news:name>Soffia Cartuccia</news:name><news:language>it</news:language></news:publication>'
    + '<news:publication_date>'+date+'</news:publication_date><news:title>Notizia '+id+'</news:title></news:news></url>';
  const now=new Date("2026-11-23T12:00:00Z");
  assert.deepEqual(verificaSitemapNewsPubblicata(wrap(item("2026-11-23","oggi")+item("2026-11-22","ieri")),headers,now),[]);
  assert.deepEqual(verificaSitemapNewsPubblicata(wrap(""),headers,now),[],"nessuna notizia recente: sitemap vuota valida");
  assert.ok(verificaSitemapNewsPubblicata(wrap(item("2026-11-21","vecchio")),headers,now)
    .some(x=>x.includes("scaduto")));
  assert.ok(verificaSitemapNewsPubblicata(wrap(item("2026-11-24","futuro")),headers,now)
    .some(x=>x.includes("futuro")));
  assert.ok(verificaSitemapNewsPubblicata(wrap(item("2026-11-23","oggi").repeat(2)),headers,now)
    .some(x=>x.includes("duplicato")));
});

test("sitemap News: smaschera file statico o Edge inattiva, XML malformato e metadati assenti", () => {
  const now=new Date("2026-11-23T23:15:00Z"); // Roma: 24 novembre
  const xml='<?xml version="1.0" encoding="UTF-8"?>'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">'
    + '<url><loc>https://soffiacartuccia.it/articoli/a/</loc><news:news><news:publication>'
    + '<news:name>Soffia Cartuccia</news:name><news:language>it</news:language></news:publication>'
    + '<news:publication_date>2026-11-22</news:publication_date><news:title>A</news:title></news:news></url></urlset>';
  const headers=new Headers({"content-type":"application/xml","cache-control":"no-store"});
  const problems=verificaSitemapNewsPubblicata(xml,headers,now);
  assert.ok(problems.some(x=>x.includes("scaduto")),"dopo mezzanotte italiana l'URL vecchio non deve passare");
  const wrongHeaders=new Headers({"content-type":"text/html","cache-control":"public, max-age=3600"});
  const bad=verificaSitemapNewsPubblicata(xml,wrongHeaders,new Date("2026-11-23T12:00:00Z"));
  assert.ok(bad.some(x=>x.includes("Content-Type")));
  assert.ok(bad.some(x=>x.includes("no-store")));
  assert.ok(verificaSitemapNewsPubblicata("<urlset></urlset>",headers,now)
    .some(x=>x.includes("namespace")));
  assert.ok(verificaSitemapNewsPubblicata(xml.replace("<news:title>A</news:title>",""),headers,new Date("2026-11-23T12:00:00Z"))
    .some(x=>x.includes("incompleti")));
});
