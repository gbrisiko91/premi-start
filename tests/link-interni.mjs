import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { destinazioneInterna, esisteDestinazione, verificaLinkInterni } from "../strumenti/verifica-link-interni.mjs";

test("risolve link relativi, URL con parametri e ignora solo i domini esterni", () => {
  assert.deepEqual(destinazioneInterna("/articoli/gta-6/?utm_source=instagram&amp;utm_medium=social"), { percorso:"/articoli/gta-6/" });
  assert.deepEqual(destinazioneInterna("../altro/?from=bio", "/articoli/guida/"), { percorso:"/articoli/altro/" });
  assert.equal(destinazioneInterna("#newsletter", "/instagram/"), null);
  assert.equal(destinazioneInterna("mailto:info@example.com"), null);
  assert.equal(destinazioneInterna("https://www.example.org/"), null);
  assert.equal(destinazioneInterna("/api/statistiche-sfondi"), null);
  assert.deepEqual(destinazioneInterna("javascript:alert(1)"), { errore:"Protocollo non consentito" });
});

test("scanner rileva link e URL della sitemap non generati", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sc-link-test-"));
  t.after(() => fs.rmSync(dir, { recursive:true, force:true }));
  fs.mkdirSync(path.join(dir, "articoli", "esistente"), { recursive:true });
  fs.writeFileSync(path.join(dir, "index.html"),
    '<html><a href="/articoli/esistente/">ok</a><a href="/inesistente/">rotto</a>' +
    '<a href="https://external.example/test">esterno</a><a href="/api/like">api</a></html>');
  fs.writeFileSync(path.join(dir, "articoli", "esistente", "index.html"),
    '<html><a href="/">Home</a></html>');
  fs.writeFileSync(path.join(dir, "sitemap.xml"),
    '<urlset><loc>https://soffiacartuccia.it/</loc>' +
    '<loc>https://soffiacartuccia.it/mancante/</loc></urlset>');
  fs.writeFileSync(path.join(dir, "sitemap-news.xml"), "<urlset></urlset>");
  assert.equal(esisteDestinazione(dir, "/articoli/esistente/"), true);
  assert.equal(esisteDestinazione(dir, "/mancante/"), false);
  const r = verificaLinkInterni(dir);
  assert.equal(r.pagine,2);
  assert.equal(r.errori.length,2);
  assert.ok(r.errori.some(x=>x.href==="/inesistente/"));
  assert.ok(r.errori.some(x=>x.da==="/sitemap.xml"&&x.href.includes("/mancante/")));
});

test("tutti i link interni e le URL delle sitemap del sito costruito esistono", () => {
  const root = path.resolve(new URL("../dist/", import.meta.url).pathname);
  const r = verificaLinkInterni(root);
  assert.ok(r.pagine>30, "La verifica deve coprire l'intero sito multilingua");
  assert.ok(r.linkInterni>100, "Il controllo non sta esaminando i collegamenti reali");
  assert.ok(r.urlSitemap>100, "La sitemap non è stata realmente verificata");
  assert.equal(r.errori.length, 0,
    "Link non risolti:\n" + r.errori.slice(0,25).map(x=>x.da+" → "+x.href+" ("+x.motivo+")").join("\n"));
});
