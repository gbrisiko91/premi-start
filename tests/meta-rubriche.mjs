// Regressione descrizioni SEO rubriche: 5 template x 9 lingue.
// Descrizioni specifiche per la pagina, senza modifiche agli articoli.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { META_RUBRICHE } from "../strumenti/meta-rubriche.mjs";
import { LINGUE } from "../lingue.mjs";
import { R } from "../rubriche.mjs";

const dist = new URL("../dist/", import.meta.url);
const categories = ["quiz","indie","poll","author","releases"];
const meta = (html) => html.match(/<meta name="description" content="([^"]+)">/)?.[1];

const expectedPaths = (l) => {
  const base = l === "it" ? "" : "/" + l;
  return {
    quiz: base + "/quiz/",
    indie: base + "/indie/",
    poll: base + "/" + R[l].seg.sondaggio + "/",
    author: base + "/autore/gianmarco-buono/",
    releases: base + "/" + R[l].seg.uscite + "/",
  };
};

test("ogni rubrica ha una descrizione localizzata specifica e non duplicata", () => {
  assert.deepEqual(Object.keys(META_RUBRICHE).sort(), Object.keys(LINGUE).sort());
  for (const l of Object.keys(LINGUE)) {
    const entries = META_RUBRICHE[l];
    assert.deepEqual(Object.keys(entries).sort(), categories.slice().sort(), l + ": chiavi incomplete");
    assert.equal(new Set(Object.values(entries)).size, categories.length, l + ": descrizioni duplicate");
    const routes = expectedPaths(l);
    for (const type of categories) {
      const value = entries[type];
      const len = [...value].length;
      assert.ok(len >= (l === "ja" ? 55 : 90) && len <= 175,
        l + "/" + type + ": meta description fuori intervallo (" + len + ")");
      const url = routes[type];
      const file = path.join(new URL(dist).pathname, url.slice(1), "index.html");
      const html = fs.readFileSync(file,"utf8");
      assert.equal(meta(html), value, l + "/" + type + ": descrizione HTML diversa");
      assert.ok(html.includes('<link rel="canonical" href="https://soffiacartuccia.it' + url + '">'),
        l + "/" + type + ": canonical assente");
      assert.match(html, /<meta name="robots" content="index, follow[^"]*">/,
        l + "/" + type + ": meta robots non indexable");
      assert.match(html, /<h1\b/, l + "/" + type + ": H1 mancante");
      assert.ok(html.includes('<html lang="' + LINGUE[l].hreflang + '">'),
        l + "/" + type + ": lingua HTML errata");
    }
  }
});


test("metadati del campione audit 22/11: 8 snippet concisi e fedeli alle pagine", () => {
  // Controllo mirato sugli URL effettivamente segnalati, non una soglia Google
  // assoluta per tutte le lingue (in particolare non per il giapponese).
  const urls = [
    "/en/", "/es/", "/en/autore/gianmarco-buono/", "/en/indie/",
    "/en/quiz/", "/es/quiz/", "/ru/quiz/", "/sondaggio/",
  ];
  for (const url of urls) {
    const html=fs.readFileSync(path.join(new URL(dist).pathname,url.slice(1),"index.html"),"utf8");
    const description=meta(html);
    assert.ok(description,url+": meta description mancante");
    const length=[...description].length;
    assert.ok(length >= 120 && length <= 152,
      url+": snippet del campione da ricontrollare ("+length+" caratteri)");
    assert.ok(html.includes('<meta property="og:description" content="'+description+'">'),
      url+": Open Graph non coerente");
  }
});
