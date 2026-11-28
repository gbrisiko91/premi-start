// Collaudo del carosello di apertura della homepage (issue #92).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  giornoRoma, giornoPrima, selezionaCarosello, filtraGiorniClient, urlImmagineSicuro, TESTI_CAROSELLO, FALLBACK_CAROSELLO,
} from "../strumenti/carosello-home.mjs";
import { LINGUE } from "../lingue.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIST = path.join(ROOT, "dist");
const art = (id, data, extra = {}) => ({ id, titolo: `Titolo ${id}`, url: `/articoli/${id}/`, data: new Date(data), bozza: false, ...extra });

test("giorno di calendario a Roma: date senza orario, mezzanotte e ora legale", () => {
  assert.equal(giornoRoma(new Date("2026-11-28")), "2026-11-28"); // AAAA-MM-GG del front matter
  assert.equal(giornoRoma(new Date("2026-11-27T23:30:00Z")), "2026-11-28"); // 00:30 a Roma (CET)
  assert.equal(giornoRoma(new Date("2026-11-27T22:59:00Z")), "2026-11-27"); // 23:59 a Roma
  assert.equal(giornoRoma(new Date("2026-03-28T23:30:00Z")), "2026-03-29"); // notte del passaggio all'ora legale
  assert.equal(giornoRoma(new Date("2026-03-29T21:59:00Z")), "2026-03-29"); // 23:59 CEST
  assert.equal(giornoRoma(new Date("2026-03-29T22:00:00Z")), "2026-03-30"); // 00:00 CEST
  assert.equal(giornoRoma(new Date("2026-10-24T22:30:00Z")), "2026-10-25"); // 00:30 CEST prima del ritorno all'ora solare
  assert.equal(giornoRoma(new Date("2026-10-25T22:30:00Z")), "2026-10-25"); // 23:30 CET
  assert.equal(giornoRoma(new Date("non valida")), "");
});

test("giorno precedente: aritmetica di calendario, anche fra mesi, anni e ora legale", () => {
  assert.equal(giornoPrima("2026-11-28"), "2026-11-27");
  assert.equal(giornoPrima("2026-03-30"), "2026-03-29");
  assert.equal(giornoPrima("2026-10-26"), "2026-10-25");
  assert.equal(giornoPrima("2026-03-01"), "2026-02-28");
  assert.equal(giornoPrima("2028-03-01"), "2028-02-29");
  assert.equal(giornoPrima("2027-01-01"), "2026-12-31");
});

test("oggi + ieri a Roma, ordine del sito, niente bozze né articoli futuri, nessun limite", () => {
  const lista = [
    art("futuro", "2026-11-29"),
    art("bozza-oggi", "2026-11-28", { bozza: true }),
    art("oggi-1", "2026-11-28"),
    art("oggi-2", "2026-11-28"),
    ...Array.from({ length: 7 }, (_, i) => art(`ieri-${i}`, "2026-11-27")),
    art("altroieri", "2026-11-26"),
  ];
  const s = selezionaCarosello(lista, { oggi: "2026-11-28" });
  assert.equal(s.recenti, true);
  assert.deepEqual(s.voci.map((x) => x.a.id), ["oggi-1", "oggi-2", ...Array.from({ length: 7 }, (_, i) => `ieri-${i}`)]);
  assert.equal(s.candidati.length, 9, "nessun ripiego in più quando le recenti superano 5");
});

test("una finestra di calendario, non 48 ore: a mezzanotte l'altroieri esce", () => {
  const lista = [art("ieri-sera", "2026-11-27T22:30:00Z"), art("altroieri-sera", "2026-11-26T22:59:00Z")];
  // ieri-sera = 23:30 del 27 a Roma; altroieri-sera = 23:59 del 26.
  const s = selezionaCarosello(lista, { oggi: "2026-11-28" });
  assert.deepEqual(s.voci.map((x) => x.a.id), ["ieri-sera"]);
});

test("ripiego: nessuna notizia di oggi o ieri → ultime 5 pubblicate, con le date reali", () => {
  const lista = Array.from({ length: 8 }, (_, i) => art(`v${i}`, `2026-11-${String(20 - i).padStart(2, "0")}`));
  const s = selezionaCarosello([art("b", "2026-11-28", { bozza: true }), ...lista], { oggi: "2026-11-28" });
  assert.equal(s.recenti, false);
  assert.deepEqual(s.voci.map((x) => x.a.id), ["v0", "v1", "v2", "v3", "v4"]);
  assert.equal(s.voci[0].giorno, "2026-11-20");
});

test("zero, una e due notizie; candidati nascosti per il cambio di data", () => {
  assert.equal(selezionaCarosello([], { oggi: "2026-11-28" }).voci.length, 0);
  assert.equal(selezionaCarosello([art("b", "2026-11-28", { bozza: true })], { oggi: "2026-11-28" }).voci.length, 0);
  const una = selezionaCarosello([art("a", "2026-11-28"), art("x", "2026-11-01"), art("y", "2026-10-30")], { oggi: "2026-11-28" });
  assert.deepEqual(una.voci.map((x) => x.a.id), ["a"]);
  assert.deepEqual(una.candidati.map((x) => x.a.id), ["a", "x", "y"], "il ripiego deve già essere nell'HTML");
  assert.throws(() => selezionaCarosello([], { oggi: "28/11/2026" }));
});

