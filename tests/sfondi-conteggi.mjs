import test from "node:test";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { SFONDI, sfondoValido, giornoRoma, nuovaChiave, riassumiClic } from "../netlify/sfondi-conteggi.mjs";

test("accettiamo solo i tre sfondi esistenti", () => {
  assert.equal(Object.keys(SFONDI).length, 3);
  assert.equal(sfondoValido("cartuccia"), true);
  assert.equal(sfondoValido("mappa"), true);
  assert.equal(sfondoValido("press-start"), true);
  for (const id of ["", "sconosciuto", "../segreti", "__proto__", "constructor"]) assert.equal(sfondoValido(id), false);
});

test("giorno e data sono calcolati nel fuso di Roma", () => {
  assert.equal(giornoRoma(new Date("2026-11-20T22:30:00Z")), "2026-11-20");
  assert.equal(giornoRoma(new Date("2026-11-20T23:30:00Z")), "2026-11-21");
});

test("ogni clic usa una chiave distinta e priva di IP o identificatori personali", () => {
  const when = new Date("2026-11-20T19:15:00Z");
  const a = nuovaChiave("cartuccia", when), b = nuovaChiave("cartuccia", when);
  assert.notEqual(a, b);
  assert.match(a, /^v1\/2026-11-20\/cartuccia\/\d{13}-[\da-f-]{36}$/);
  assert.throws(() => nuovaChiave("traversal/../../"), /sconosciuto/);
});

test("conteggi aggregati per sfondo e per giorno senza attribuire persone uniche", () => {
  const a = nuovaChiave("cartuccia", new Date("2026-11-20T11:15:00Z"));
  const b = nuovaChiave("mappa", new Date("2026-11-20T12:15:00Z"));
  const c = nuovaChiave("mappa", new Date("2026-11-21T12:15:00Z"));
  const result = riassumiClic([{key:a},{key:b},{key:c},{key:"v1/x/not-valid"}], "2026-11-20");
  assert.equal(result.totale, 3);
  assert.equal(result.oggi, 2);
  assert.deepEqual(result.perSfondo, {"cartuccia":1, "mappa":2, "press-start":0});
  assert.equal(result.perGiorno["2026-11-21"], 1);
});

test("i tre download originali restano presenti e lo script è caricato solo nella pagina sfondi", () => {
  const sfondi = readFileSync(new URL("../dist/sfondi/index.html", import.meta.url), "utf8");
  const home = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(sfondi, /<script src="\/sfondi-contatore\.js" defer><\/script>/);
  assert.doesNotMatch(home, /sfondi-contatore\.js/);
  for (const nome of ["01-cartuccia", "02-mappa", "03-press-start"]) {
    assert.ok(sfondi.includes("/sfondi/soffiacartuccia-sfondo-" + nome + ".png"), nome + " deve scaricarsi direttamente");
  }
});
