import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { raccogliSpecialeGta6 } from "../strumenti/speciale-gta6.mjs";

const mk = (id, data, extra = {}) => ({
  id, url: "/articoli/" + id + "/", tag: ["gta-6"], bozza: false,
  titolo: id, data: new Date(data + "T10:00:00Z"), ...extra,
});

test("sceglie solo articoli GTA 6 pubblicati, senza duplicati", () => {
  const items = [
    mk("gta-6-guida-lancio","2026-11-16"),
    mk("gta-6-vendite-record","2026-11-21"),
    mk("gta-6-disponibile-italia","2026-11-19"),
    mk("news","2026-11-22"),
    mk("news","2026-11-22"),
    mk("bozza","2026-11-23",{bozza:true}),
    mk("fuori","2026-11-24",{tag:["nintendo"]}),
  ];
  const r = raccogliSpecialeGta6(items);
  assert.equal(r.totale, 4);
  assert.deepEqual(r.guide.map((a)=>a.id),[
    "gta-6-guida-lancio","gta-6-disponibile-italia","gta-6-vendite-record"
  ]);
  assert.deepEqual(r.notizie.map((a)=>a.id),["news"]);
  assert.equal(r.ultimoAggiornamento.toISOString().slice(0,10),"2026-11-22");
});

test("ignora URL non validi e non inventa guide non presenti", () => {
  const r = raccogliSpecialeGta6([
    mk("gta-6-guida-lancio","2026-11-16"),
    mk("esterno","2026-11-22",{url:"https://example.com/"}),
    mk("script","2026-11-22",{url:"/articoli/?x=<svg>"}),
  ]);
  assert.equal(r.totale,1);
  assert.deepEqual(r.guide.map((x)=>x.id),["gta-6-guida-lancio"]);
  assert.deepEqual(r.notizie,[]);
  assert.equal(raccogliSpecialeGta6([]).totale,0);
});

test("pagina Speciale GTA 6 indicizzabile, in sitemap e collegata da home, Instagram e articoli", () => {
  const hub = readFileSync(new URL("../dist/speciale-gta-6/index.html", import.meta.url), "utf8");
  const home = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
  const bio = readFileSync(new URL("../dist/instagram/index.html", import.meta.url), "utf8");
  const sitemap = readFileSync(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  const indice = JSON.parse(readFileSync(new URL("../dist/indice-it.json", import.meta.url), "utf8"));
  assert.match(hub, /<link rel="canonical" href="https:\/\/soffiacartuccia\.it\/speciale-gta-6\/">/);
  assert.match(hub, /<meta name="robots" content="index, follow/);
  assert.match(hub, /id="gta6-speciale-titolo"/);
  assert.match(hub, /id="gta6-guide-titolo"/);
  assert.match(hub, /id="gta6-news-titolo"/);
  assert.match(sitemap, /<loc>https:\/\/soffiacartuccia\.it\/speciale-gta-6\/<\/loc>/);
  assert.match(home,/href="\/speciale-gta-6\/"/);
  assert.match(bio,/href="\/speciale-gta-6\/\?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=link-in-bio"/);
  const gta6 = indice.filter((a)=>a.tag.includes("gta-6"));
  assert.ok(gta6.length > 5,"Il sito contiene diversi articoli GTA 6");
  for(const a of gta6) {
    assert.ok(hub.includes('href="' + a.url + '"'),"Articolo mancante: "+a.url);
    assert.equal(hub.split('href="' + a.url + '"').length-1,1, "Duplicazione nel hub: "+a.url);
  }
  const art = readFileSync(new URL("../dist/articoli/gta-6-guida-lancio/index.html", import.meta.url), "utf8");
  assert.match(art,/class="speciale-gta6-rimando"/);
  assert.match(art,/href="\/speciale-gta-6\/"/);
});
