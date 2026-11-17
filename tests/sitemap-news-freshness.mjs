import { test } from "node:test";
import assert from "node:assert/strict";
import { generaSitemapNews } from "../strumenti/sitemap-news.mjs";
import onRequest, { config, giornoRoma, filtraSitemapNews, rispostaSitemapNews } from "../netlify/edge-functions/sitemap-news-freshness.js";

const options = {
  oggi: "2026-11-17",
  nomePubblicazione: "Soffia Cartuccia",
  baseUrl: "https://soffiacartuccia.it/",
  lingue: { it: "it", en: "en", ja: "ja" }
};
function articolo(id, giorno, lingua = "it") {
  return { titolo: "Notizia " + id, url: "/articoli/" + id + "/", lingua,
    data: new Date(giorno + "T00:00:00Z"), bozza: false };
}
const xml = generaSitemapNews({ ...options, articoli: [
  articolo("oggi", "2026-11-17"),
  articolo("ieri", "2026-11-16", "en"),
] });
const entries = text => (text.match(/<news:news>/g) || []).length;

test("edge registrata esclusivamente sulla sitemap News", () => {
  assert.equal(config.path, "/sitemap-news.xml");
  assert.equal(typeof onRequest, "function");
});
test("calendario romano e passaggio mezzanotte, con ora legale", () => {
  assert.equal(giornoRoma(new Date("2026-11-17T22:59:59Z")), "2026-11-17");
  assert.equal(giornoRoma(new Date("2026-11-17T23:00:00Z")), "2026-11-18");
  assert.equal(giornoRoma(new Date("2026-06-01T21:59:59Z")), "2026-06-01");
  assert.equal(giornoRoma(new Date("2026-06-01T22:00:00Z")), "2026-06-02");
  assert.equal(giornoRoma(new Date("2026-12-31T23:00:00Z")), "2027-01-01");
});
test("al deploy conserva oggi e ieri senza alterare XML o titoli", () => {
  const filtered = filtraSitemapNews(xml, "2026-11-17");
  assert.equal(entries(filtered), 2);
  assert.match(filtered, /<news:publication_date>2026-11-16<\/news:publication_date>/);
  assert.match(filtered, /<news:language>en<\/news:language>/);
  assert.match(filtered, /<news:title>Notizia oggi<\/news:title>/);
  assert.match(filtered, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(filtered, /<\/urlset>\s*$/);
});
test("il giorno dopo elimina il vecchio URL senza un nuovo deploy", () => {
  const filtered = filtraSitemapNews(xml, "2026-11-18");
  assert.equal(entries(filtered), 1);
  assert.ok(filtered.includes("/articoli/oggi/"));
  assert.ok(!filtered.includes("/articoli/ieri/"));
});
test("dopo due giorni senza deploy restituisce una sitemap vuota valida", () => {
  const filtered = filtraSitemapNews(xml, "2026-11-19");
  assert.equal(entries(filtered), 0);
  assert.match(filtered, /<\/urlset>\s*$/);
  assert.ok(!filtered.includes("<url>"));
});
test("esclude una data futura e voci prive di publication_date", () => {
  const futuro = '<url><loc>https://soffiacartuccia.it/articoli/futuro/</loc><news:news><news:publication_date>2026-11-18</news:publication_date></news:news></url>';
  const sconosciuta = '<url><loc>https://soffiacartuccia.it/articoli/sconosciuta/</loc></url>';
  const modified=xml.replace("</urlset>", futuro+sconosciuta+"</urlset>");
  const filtered=filtraSitemapNews(modified, "2026-11-17");
  assert.equal(entries(filtered), 2);
  assert.ok(!filtered.includes("/futuro/") && !filtered.includes("/sconosciuta/"));
});
test("documenti non News restano invariati", () => {
  assert.equal(filtraSitemapNews("<urlset>qualunque testo</urlset>", "2026-11-18"), "<urlset>qualunque testo</urlset>");
});
test("edge restituisce XML aggiornato, senza cache o ETag vecchi", async () => {
  const upstream = new Response(xml, { status: 200, headers: {
    "content-type": "application/xml", "cache-control": "public, max-age=31536000",
    "etag": '"vecchio"', "content-length": String(xml.length),
  }});
  const response = await rispostaSitemapNews(new Request("https://soffiacartuccia.it/sitemap-news.xml"),
    { next: async () => upstream }, new Date("2026-11-18T12:00:00Z"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("netlify-cdn-cache-control"), "no-store");
  assert.equal(response.headers.get("etag"), null);
  assert.equal(response.headers.get("content-length"), null);
  assert.match(response.headers.get("content-type"), /application\/xml/);
  assert.equal(entries(await response.text()), 1);
});
test("404 e metodi diversi da GET passano alla risorsa originale", async () => {
  const notFound = new Response("Not Found", { status: 404 });
  const a = await rispostaSitemapNews(new Request("https://soffiacartuccia.it/sitemap-news.xml"),
    { next: async () => notFound }, new Date("2026-11-18T12:00:00Z"));
  assert.equal(a, notFound);
  const head = new Response(null, { status: 200 });
  const b = await rispostaSitemapNews(new Request("https://soffiacartuccia.it/sitemap-news.xml", {method:"HEAD"}),
    { next: async () => head }, new Date("2026-11-18T12:00:00Z"));
  assert.equal(b, head);
});
