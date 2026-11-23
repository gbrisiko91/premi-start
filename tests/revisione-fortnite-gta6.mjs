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

test("Fortnite svedese: odds ufficiali e numero di possessori non inventato", () => {
  const { data: d, content: s }=read(svPath);
  assert.ok(d.titolo_seo.length<=60,"Titolo SEO oltre 60 caratteri");
  assert.ok(d.sommario.length<=160,"Sommario oltre 160 caratteri");
  assert.match(d.titolo_seo,/chansen\?/i,"Manca la domanda sulla probabilità");
  assert.match(s,/Hur stor är chansen att få Pirate Shop Token i Fortnite\?/);
  assert.match(s,/Hur många spelare har hittat Pirate Shop Token\?/);
  assert.match(s,/1 på 137 500/);
  assert.match(s,/FortniteStatus\/status\/2119202610322227327/);
  assert.doesNotMatch(s,/700 000 kistor/);
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

test("dateModified e sitemap: aggiornamenti locali senza falsare altre lingue", () => {
  const expected=[
    {url:"/sv/artiklar/fortnite-pirate-shop-token-konton/",lang:"sv"},
    {url:"/en/articles/gta-6-preload-date-file-size/",lang:"en"},
  ];
  const sitemap=fs.readFileSync(path.join(root,"dist/sitemap.xml"),"utf8");
  for(const item of expected) {
    const source=read(item.lang==="sv"?svPath:enPath);
    const modified=item.lang==="sv"?"2026-11-23":"2026-11-22";
    assert.equal(source.data.aggiornato.toISOString().slice(0,10),modified);
    const html=fs.readFileSync(path.join(root,"dist",item.url.slice(1),"index.html"),"utf8");
    const timestamp=`${modified}T00:00:00.000Z`;
    assert.ok(html.includes(`<meta property="article:modified_time" content="${timestamp}">`),
      item.lang+": meta OG non riflette la revisione");
    assert.ok(html.includes(`"dateModified":"${timestamp}"`),
      item.lang+": JSON-LD non riflette la revisione");
    assert.ok(html.includes(`<time datetime="${timestamp}">`),
      item.lang+": data visibile non riflette la revisione");
    const block=[...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)]
      .find(x=>x[1].includes(`<loc>https://soffiacartuccia.it${item.url}</loc>`));
    assert.ok(block,item.lang+": URL mancante dalla sitemap");
    assert.ok(block[1].includes(`<lastmod>${modified}</lastmod>`),item.lang+": lastmod errato");
  }
  const original=fs.readFileSync(path.join(root,"dist/articoli/gta-6-preload-peso/index.html"),"utf8");
  assert.ok(!original.includes('"dateModified":"2026-11-22T00:00:00.000Z"'),
    "L'originale italiano non deve ricevere automaticamente la data di una modifica inglese");
});

test("Fortnite: tutte le nove versioni riportano il dato ufficiale di Epic", () => {
  const langs=["it","en","de","es","no","sv","fi","ja","ru"];
  for(const l of langs) {
    const file=l==="it"?"content/articoli/2026-11-05-fortnite-gettone-negozio-pirata.md":`content/traduzioni/${l}/2026-11-05-fortnite-gettone-negozio-pirata.md`;
    const { data, content }=read(file);
    assert.equal(data.aggiornato.toISOString().slice(0,10),"2026-11-23",l+": data non allineata");
    assert.match(content,/FortniteStatus\/status\/2119202610322227327/,l+": fonte ufficiale assente");
    assert.match(content,/137[., ]?500|13万7,500/,l+": probabilità ufficiale assente");
    assert.doesNotMatch(content,/700[., ]?000|70万個/,l+": stima obsoleta ancora presente");
    assert.match(content,/Treasure Hours/,l+": distinzione evento mancante");
  }
});
