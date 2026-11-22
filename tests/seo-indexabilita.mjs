// Regression SEO: distinct template titles, crawlable articles, canonical and sitemap.
// Does not claim Google has indexed or will index these URLs.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import config from "../sito.config.mjs";
import { LINGUE } from "../lingue.mjs";

const ROOT = new URL("../dist/", import.meta.url);
const html = (p) => fs.readFileSync(new URL(p, ROOT), "utf8");
const title = (s) => s.match(/<title>([^<]*)<\/title>/)?.[1] || "";
const description = (s) => s.match(/<meta name="description" content="([^"]*)"/)?.[1] || "";
const prefix = (l) => l === "it" ? "" : l + "/";

test("homepage: meta descrizioni specifiche e non il solo slogan", () => {
  for (const l of Object.keys(LINGUE)) {
    const d = description(html(prefix(l) + "index.html"));
    assert.ok(d.length >= (l === "ja" ? 55 : 70), `${l}: descrizione troppo breve (${d.length})`);
    assert.ok(d.length <= 170, `${l}: descrizione troppo lunga (${d.length})`);
  }
});
test("homepage: title concisi nelle cinque lingue segnalate dall'audit del 22/11", () => {
  const titles = {
    it: /notizie e guide videogiochi/i,
    en: /video game news and guides/i,
    de: /gaming-news und retrogames/i,
    es: /noticias y guías de videojuegos/i,
    ru: /игровые новости и ретро/i,
  };
  for (const [l, re] of Object.entries(titles)) {
    const page = html(prefix(l) + "index.html");
    const t = title(page);
    assert.ok(t.includes("Soffia Cartuccia"), `${l}: nome della testata assente`);
    assert.match(t,re,`${l}: tema della homepage assente`);
    assert.ok(t.length <= 60, `${l}: titolo troppo lungo (${t.length} caratteri)`);
    assert.ok(page.includes('<meta name="robots" content="index, follow'), `${l}: pagina non indicizzabile`);
    assert.ok(page.includes('rel="canonical"'), `${l}: canonical mancante`);
  }
  const esAuthor = title(html("es/autore/gianmarco-buono/index.html"));
  assert.ok(esAuthor.length <= 62, `Autore ES: title troppo lungo (${esAuthor.length})`);
  assert.match(esAuthor,/Gianmarco Buono/);
});

test("niente title duplicati nelle due coppie individuate nell'audit", () => {
  const tDe = title(html("de/autore/gianmarco-buono/index.html"));
  const tEs = title(html("es/autore/gianmarco-buono/index.html"));
  const tNo = title(html("no/quiz/index.html"));
  const tSv = title(html("sv/quiz/index.html"));
  assert.notEqual(tDe, tEs);
  assert.notEqual(tNo, tSv);
  for (const t of [tDe,tEs,tNo,tSv]) assert.ok(t.includes("Soffia Cartuccia"));
});
test("ogni articolo pubblicato ha canonical univoco, robots indexable e URL nella sitemap", () => {
  const sitemap = html("sitemap.xml");
  const loc = new Set([...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1].replaceAll("&amp;", "&")));
  for (const l of Object.keys(LINGUE)) {
    const indice = JSON.parse(html(`indice-${l}.json`));
    for (const a of indice) {
      const page = html(a.url.replace(/^\//, "") + "index.html");
      const full = config.url.replace(/\/$/,"") + a.url;
      assert.ok(loc.has(full), `URL articolo assente nella sitemap: ${full}`);
      assert.ok(page.includes(`<link rel="canonical" href="${full}">`), `Canonical errato: ${full}`);
      assert.match(page, /<meta name="robots" content="index, follow[^"]*">/, `Articolo non indicizzabile: ${full}`);
      assert.ok(!page.includes("NOTE PER LA REDAZIONE"), `Note interne in pagina: ${full}`);
    }
  }
});
test("robots.txt espone sitemap globale e News, senza bloccare Google", () => {
  const robots = html("robots.txt");
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
  assert.ok(robots.includes("Sitemap: " + config.url + "/sitemap.xml"));
  assert.ok(robots.includes("Sitemap: " + config.url + "/sitemap-news.xml"));
});
