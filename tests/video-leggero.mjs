import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { sanificaHtml } from "../strumenti/html-sicuro.mjs";

const sample = '<div class="video-yt" data-id="p2VHYy3xtRk" data-titolo="GTA 6 PS5"><a href="https://www.youtube.com/watch?v=p2VHYy3xtRk" target="_blank"><img src="https://i.ytimg.com/vi/p2VHYy3xtRk/hqdefault.jpg" alt="Gameplay GTA 6"><span class="video-yt__play"></span></a></div>';

test("conserva soltanto i dati necessari al componente video", () => {
  const html = sanificaHtml(sample);
  assert.match(html, /class="video-yt"/);
  assert.match(html, /data-id="p2VHYy3xtRk"/);
  assert.match(html, /data-titolo="GTA 6 PS5"/);
  assert.match(html, /class="video-yt__play"/);
  assert.match(html, /href="https:\/\/www\.youtube\.com\/watch\?v=p2VHYy3xtRk"/);
});

test("niente iframe o script arbitrario nei testi degli articoli", () => {
  const html = sanificaHtml(sample + '<iframe src="https://evil.example"></iframe><script>alert(1)</script><div onclick="alert(2)">ok</div>');
  assert.doesNotMatch(html, /<iframe|<script|onclick=/);
});

test("pubblica video.js e lo carica soltanto negli articoli dotati di player", () => {
  assert.equal(fs.existsSync("dist/video.js"), true);
  const art = fs.readFileSync("dist/articoli/gta-6-prime-impressioni-ps5/index.html", "utf8");
  assert.match(art, /src="\/video\.js" defer/);
  assert.match(art, /data-id="p2VHYy3xtRk"/);
  assert.match(art, /data-id="Ibhpn2KHi04"/);
  assert.doesNotMatch(art, /<iframe/);
  const home = fs.readFileSync("dist/index.html", "utf8");
  assert.doesNotMatch(home, /src="\/video\.js"/);
});
