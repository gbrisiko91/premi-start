#!/usr/bin/env python3
"""Generatore locale e gratuito delle grafiche del Mondiale delle console (identità ufficiale Soffia Cartuccia).

HTML/CSS + Chromium headless (Playwright). Nessun servizio esterno, nessun credito.
Palette e font vincolanti in brand.py (fonte: src/stile.css). Validazione dei risultati in validazione.py.

PRODUZIONE (dati reali, file risultati-torneo.json compilato e verificato):
  python3 genera.py sfida --sfida O3 -o out/ottavi-3.png                                  (ottavi: coppie fisse)
  python3 genera.py sfida --sfida Q1 --risultati risultati-torneo.json -o out/quarti-1.png
  python3 genera.py tabellone --risultati risultati-torneo.json --stato "Quarti: si vota stasera" -o out/tabellone.png
  python3 genera.py campione --risultati risultati-torneo.json -o out/campionessa.png
  python3 genera.py verifica --risultati risultati-torneo.json                            (solo controllo, nessun PNG)

PROVA (sempre con filigrana "ESEMPIO · NON PUBBLICARE"):
  python3 genera.py sfida --prova --turno "Quarti · Sfida 1/4" --a snes --b playstation -o out/prova.png
  python3 genera.py campione --prova --console snes --riga "Esempio" -o out/prova-campionessa.png
"""
import argparse, pathlib, sys
import validazione as V

for _f in (sys.stdout, sys.stderr):
    try:
        _f.reconfigure(errors="replace")
    except Exception:
        pass

NOTA_DREAMCAST = ("ATTENZIONE: la grafica contiene la foto del Dreamcast (Evan-Amos, CC BY-SA 3.0). "
                  "Il credito è stampato; nella didascalia e nell'articolo indicare autore, licenza, link e che la foto è ritagliata.")


def salva(doc: str, w: int, h: int, out: str):
    from playwright.sync_api import sync_playwright
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


def errore(msg):
    sys.exit(f"ERRORE: {msg}")


def analisi_da(percorso, prova):
    if not percorso:
        return V.analizza(V.modello_vuoto())
    return V.analizza(V.carica(percorso, consenti_esempio=prova))


def main(argv=None):
    import modelli as M, kit as K
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sfida"); s.add_argument("--sfida", help="O1–O8, Q1–Q4, S1–S2, F1")
    s.add_argument("--risultati"); s.add_argument("--turno"); s.add_argument("--a"); s.add_argument("--b")
    t = sub.add_parser("tabellone"); t.add_argument("--risultati"); t.add_argument("--stato", required=True)
    t.add_argument("--finale", default="FINALE · PREVISTA GIOVEDÌ 3 DICEMBRE")
    c = sub.add_parser("campione"); c.add_argument("--risultati"); c.add_argument("--console"); c.add_argument("--riga")
    v = sub.add_parser("verifica"); v.add_argument("--risultati", required=True); v.add_argument("--prova", action="store_true")
    for x in (s, t, c):
        x.add_argument("-o", "--out", required=True); x.add_argument("--prova", action="store_true", help="filigrana, dati di esempio ammessi")
    a = ap.parse_args(argv)

    try:
        if a.cmd == "verifica":
            an = analisi_da(a.risultati, a.prova)
            for k, d in an.items():
                print(f"{k:3} {str(d['a'] or '?'):12} vs {str(d['b'] or '?'):12} → {d['stato']}" + (f" ({d['vincitore']})" if d["vincitore"] else ""))
            print("OK: file coerente.")
            return

        if a.cmd == "sfida":
            if a.sfida:
                if a.a or a.b or a.turno:
                    errore("con --sfida le console e il turno si ricavano dal tabellone: non indicare --a, --b o --turno")
                if not a.sfida.startswith("O") and not a.risultati:
                    errore(f"per {a.sfida} serve --risultati con i risultati verificati del turno precedente")
                an = analisi_da(a.risultati, a.prova)
                ca, cb = V.sfidanti(an, a.sfida)
                turno = V.etichetta(a.sfida)
            else:
                if not a.prova:
                    errore("console scelte a mano (--a/--b) solo con --prova; in produzione usare --sfida")
                if not (a.a and a.b and a.turno):
                    errore("in prova servono --turno, --a e --b")
                ca, cb, turno = a.a, a.b, a.turno
            for k in (ca, cb):
                if k not in M.CONSOLE:
                    errore(f"console sconosciuta: {k}")
            if ca == cb:
                errore("una console non può sfidare sé stessa")
            if not a.prova and "dreamcast" in (ca, cb) and not (a.sfida == "O6"):
                print(NOTA_DREAMCAST)
            salva(M.sfida(turno, ca, cb, prova=a.prova), 1080, 1920, a.out)

        elif a.cmd == "tabellone":
            an = analisi_da(a.risultati, a.prova)
            salva(K.tabellone(a.stato, V.per_tabellone(an), a.finale, prova=a.prova), 1080, 1350, a.out)

        else:  # campione
            if a.riga and not a.prova:
                errore("--riga personalizzata solo con --prova: in produzione il testo deriva dai voti verificati")
            if a.console:
                if not a.prova:
                    errore("--console a mano solo con --prova; in produzione la campionessa si ricava dalla finale verificata")
                if a.console not in M.CONSOLE:
                    errore(f"console sconosciuta: {a.console}")
                cid, riga = a.console, a.riga or "Esempio"
            else:
                if not a.risultati:
                    errore("serve --risultati con la finale verificata")
                an = analisi_da(a.risultati, a.prova)
                f = an["F1"]
                if not f["vincitore"]:
                    errore(f"nessuna campionessa: finale {f['stato']}")
                t = f["tentativo"]
                vv, vp = (t["voti_a"], t["voti_b"]) if f["vincitore"] == f["a"] else (t["voti_b"], t["voti_a"])
                perdente = f["b"] if f["vincitore"] == f["a"] else f["a"]
                cid = f["vincitore"]
                riga = a.riga or f"In finale contro {M.CONSOLE[perdente]['nome']}: {vv:,} voti contro {vp:,}".replace(",", ".")
            if not a.prova and cid == "dreamcast":
                print(NOTA_DREAMCAST)
            salva(K.campione(cid, riga, prova=a.prova), 1080, 1350, a.out)
    except V.ErroreRisultati as err:
        errore(str(err))


if __name__ == "__main__":
    main()