test("la regola del browser coincide con quella del build", () => {
  const giorni = ["2026-11-28", "2026-11-28", "2026-11-27", "2026-11-20", "2026-11-19", "2026-11-18", "2026-11-17"];
  assert.deepEqual(filtraGiorniClient(giorni, "2026-11-28"), { indici: [0, 1, 2], recenti: true });
  assert.deepEqual(filtraGiorniClient(giorni, "2026-11-29"), { indici: [0, 1], recenti: true });
  assert.deepEqual(filtraGiorniClient(giorni, "2026-11-30"), { indici: [0, 1, 2, 3, 4], recenti: false });
  // Orologio del lettore indietro rispetto al build: non nasconde nulla e non svuota il carosello.
  assert.deepEqual(filtraGiorniClient(giorni, "2026-11-27").indici, [0, 1, 2]);
  const client = fs.readFileSync(path.join(ROOT, "public", "carosello.js"), "utf8");
  assert.match(client, /Europe\/Rome/);
  assert.match(client, />= ieri/);
  assert.doesNotMatch(client, /fetch\(|XMLHttpRequest|https?:\/\//, "nessuna chiamata di rete o servizio esterno");
});

test("immagini solo HTTPS o locali", () => {
  assert.equal(urlImmagineSicuro("https://cdn.example/x.jpg"), "https://cdn.example/x.jpg");
  assert.equal(urlImmagineSicuro("/media/x.png"), "/media/x.png");
  for (const u of ["javascript:alert(1)", "http://x/y.jpg", "//evil/x.jpg", "data:image/png;base64,AA", 'https://x/"onerror=1', ""]) assert.equal(urlImmagineSicuro(u), "");
});

test("testi del carosello presenti in tutte e nove le lingue", () => {
  const chiavi = Object.keys(TESTI_CAROSELLO.it);
  assert.deepEqual(Object.keys(TESTI_CAROSELLO).sort(), Object.keys(LINGUE).sort());
  for (const [l, t] of Object.entries(TESTI_CAROSELLO)) {
    assert.deepEqual(Object.keys(t), chiavi, l);
    for (const k of chiavi) assert.ok(String(t[k]).trim(), `${l}.${k}`);
    assert.ok(t.posizione.includes("{n}") && t.posizione.includes("{tot}"), l);
  }
});

const homeDi = (l) => fs.readFileSync(path.join(DIST, l === "it" ? "" : l, "index.html"), "utf8");

test("homepage generate: un carosello accessibile e indicizzabile per lingua", () => {
  for (const l of Object.keys(LINGUE)) {
    const h = homeDi(l);
    const blocco = h.slice(h.indexOf("data-carosello "), h.indexOf("data-carosello-controlli"));
    const slide = [...blocco.matchAll(/<article class="carosello-slide"[^>]*>/g)].map((m) => m[0]);
    assert.ok(slide.length >= 1, `${l}: carosello vuoto`);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, `${l}: un solo H1`);
    assert.match(slide[0], /data-giorno="\d{4}-\d{2}-\d{2}"/);
    assert.doesNotMatch(slide[0], /hidden/, `${l}: la prima notizia deve essere visibile senza JS`);
    assert.match(h, /role="region" aria-roledescription="[^"]+" aria-label="[^"]+"/);
    assert.match(h, /data-carosello-controlli hidden/, `${l}: controlli nascosti finché il JS non li attiva`);
    assert.match(h, /<script src="\/carosello\.js" defer><\/script>/);
    assert.doesNotMatch(blocco, /aria-live="(polite|assertive)"/, `${l}: niente regione live durante l'autoplay`);
    assert.ok((blocco.match(/loading="eager"/g) || []).length <= 1, `${l}: al massimo un'immagine eager`);
    const oggi = h.match(/data-oggi="(\d{4}-\d{2}-\d{2})"/)?.[1];
    assert.ok(oggi, `${l}: manca data-oggi`);
    const giorni = slide.map((s) => s.match(/data-giorno="([^"]+)"/)[1]);
    assert.ok(giorni.every((g) => g <= oggi), `${l}: articolo futuro nel carosello`);
    assert.deepEqual([...giorni].sort().reverse(), giorni, `${l}: ordine per data`);
    assert.doesNotMatch(blocco, /segno-bozza/, `${l}: bozza nel carosello`);
    const pre = l === "it" ? "/" : `/${l}/`;
    for (const [, href] of blocco.matchAll(/<h[12][^>]*carosello-titolo[^>]*><a href="([^"]+)"/g)) {
      assert.ok(href.startsWith(pre) && !href.startsWith("//"), `${l}: link fuori lingua ${href}`);
      assert.ok(fs.existsSync(path.join(DIST, href, "index.html")), `${l}: pagina inesistente ${href}`);
    }
    for (const [, src] of blocco.matchAll(/<img[^>]* src="([^"]+)"/g)) assert.ok(urlImmagineSicuro(src.replace(/&amp;/g, "&")), `${l}: immagine non sicura ${src}`);
  }
});

test("il carosello non altera canonical, robots e sitemap della homepage", () => {
  const h = homeDi("it");
  assert.match(h, /<link rel="canonical" href="https:\/\/soffiacartuccia\.it\/">/);
  assert.doesNotMatch(h, /<meta name="robots" content="[^"]*noindex/);
  const sitemap = fs.readFileSync(path.join(DIST, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/soffiacartuccia\.it\/<\/loc>/);
  assert.equal(FALLBACK_CAROSELLO, 5);
});
