import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { LINGUE } from "../lingue.mjs";
import { GUIDE_RUBRICHE } from "../strumenti/guide-rubriche.mjs";

const polls={it:"sondaggio",en:"poll",de:"umfrage",es:"encuesta",no:"avstemning",sv:"omrostning",fi:"kysely",ja:"poll",ru:"opros"};
test("quiz e sondaggio hanno istruzioni locali e percorsi funzionanti in nove lingue",()=>{
  assert.deepEqual(Object.keys(GUIDE_RUBRICHE).sort(),Object.keys(LINGUE).sort());
  for(const l of Object.keys(LINGUE)){
    const prefix=l==="it"?"":l+"/";
    for(const [tipo,slug] of [["quiz","quiz"],["poll",polls[l]]]){
      const texts=GUIDE_RUBRICHE[l][tipo];
      assert.equal(texts.length,3,l+" "+tipo+" copy");
      assert.ok(texts.every(v=>typeof v==="string"&&v.length>30),l+" "+tipo+" incomplete");
      const html=fs.readFileSync("dist/"+prefix+slug+"/index.html","utf8");
      assert.ok(html.includes('id="guida-'+tipo+'"'),l+" "+tipo+" missing guide");
      assert.ok(html.includes(texts[0]),l+" "+tipo+" language");
      const links=[...html.matchAll(/<a class="mondo-link" href="([^"]+)"/g)].map(x=>x[1]);
      assert.equal(links.length,2,l+" "+tipo+" links");
      for(const href of links) assert.ok(fs.existsSync("dist"+href+"index.html"),l+" "+tipo+" invalid link "+href);
    }
  }
});
