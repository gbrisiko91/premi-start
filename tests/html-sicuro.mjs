import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { marked } from "marked";
import matter from "gray-matter";
import { sanificaHtml } from "../strumenti/html-sicuro.mjs";

test("rimuove script e contenuti attivi, anche nelle varianti inline", () => {
  const html = sanificaHtml('<p>Ciao</p><script>alert(1)</script><img src="/ok.png" onerror="alert(1)"><svg onload="alert(1)"><circle/></svg>');
  assert.match(html, /Ciao/);
  assert.doesNotMatch(html, /<script|<svg|onerror|onload|alert\(1\)/i);
  assert.match(html, /<img src="\/ok.png"/);
});
test("rimuove URL javascript e data anche se codificati", () => {
  const html = sanificaHtml('<a href="java&#x73;cript:alert(1)">falso</a><img src="data:image/svg+xml;base64,Zm9v"><a href="/articoli/prova/">leggi</a>');
  assert.doesNotMatch(html, /href="javascript:|src="data:/i);
  assert.match(html, /href="\/articoli\/prova\/"/);
});
test("non accetta iframe, inline CSS o attributi event handler", () => {
  const html = sanificaHtml('<iframe src="https://example.com" srcdoc="<script>bad</script>"></iframe><div class="sfondi-griglia" style="background-image:url(javascript:alert(1))" onclick="alert(1)">Testo</div>');
  assert.doesNotMatch(html, /<iframe|srcdoc|<script|style=|onclick=/i);
  assert.match(html, /class="sfondi-griglia"/);
  assert.match(html, />Testo<\/div>/);
});
test("preserva la struttura della galleria degli sfondi e i link di download", () => {
  const raw = fs.readFileSync(new URL("../content/pagine/it/sfondi.md", import.meta.url), "utf8");
  const html = sanificaHtml(marked.parse(matter(raw).content));
  assert.match(html, /class="sfondi-griglia"/);
  assert.equal((html.match(/<figure>/g) ?? []).length, 3);
  assert.equal((html.match(/\\sdownload="/g) ?? []).length, 3);
  assert.match(html, /src="\/sfondi\/soffiacartuccia-sfondo-01-cartuccia\.png"/);
  assert.doesNotMatch(html, /style=/);
});
test("mantiene tabelle, figure e link HTTPS legittimi", () => {
  const html = sanificaHtml('<div class="tabella" tabindex="0"><table><tr><td class="punteggio">2-1</td></tr></table></div><figure class="immagine-testo"><img src="https://example.org/img.png" alt="prova" loading="lazy"></figure>');
  assert.match(html, /class="punteggio"/);
  assert.match(html, /class="immagine-testo"/);
  assert.match(html, /src="https:\/\/example.org\/img.png"/);
  assert.match(html, /loading="lazy"/);
});
test("link esterni target blank hanno noopener noreferrer", () => {
  const html=sanificaHtml('<a href="https://example.com" target="_blank">Vai</a>');
  assert.match(html, /rel="noopener noreferrer"/);
});
