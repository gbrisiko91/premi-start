import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import matter from "gray-matter";
import { LINGUE } from "../lingue.mjs";

const file = "2026-11-04-gta-6-preload-peso.md";
const fonte = "https://support.rockstargames.com/articles/29jV3Cv2cCgvwM1XgtMO5o/grand-theft-auto-vi-regional-pre-load-and-release-times-on-playstation-5-and-xbox-series-x-or-s";
const scaduti = [
  "L'orario su Xbox non è stato ancora comunicato.",
  "The Xbox time has not yet been announced.",
  "Die Uhrzeit für Xbox wurde noch nicht bekanntgegeben.",
  "La hora en Xbox todavía no se ha comunicado.",
  "Tidspunktet på Xbox er ennå ikke kunngjort.",
  "Tiden för Xbox har ännu inte meddelats.",
  "Xboxin kellonaikaa ei ole vielä kerrottu.",
  "Xboxの時刻はまだ発表されていません。",
  "Время для Xbox пока не объявлено."
];
test("Rockstar ufficiale: mezzanotte locale 19 novembre anche su Xbox, in tutte le lingue", () => {
  const italiano = matter(fs.readFileSync("content/articoli/" + file,"utf8"));
  assert.equal(italiano.data.data.toISOString().slice(0,10),"2026-11-04");
  assert.equal(italiano.data.aggiornato.toISOString().slice(0,10),"2026-11-17");
  assert.ok(italiano.data.fonti.some(f=>f.url===fonte));
  for(const l of Object.keys(LINGUE)) {
    const relative = l==="it" ? "content/articoli/"+file : "content/traduzioni/"+l+"/"+file;
    const source=fs.readFileSync(relative,"utf8");
    for(const vecchio of scaduti) assert.ok(!source.includes(vecchio),l+": orario Xbox non aggiornato");
    const indice=JSON.parse(fs.readFileSync("dist/indice-"+l+".json","utf8"));
    const a=indice.find(x=>x.id==="gta-6-preload-peso");
    assert.ok(a,"Articolo tradotto mancante: "+l);
    const html=fs.readFileSync("dist"+a.url+"index.html","utf8");
    assert.ok(html.includes(fonte),l+": fonte ufficiale non in pagina");
    // La versione inglese è stata revisionata autonomamente il 22 novembre;
    // le altre versioni mantengono la data del 17 senza falsa propagazione.
    const expectedDate=l==="en"?"2026-11-22":"2026-11-17";
    assert.ok(html.includes(`"dateModified":"${expectedDate}T00:00:00.000Z"`),
      l+": data aggiornamento incoerente");
  }
});
