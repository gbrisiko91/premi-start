// Test editoriali mirati: non confondere stime di community con dati ufficiali,
// non presentare come futuri preload e lancio già avvenuti.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const read = (relative) => matter(fs.readFileSync(path.join(root,relative),"utf8"));
const svPath="content/traduzioni/sv/2026-11-05-fortnite-gettone-negozio-pirata.md";
const enPath="content/traduzioni/en/2026-11-04-gta-6-preload-peso.md";

test("Fortnite svedese: risponde alle query senza inventare drop rate o conteggi", () => {
  const { data: d, content: s }=read(svPath);
  assert.ok(d.titolo_seo.length<=60,"Titolo SEO oltre 60 caratteri");
  assert.ok(d.sommario.length<=160,"Sommario oltre 160 caratteri");
  assert.match(d.titolo_seo,/chansen\?/i,"Manca la domanda sulla probabilità");
  assert.match(s,/Hur stor är chansen att få Pirate Shop Token i Fortnite\?/);
  assert.match(s,/Hur många spelare har hittat Pirate Shop Token\?/);
  assert.match(s,/(?:Ingen officiell dropchans|inte publicerat någon officiell sannolikhet)/);
  assert.match(s,/700 000 kistor[\s\S]{0,160}(?:inte verifierad|obekräftad)/);
  assert.match(s,/ingen offentlig, verifierad totalsiffra/i);
  assert.match(s,/epicgames\.com\/help\//);
  assert.match(s,/köp, försäljning och delning av konton inte är tillåtet/);
  assert.doesNotMatch(s,/\b0[,.]000?14\s*%|\b0[,.]000?14\s*procent/);
});

test("GTA 6 inglese: data storica, spazio fino a 212GB e link tradotto corretti", () => {
  const { data: d, content: s }=read(enPath);
  assert.ok(d.titolo_seo.length<=60,"Titolo SEO oltre 60 caratteri");
  assert.ok(d.sommario.length<=160,"Sommario oltre 160 caratteri");
  assert.match(s,/preload\*\* began on \*\*10 November 2026\*\*/);
  assert.match(s,/19 November 2026/);
  assert.match(s,/up to 212 GB (?:depending on the device|of available space)/i);
  assert.match(s,/not confirmation that the downloaded file or installed game was exactly 212 GB/);
  assert.match(s,/rockstargames\.com\/newswire\/article\/39akk424a9oo53/);
  assert.match(s,/\/en\/articles\/the-duskbloods-delayed-2027\//);
  assert.doesNotMatch(s,/preload\*\* will begin|GTA 6 unlocks at|there is still time to pre-order/);
});

test("pagine generate: canonical e contenuti aggiornati senza alterare gli URL", () => {
  const targets=[
    {url:"/sv/artiklar/fortnite-pirate-shop-token-konton/",needle:"Hur många spelare har hittat Pirate Shop Token?"},
    {url:"/en/articles/gta-6-preload-date-file-size/",needle:"The dates and times below are a record"},
  ];
  for(const {url,needle} of targets) {
    const file=path.join(root,"dist",url.slice(1),"index.html");
    const html=fs.readFileSync(file,"utf8");
    assert.ok(html.includes(`<link rel="canonical" href="https://soffiacartuccia.it${url}">`),url+": canonical cambiato");
    assert.ok(html.includes(needle),url+": contenuto non presente nell'output");
    assert.match(html,/<meta name="robots" content="index, follow/);
  }
});
