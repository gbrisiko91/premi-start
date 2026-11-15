import { test } from "node:test";
import assert from "node:assert/strict";
import { selezionaCorrelati } from "../strumenti/articoli-correlati.mjs";

const articolo = (id, { tag = [], categoria = "console", lingua = "it",
  bozza = false, data = "2026-11-15" } = {}) => ({
  id, tag, categoria, lingua, bozza, data: new Date(data + "T12:00:00Z"),
});

test("un articolo sullo stesso gioco precede una notizia generica della categoria", () => {
  const letto = articolo("gta6-mappa", { tag: ["gta-6", "rockstar-games"] });
  const generico = articolo("console-nuova", { data: "2026-11-16", tag: ["hardware"] });
  const gtaInIndustria = articolo("gta6-industria", {
    categoria: "industria", tag: ["gta-6"], data: "2026-11-10",
  });
  assert.deepEqual(selezionaCorrelati(letto, [letto, generico, gtaInIndustria]),
    [gtaInIndustria, generico]);
});

test("nasconde le bozze, gli articoli identici e le altre lingue", () => {
  const letto = articolo("gta6-mappa", { tag: ["gta-6"] });
  const pubblicato = articolo("gta6-copia", { tag: ["gta-6"] });
  const bozza = articolo("gta6-rumor", { tag: ["gta-6"], bozza: true });
  const inglese = articolo("gta6-testo-en", { tag: ["gta-6"], lingua: "en" });
  const duplicato = articolo("gta6-mappa", { tag: ["gta-6"] });
  assert.deepEqual(selezionaCorrelati(letto,
    [letto, pubblicato, bozza, inglese, duplicato]), [pubblicato]);
});

test("in assenza di tag comuni usa solo articoli della stessa categoria", () => {
  const letto = articolo("zelda", { tag: ["zelda"] });
  const playstation = articolo("ps5", { tag: ["ps5"] });
  const unrelated = articolo("pc-gpu", { categoria: "pc", tag: ["gpu"] });
  assert.deepEqual(selezionaCorrelati(letto, [unrelated, playstation]), [playstation]);
});

test("ordina tag condivisi prima della categoria e usa la data a parità di punteggio", () => {
  const letto = articolo("gta6", { tag: ["gta-6", "rockstar-games"] });
  const extra = articolo("gta6-musica", {
    categoria: "industria", tag: ["gta-6", "rockstar-games"], data: "2026-11-10",
  });
  const recente = articolo("gta6-news", {
    tag: ["gta-6"], data: "2026-11-15",
  });
  const menoRecente = articolo("gta6-old", {
    tag: ["gta-6"], data: "2026-11-01",
  });
  assert.deepEqual(selezionaCorrelati(letto, [menoRecente, recente, extra], 2),
    [extra, recente]);
});

test("non conta due volte un tag duplicato, gestisce limiti e argomenti vuoti", () => {
  const letto = articolo("gta6", { tag: ["gta-6"] });
  const a = articolo("a", { tag: ["gta-6", "gta-6"], categoria: "pc" });
  const b = articolo("b", { tag: ["gta-6"], categoria: "console" });
  assert.deepEqual(selezionaCorrelati(letto, [a, b]), [b, a]);
  assert.deepEqual(selezionaCorrelati(letto, [b], 0), []);
  assert.deepEqual(selezionaCorrelati(null, [b]), []);
});
