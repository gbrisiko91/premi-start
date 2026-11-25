#!/usr/bin/env python3
"""Generatore locale e gratuito delle grafiche del Mondiale delle console (identità ufficiale Soffia Cartuccia).

HTML/CSS + Chromium headless (Playwright). Nessun servizio esterno, nessun credito.
Palette e font vincolanti in brand.py (fonte: src/stile.css).

Esempi:
  python3 genera.py sfida --turno "Quarti · Sfida 1/4" --a snes --b playstation -o out/quarti-1.png
  python3 genera.py tabellone --risultati risultati.json --stato "Quarti: si vota stasera" -o out/tabellone.png
  python3 genera.py campione --console snes --riga "In finale 1.234 voti contro 987" -o out/campionessa.png
  python3 produci.py ../kit-out        # rigenera tutto il kit
Con --prova si aggiunge la filigrana "ESEMPIO · NON PUBBLICARE".
"""
import argparse, json, pathlib, sys
from playwright.sync_api import sync_playwright
import modelli as M, kit as K


def salva(doc: str, w: int, h: int, out: str):
    pathlib.Path(out).parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": w, "height": h})
        pg.set_content(doc, wait_until="load")
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(150)
        pg.screenshot(path=out)
        b.close()
    print(out)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sfida"); s.add_argument("--turno", required=True); s.add_argument("--a", required=True); s.add_argument("--b", required=True)
    t = sub.add_parser("tabellone"); t.add_argument("--risultati", default=""); t.add_argument("--stato", required=True)
    t.add_argument("--finale", default="FINALE · PREVISTA GIOVEDÌ 3 DICEMBRE")
    c = sub.add_parser("campione"); c.add_argument("--console", required=True); c.add_argument("--riga", required=True)
    for x in (s, t, c):
        x.add_argument("-o", "--out", required=True); x.add_argument("--prova", action="store_true")
    a = ap.parse_args()
    if a.cmd == "sfida":
        for k in (a.a, a.b):
            if k not in M.CONSOLE: sys.exit(f"console sconosciuta: {k}")
        salva(M.sfida(a.turno, a.a, a.b, prova=a.prova), 1080, 1920, a.out)
    elif a.cmd == "tabellone":
        ris = json.loads(pathlib.Path(a.risultati).read_text()) if a.risultati else {}
        salva(K.tabellone(a.stato, ris, a.finale, prova=a.prova), 1080, 1350, a.out)
    else:
        if a.console not in M.CONSOLE: sys.exit(f"console sconosciuta: {a.console}")
        salva(K.campione(a.console, a.riga, prova=a.prova), 1080, 1350, a.out)


if __name__ == "__main__":
    main()
