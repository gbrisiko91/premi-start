import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import matter from "gray-matter";
import { marked } from "marked";
import { sanificaHtml } from "../strumenti/html-sicuro.mjs";

for (const lingua of ["it", "en", "de", "es", "no", "sv", "fi", "ja", "ru"]) {
  test("Pirates: due video riproducibili dopo sanitizer (" + lingua + ")", () => {
    const name = "2026-11-05-pirates-black-sails-of-the-sea-gioco-offline.md";
    const path = lingua === "it" ? "content/articoli/" + name : "content/traduzioni/" + lingua + "/" + name;
    const source = fs.readFileSync(path, "utf8");
    const html = sanificaHtml(marked.parse(matter(source).content));
    const videos = [...html.matchAll(/<video\b[^>]*>/g)].map(m => m[0]);
    assert.equal(videos.length, 2, path + ": devono essere due video");
    for (const tag of videos) {
      assert.match(tag, /\scontrols(?:\s|>)/, path + ": comando Riproduci mancante");
      assert.match(tag, /\ssrc="\/media\/pirates-black-sails\/[^"]+\.mp4"/);
      assert.match(tag, /\sposter="\/media\/pirates-black-sails\/[^"]+\.jpg"/);
      assert.doesNotMatch(tag, /\sautoplay(?:\s|>)/);
      assert.doesNotMatch(tag, /\son(?:error|load|click)=/i);
    }
  });
}
