import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { localizzaLinkArticoli } from "../strumenti/localizza-link-articoli.mjs";
import { LINGUE } from "../lingue.mjs";

const root = path.resolve(new URL("../dist/", import.meta.url).pathname);

test("localizza solo l'href di articoli italiani effettivamente tradotti", () => {
  const it = new Map([["/articoli/italiano/", "article-1"], ["/articoli/solo-it/", "article-2"]]);
  const en = new Map([["article-1", "/en/articles/english/"]]);
  const input = `<a class="test" href="/articoli/italiano/?utm=x#note">leggi</a>
  <a href='/articoli/italiano/'>single</a>
  <a href="/articoli/solo-it/">originale disponibile</a>
  <a href="https://example.net/articoli/italiano/">esterno</a>
  <a href="/articoli/italiano/mancante/">non equivalenza</a>
  <img src="/articoli/italiano/">`;
  const result = localizzaLinkArticoli(input, "en", it, en);
  assert.ok(result.includes('href="/en/articles/english/?utm=x#note"'));
  assert.ok(result.includes("href='/en/articles/english/'"));
  assert.ok(result.includes('href="/articoli/solo-it/"'), "non eliminare fallback verso italiano");
  assert.ok(result.includes('href="https://example.net/articoli/italiano/"'), "non alterare siti esterni");
  assert.ok(result.includes('href="/articoli/italiano/mancante/"'), "non cambiare URL non corrispondenti");
  assert.ok(result.includes('<img src="/articoli/italiano/">'), "non modificare asset");
  assert.equal(localizzaLinkArticoli(input, "it", it, en), input, "non alterare originale italiano");
  assert.equal(localizzaLinkArticoli(input, "en", it, new Map()), input, "non inventare traduzioni mancanti");
});

test("Fortnite e GTA 6: il lettore trova la stessa lingua in tutte le otto traduzioni", () => {
  const it = JSON.parse(fs.readFileSync(path.join(root, "indice-it.json"), "utf8"));
  const italiane = new Map(it.map((a) => [a.id, a.url]));
  const casi = [
    { sorgente:"2026-11-04", id:"gta-6-preload-peso", destinazione:"the-duskbloods-rinvio-2027" },
    { sorgente:"2026-11-05", id:"fortnite-gettone-negozio-pirata", destinazione:"itch-io-giochi-ia-eliminati" },
  ];
  let linkLocalizzati = 0;
  for (const l of Object.keys(LINGUE).filter((x) => x !== "it")) {
    const indice = JSON.parse(fs.readFileSync(path.join(root, "indice-" + l + ".json"), "utf8"));
    const mappa = new Map(indice.map((a) => [a.id, a.url]));
    for (const { id, destinazione } of casi) {
      const sorgente = mappa.get(id);
      const tradotto = mappa.get(destinazione);
      const italiano = italiane.get(destinazione);
      assert.ok(sorgente && tradotto && italiano, l + ": manca un articolo necessario al test");
      const html = fs.readFileSync(path.join(root, sorgente.slice(1), "index.html"), "utf8");
      const testo = html.split('<div class="testo">')[1]?.split("</div>")[0] || "";
      assert.ok(testo.includes('href="' + tradotto + '"'),
        l + "/" + id + ": link interno non localizzato verso " + tradotto);
      assert.ok(!testo.includes('href="' + italiano + '"'),
        l + "/" + id + ": link italiano rimasto nel corpo");
      linkLocalizzati++;
    }
  }
  assert.equal(linkLocalizzati, 16, "Campione multilingua incompleto");
});
