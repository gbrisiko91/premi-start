// Collaudo del carosello di apertura della homepage (issue #92).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import {
  giornoRoma, giornoIstanteRoma, giornoPrima, selezionaCarosello, urlImmagineSicuro, TESTI_CAROSELLO, FALLBACK_CAROSELLO,
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

// Il file effettivamente servito ai lettori, eseguito senza DOM: espone solo le regole pure.
function caricaClient() {
  const sandbox = { Intl, Date, Math, Number, String, Array, Object, RegExp };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "public", "carosello.js"), "utf8"), sandbox, { filename: "carosello.js" });
  assert.ok(sandbox.SoffiaCarosello, "public/carosello.js non espone le regole");
  return sandbox.SoffiaCarosello;
}

test("browser: data a Roma con formatToParts, anche a mezzanotte e con l'ora legale", () => {
  const c = caricaClient();
  const casi = ["2026-11-27T22:59:00Z", "2026-11-27T23:30:00Z", "2026-03-28T23:30:00Z", "2026-03-29T22:00:00Z", "2026-10-24T22:30:00Z", "2026-10-25T22:30:00Z", "2026-12-31T23:00:00Z"];
  for (const iso of casi) assert.equal(c.giornoRoma(new Date(iso)), giornoIstanteRoma(new Date(iso)), iso);
  assert.equal(c.giornoRoma(new Date("2026-12-31T23:00:00Z")), "2027-01-01");
  assert.equal(c.giornoRoma(new Date("x")), "");
  const sorgente = fs.readFileSync(path.join(ROOT, "public", "carosello.js"), "utf8");
  assert.match(sorgente, /formatToParts/);
  assert.doesNotMatch(sorgente, /en-CA/);
  assert.doesNotMatch(sorgente, /fetch\(|XMLHttpRequest|https?:\/\//, "nessuna chiamata di rete o servizio esterno");
  for (const g of ["2026-03-30", "2026-03-01", "2027-01-01", "2028-03-01"]) assert.equal(c.giornoPrima(g), giornoPrima(g));
});

test("browser: regola al cambio di data, con riferimento al massimo fra giorno del lettore e del build", () => {
  const { regola } = caricaClient();
  const giorni = ["2026-11-28", "2026-11-28", "2026-11-27", "2026-11-20", "2026-11-19", "2026-11-18", "2026-11-17"];
  const r = (oggi, build = "2026-11-28") => { const x = regola(giorni, oggi, build, 5); return { indici: [...x.indici], recenti: x.recenti, oggi: x.oggi }; };
  assert.deepEqual(r("2026-11-28"), { indici: [0, 1, 2], recenti: true, oggi: "2026-11-28" });
  assert.deepEqual(r("2026-11-29"), { indici: [0, 1], recenti: true, oggi: "2026-11-29" });
  assert.deepEqual(r("2026-11-30"), { indici: [0, 1, 2, 3, 4], recenti: false, oggi: "2026-11-30" });
  // Orologio del lettore indietro (anche di giorni) o illeggibile: vale il giorno del build.
  assert.deepEqual(r("2026-11-27"), { indici: [0, 1, 2], recenti: true, oggi: "2026-11-28" });
  assert.deepEqual(r("2026-11-01"), { indici: [0, 1, 2], recenti: true, oggi: "2026-11-28" });
  assert.deepEqual(r(""), { indici: [0, 1, 2], recenti: true, oggi: "2026-11-28" });
  assert.deepEqual([...regola(["2026-11-28"], "2027-01-10", "2026-11-28", 5).indici], [0], "una sola slide: mai vuoto");
});

test("build e browser scelgono le stesse notizie (1000 casi casuali)", () => {
  const { regola } = caricaClient();
  let seme = 92;
  const caso = () => (seme = (seme * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let k = 0; k < 1000; k++) {
    const oggi = `2026-${String(1 + Math.floor(caso() * 12)).padStart(2, "0")}-${String(1 + Math.floor(caso() * 28)).padStart(2, "0")}`;
    let t = Date.parse(`${oggi}T00:00:00Z`) + 864e5;
    const lista = Array.from({ length: Math.floor(caso() * 12) }, (_, i) => {
      t -= Math.floor(caso() * 2.5) * 864e5;
      return art(`a${i}`, new Date(t).toISOString().slice(0, 10), { bozza: caso() < 0.1 });
    });
    const build = selezionaCarosello(lista, { oggi });
    if (!build.voci.length) continue;
    const giorni = build.candidati.map((x) => x.giorno);
    const client = regola(giorni, oggi, oggi, FALLBACK_CAROSELLO);
    assert.deepEqual([...client.indici].map((i) => build.candidati[i].a.id), build.voci.map((x) => x.a.id), `caso ${k} (${oggi})`);
    assert.equal(client.recenti, build.recenti);
    // Il giorno dopo, senza deploy: stesso risultato di un build fatto quel giorno con gli stessi articoli.
    const domani = new Date(Date.parse(`${oggi}T12:00:00Z`) + 864e5).toISOString().slice(0, 10);
    // Le notizie con data futura al momento del build non sono nell'HTML: arrivano con il deploy successivo.
    const buildDomani = selezionaCarosello(lista.filter((a) => giornoRoma(a.data) <= oggi), { oggi: domani });
    const clientDomani = regola(giorni, domani, oggi, FALLBACK_CAROSELLO);
    assert.deepEqual([...clientDomani.indici].map((i) => build.candidati[i].a.id), buildDomani.voci.map((x) => x.a.id), `caso ${k} il giorno dopo`);
  }
});

test("immagini solo HTTPS o locali dello stesso sito", () => {
  for (const u of ["https://cdn.example/x.jpg", "https://cdn.example/x.jpg?w=1&h=2", "/media/x.png", "/copertine/retro-1.png", "/a%5Cb.png"]) assert.equal(urlImmagineSicuro(u), u, u);
  const rifiutati = [
    "javascript:alert(1)", "JAVASCRIPT:alert(1)", "http://x/y.jpg", "//evil/x.jpg", "data:image/png;base64,AA", 'https://x/"onerror=1', "",
    "/\\evil.example/x.png", "\\\\evil.example/x.png", "https://x/a\\b.png", "/x\ty.png", "/x\ny.png", "/x\u0000.png", "/x\u007f.png",
    " /x.png", "/x y.png", "https://user:pw@example.com/x.png", "https:/example.com/x.png", "https:example.com/x.png", "ftp://example.com/x.png",
  ];
  for (const u of rifiutati) assert.equal(urlImmagineSicuro(u), "", JSON.stringify(u));
  // Coerenza con il browser: ciò che passa resta nello stesso sito o in HTTPS anche dopo il parsing URL.
  for (const u of ["/media/x.png", "https://cdn.example/x.jpg"]) {
    const url = new URL(urlImmagineSicuro(u), "https://soffiacartuccia.it/");
    assert.ok(url.protocol === "https:" && (u.startsWith("https:") || url.origin === "https://soffiacartuccia.it"));
  }
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
