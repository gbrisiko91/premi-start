import { test } from "node:test";
import assert from "node:assert/strict";
import { generaSitemapNews } from "../strumenti/sitemap-news.mjs";

const config = {
  oggi: "2026-11-16",
  nomePubblicazione: "Soffia Cartuccia",
  baseUrl: "https://soffiacartuccia.it/",
  lingue: { it: "it", en: "en", no: "no", ja: "ja" },
};
const news = (id, data, lingua = "it", extra = {}) => ({
  titolo: `Notizia ${id}`,
  url: `/articoli/${id}/`,
  data: new Date(`${data}T00:00:00Z`),
  lingua,
  bozza: false,
  ...extra,
});

test("genera il documento News XML con gli elementi obbligatori", () => {
  const xml = generaSitemapNews({
    ...config,
    articoli: [news("oggi", "2026-11-16"), news("ieri", "2026-11-15", "en")],
  });
  assert.match(xml, /xmlns:news="http:\/\/www\.google\.com\/schemas\/sitemap-news\/0\.9"/);
  assert.match(xml, /<news:name>Soffia Cartuccia<\/news:name>/);
  assert.match(xml, /<news:language>it<\/news:language>/);
  assert.match(xml, /<news:language>en<\/news:language>/);
  assert.match(xml, /<news:publication_date>2026-11-15<\/news:publication_date>/);
  assert.match(xml, /<news:title>Notizia oggi<\/news:title>/);
  assert.match(xml, /<loc>https:\/\/soffiacartuccia\.it\/articoli\/oggi\/<\/loc>/);
});

test("ignora bozze, pubblicazioni vecchie, future, lingue sconosciute e file senza URL", () => {
  const xml = generaSitemapNews({
    ...config,
    articoli: [
      news("pubblico", "2026-11-16"),
      news("vecchio", "2026-11-14"),
      news("futuro", "2026-11-17"),
      news("bozza", "2026-11-16", "it", { bozza: true }),
      news("sconosciuto", "2026-11-16", "xx"),
      news("senza-url", "2026-11-16", "it", { url: "" }),
    ],
  });
  assert.match(xml, /pubblico/);
  for (const escluso of ["vecchio", "futuro", "bozza", "sconosciuto", "senza-url"])
    assert.ok(!xml.includes(`/${escluso}/`), `Voce erroneamente inclusa: ${escluso}`);
  assert.equal((xml.match(/<news:news>/g) ?? []).length, 1);
});

test("non confonde data di ultimo aggiornamento con prima pubblicazione", () => {
  const xml = generaSitemapNews({
    ...config,
    articoli: [news("aggiornato", "2026-11-01", "it", { aggiornato: new Date("2026-11-16") })],
  });
  assert.ok(!xml.includes("aggiornato/"));
});

test("escapa titoli XML e rispetta il limite di 1000 news", () => {
  const articoli = Array.from({ length: 1005 }, (_, i) =>
    news(`notizia-${i}`, "2026-11-16", "no", { titolo: 'A & B < C "D"' }));
  const xml = generaSitemapNews({ ...config, articoli });
  assert.equal((xml.match(/<news:news>/g) ?? []).length, 1000);
  assert.match(xml, /<news:language>no<\/news:language>/);
  assert.match(xml, /<news:title>A &amp; B &lt; C &quot;D&quot;<\/news:title>/);
});

test("una sitemap News vuota è comunque XML valido", () => {
  const xml = generaSitemapNews({ ...config, articoli: [] });
  assert.match(xml, /^<\?xml version="1\.0"/);
  assert.match(xml, /<\/urlset>\n$/);
  assert.ok(!xml.includes("<url>"));
});
