import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../dist/instagram/index.html", import.meta.url), "utf8");
const articoli = JSON.parse(fs.readFileSync(new URL("../dist/indice-it.json", import.meta.url), "utf8"));
const mainSection = html.slice(html.indexOf('<section class="bio"'), html.indexOf('<nav class="bio-scorciatoie"'));

test("landing Instagram generata, coerente con il noindex e i link pubblici", () => {
  assert.ok(html.startsWith("<!doctype html>"));
  assert.match(html, /<meta name="robots" content="noindex, follow">/);
  assert.match(html, /href="\/sfondi\/\?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=missione-5k-2500"/);
  assert.match(html, /id="bio-premio-titolo"/);
  assert.match(html, /soffiacartuccia-sfondo-01-cartuccia\.png/);
  assert.ok(html.indexOf('id="bio-premio-titolo"') < html.indexOf('id="bio-ultime-titolo"'),
    "Il premio deve apparire prima delle notizie");
});

test("GTA 6 seleziona fino a tre articoli verificati realmente presenti nell'indice", () => {
  const gta6 = articoli.filter((a) => a.tag.some((tag) => String(tag).toLowerCase() === "gta-6")).slice(0,3);
  assert.ok(gta6.length >= 1);
  for (const item of gta6) {
    const href = item.url + "?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=link-in-bio";
    assert.ok(mainSection.includes('href="' + href + '"'), "GTA 6 non collegato: " + item.url);
    assert.equal(mainSection.split('href="' + href + '"').length - 1, 1,
      "Notizia GTA 6 ripetuta nella landing: " + item.url);
  }
  assert.ok(html.indexOf('id="bio-gta6-titolo"') < html.indexOf('id="bio-ultime-titolo"'));
});

test("i collegamenti agli articoli restano interni e gli inviti a quiz/newsletter esistono", () => {
  assert.match(html, /href="\/quiz\/\?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=link-in-bio"/);
  assert.match(html, /id="newsletter"/);
  assert.match(html, /href="\/archivio\/\?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=link-in-bio"/);
  assert.doesNotMatch(mainSection, /href="https?:\/\//);
});
