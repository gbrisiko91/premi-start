#!/usr/bin/env python3
"""Rigenera tutte le grafiche del kit Mondiale 3K nella cartella indicata (default: ../../kit-mondiale-3k)."""
import json, pathlib, sys
from playwright.sync_api import sync_playwright
import modelli as M, kit as K, validazione as V

DEST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "kit-out")
OTTAVI = [("snes", "megadrive"), ("playstation", "n64"), ("ps2", "gamecube"), ("xbox360", "wii"),
          ("gameboy", "atari2600"), ("nes", "dreamcast"), ("ps4", "switch"), ("ps5", "switch2")]
STATO_G0 = "Ottavi: si vota nelle Storie (calendario indicativo dal 29 novembre)"
AN = V.analizza(V.carica(pathlib.Path(__file__).parent / "esempio-risultati.json", consenti_esempio=True))  # dati inventati: solo esempi con filigrana
ES = V.per_tabellone(AN)

lavori = [
    ("01-celebrazione-3k/celebrazione-3k-feed.png", M.celebrazione_feed(), 1080, 1350),
    ("01-celebrazione-3k/celebrazione-3k-storia-1-sbloccato.png", K.celebrazione_s1(), 1080, 1920),
    ("01-celebrazione-3k/celebrazione-3k-storia-2-mondiale.png", K.celebrazione_s2(), 1080, 1920),
    ("01-celebrazione-3k/celebrazione-3k-storia-3-missione-5k.png", K.celebrazione_s3(), 1080, 1920),
    ("02-lancio-g0/g0-1-copertina.png", K.g0_copertina(), 1080, 1350),
    ("02-lancio-g0/g0-2-tabellone.png", K.tabellone(STATO_G0, {}, pag=(2, 3)), 1080, 1350),
    ("02-lancio-g0/g0-3-regole.png", K.g0_regole(), 1080, 1350),
    ("04-tabellone/tabellone-ottavi.png", K.tabellone(STATO_G0, {}), 1080, 1350),
    ("05-evidenza/cover-evidenza-mondiale-3k.png", K.cover_evidenza(), 1080, 1920),
]
for n, (a, b) in enumerate(OTTAVI, 1):
    lavori.append((f"03-ottavi/ottavi-sfida-{n}-{a}-{b}.png", M.sfida(f"Ottavi · Sfida {n}/8", a, b), 1080, 1920))
lavori += [
    ("09-esempi-NON-PUBBLICARE/esempio-quarti-sfida-1.png", M.sfida(V.etichetta("Q1"), *V.sfidanti(AN, "Q1"), prova=True), 1080, 1920),
    ("09-esempi-NON-PUBBLICARE/esempio-tabellone-completo.png", K.tabellone("Esempio con risultati inventati", ES, prova=True), 1080, 1350),
    ("09-esempi-NON-PUBBLICARE/esempio-post-campionessa.png", K.campione(ES["campione"], "Esempio: in finale 1.234 voti contro 987", prova=True), 1080, 1350),
]
with sync_playwright() as p:
    br = p.chromium.launch()
    for rel, d, w, h in lavori:
        out = DEST / rel; out.parent.mkdir(parents=True, exist_ok=True)
        pg = br.new_page(viewport={"width": w, "height": h})
        pg.set_content(d, wait_until="load"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(150)
        pg.screenshot(path=str(out)); pg.close(); print(rel)
    br.close()
