#!/usr/bin/env python3
"""Generatore locale e gratuito delle grafiche del Mondiale delle console.

Nessun servizio esterno: HTML/CSS + Chromium headless (Playwright) già presente.
Esempi:
  python3 genera.py sfida --turno "QUARTI · SFIDA 1/4" --a snes --b playstation -o out/quarti-1.png
  python3 genera.py tabellone --risultati risultati.json --stato "Quarti: si vota stasera" -o out/tabellone.png
  python3 genera.py campione --console snes --riga "Finale vinta con il 58% dei voti" -o out/campione.png
Aggiungere --prova per stampare la filigrana "ESEMPIO · NON PUBBLICARE".
"""
import argparse, base64, html, json, pathlib, sys
from playwright.sync_api import sync_playwright

QUI = pathlib.Path(__file__).resolve().parent
CONSOLE = json.loads((QUI / "console.json").read_text())
ORDINE = ["snes", "megadrive", "playstation", "n64", "ps2", "gamecube", "xbox360", "wii",
          "gameboy", "atari2600", "nes", "dreamcast", "ps4", "switch", "ps5", "switch2"]
P, O, BG = "#2B0F1E", "#C46014", "#FDEDF0"


def dati_url(percorso: pathlib.Path) -> str:
    return "data:image/png;base64," + base64.b64encode(percorso.read_bytes()).decode()


def foto(cid: str) -> str:
    return dati_url(QUI / "foto" / f"{cid}.png")


def e(t: str) -> str:
    return html.escape(t, quote=True)


def base_css(w: int, h: int) -> str:
    font = dati_url(QUI / "font" / "Lexend.ttf").replace("image/png", "font/ttf")
    return f"""
@font-face {{ font-family: 'Lexend'; src: url('{font}') format('truetype'); font-weight: 100 900; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{w}px; height:{h}px; background:{BG}; font-family:'Lexend', sans-serif; color:{P}; overflow:hidden; }}
.abs {{ position:absolute; }}
.brand {{ font-weight:700; letter-spacing:6px; }}
.prova {{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:99; }}
.prova span {{ transform:rotate(-28deg); font-size:{int(w*0.062)}px; font-weight:800; color:rgba(196,96,20,.28);
  border:8px solid rgba(196,96,20,.28); padding:10px 40px; border-radius:20px; white-space:nowrap; }}
"""


def filigrana(prova: bool) -> str:
    return '<div class="prova"><span>ESEMPIO · NON PUBBLICARE</span></div>' if prova else ""


def crediti(ids) -> str:
    cr = [CONSOLE[i]["credito"] for i in ids]
    if all(c == "Evan-Amos, pubblico dominio" for c in cr):
        return "Foto: Evan-Amos, Wikimedia Commons (pubblico dominio)"
    parti = [f'{CONSOLE[i]["nome"]}: {CONSOLE[i]["credito"]}' for i in ids]
    return "Foto Wikimedia Commons · " + " · ".join(parti) + " · licenze nel link"


def html_sfida(turno, a, b, domanda, cta, prova):
    ca, cb = CONSOLE[a], CONSOLE[b]
    def card(y, cid, c, foto_y, foto_h, nome_y):
        return f"""
<div class="abs" style="left:65px;top:{y}px;width:950px;height:450px;background:#fff;border-radius:36px"></div>
<img class="abs" src="{foto(cid)}" style="left:105px;top:{foto_y}px;width:870px;height:{foto_h}px;object-fit:contain">
<div class="abs" style="left:105px;top:{nome_y}px;width:620px;height:56px;font-size:44px;font-weight:800;display:flex;align-items:center;white-space:nowrap">{e(c['nome'])}</div>
<div class="abs" style="left:735px;top:{nome_y+4}px;width:240px;height:48px;font-size:32px;font-weight:700;color:{O};text-align:right;display:flex;align-items:center;justify-content:flex-end">{e(c['anno'])}</div>"""
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{base_css(1080,1920)}</style></head><body>
<div class="abs brand" style="left:65px;top:150px;font-size:34px">SOFFIA CARTUCCIA</div>
<div class="abs" style="right:65px;top:140px;width:315px;text-align:right;font-size:22px;font-weight:700;letter-spacing:3px;line-height:1.25">MONDIALE<br>DELLE CONSOLE</div>
<div class="abs" style="left:65px;top:240px;background:{O};padding:8px 18px;font-size:26px;font-weight:700;letter-spacing:3px;border-radius:4px">{e(turno)}</div>
<div class="abs" style="left:65px;top:315px;width:950px;font-size:76px;font-weight:700;line-height:1.1">{domanda}</div>
{card(440, a, ca, 465, 330, 810)}
{card(940, b, cb, 1000, 310, 1315)}
<div class="abs" style="left:470px;top:845px;width:140px;height:140px;border-radius:50%;background:{O};border:8px solid {BG};display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:800">VS</div>
<div class="abs" style="left:65px;top:1430px;width:950px;height:170px;border:4px dashed {P};border-radius:28px;display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:600">{e(cta)}</div>
<div class="abs" style="left:65px;top:1625px;width:950px;font-size:{24 if len(crediti([a,b]))<70 else 19}px;color:#5A3A48">{e(crediti([a,b]))}</div>
{filigrana(prova)}</body></html>"""


def html_tabellone(stato, ris, finale_lbl, prova):
    """ris: q1..q8, s1..s4, f1, f2, campione -> id console (assenti = '?')."""
    def nome(k):
        v = ris.get(k)
        return CONSOLE[v]["breve"] if v else "?"
    avanzati = set(v for v in ris.values() if v)
    def slot(x, y, w, testo, vince=False, fuori=False):
        st = f"background:{O};" if vince else "background:#fff;"
        if fuori: st += "opacity:.45;text-decoration:line-through;"
        return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:42px;display:flex;align-items:center;justify-content:center">'
                f'<span style="{st}padding:6px 12px;border-radius:10px;font-size:22px;font-weight:600;white-space:nowrap">{e(testo)}</span></div>')
    out = []
    tops = [320, 470, 620, 770]
    for side in (0, 1):
        ox, qx, sx = (40, 255, 420) if side == 0 else (845, 675, 545)
        for k in range(4):
            i = side * 8 + k * 2
            qk = f"q{side*4+k+1}"
            for j, dy in ((i, 0), (i + 1, 58)):
                cid = ORDINE[j]
                deciso = bool(ris.get(qk))
                out.append(slot(ox, tops[k] + dy, 195, CONSOLE[cid]["breve"],
                                vince=deciso and ris[qk] == cid, fuori=deciso and ris[qk] != cid))
            sv = ris.get(f"s{side*2+k//2+1}")
            out.append(slot(qx, tops[k] + 29, 150, nome(qk), vince=bool(sv) and ris.get(qk) == sv, fuori=bool(sv) and ris.get(qk) != sv))
        for j, y in ((0, 424), (1, 724)):
            sk = f"s{side*2+j+1}"; fv = ris.get(f"f{side+1}")
            out.append(slot(sx, y, 115, nome(sk), vince=bool(fv) and ris.get(sk) == fv, fuori=bool(fv) and ris.get(sk) != fv))
    lines = ("M235 340H245V398H235M245 369H255 M235 490H245V548H235M245 519H255 M235 640H245V698H235M245 669H255 M235 790H245V848H235M245 819H255 "
             "M405 369H412V519H405M412 444H420 M405 669H412V819H405M412 744H420 M845 340H835V398H845M835 369H825 M845 490H835V548H845M835 519H825 "
             "M845 640H835V698H845M835 669H825 M845 790H835V848H845M835 819H825 M675 369H668V519H675M668 444H660 M675 669H668V819H675M668 744H660 M477 464V724 M603 464V724")
    heads = "".join(f'<div class="abs" style="left:{x}px;top:270px;width:{w}px;text-align:center;font-size:18px;font-weight:700;letter-spacing:2px;color:#A34F0F">{t}</div>'
                    for x, w, t in [(40,195,"OTTAVI"),(255,150,"QUARTI"),(420,115,"SEMI"),(545,115,"SEMI"),(675,150,"QUARTI"),(845,195,"OTTAVI")])
    camp = ris.get("campione")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{base_css(1080,1350)}</style></head><body>
<div class="abs brand" style="left:50px;top:50px;font-size:28px;letter-spacing:5px">SOFFIA CARTUCCIA</div>
<div class="abs" style="right:50px;top:54px;font-size:22px;font-weight:700;letter-spacing:3px">LIVELLO 3.000</div>
<div class="abs" style="left:50px;top:105px;font-size:64px;font-weight:700">Il tabellone del <span style="color:{O}">Mondiale</span></div>
<div class="abs" style="left:50px;top:205px;width:980px;font-size:26px;font-weight:500">{e(stato)}</div>
{heads}
<svg class="abs" style="left:0;top:0" width="1080" height="1350" viewBox="0 0 1080 1350"><path fill="none" stroke="{P}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" d="{lines}"/></svg>
{''.join(out)}
<div class="abs" style="left:40px;top:960px;width:1000px;height:290px;background:#fff;border-radius:32px"></div>
<div class="abs" style="left:80px;top:988px;width:920px;text-align:center;font-size:20px;font-weight:700;letter-spacing:3px;color:#A34F0F">{e(finale_lbl)}</div>
<div class="abs" style="left:80px;top:1030px;width:400px;text-align:right;font-size:36px;font-weight:800;{'opacity:.45;text-decoration:line-through;' if camp and camp != ris.get('f1') else ''}">{e(nome('f1'))}</div>
<div class="abs" style="left:490px;top:1030px;width:100px;text-align:center;font-size:30px;font-weight:800;color:{O}">VS</div>
<div class="abs" style="left:600px;top:1030px;width:400px;font-size:36px;font-weight:800;{'opacity:.45;text-decoration:line-through;' if camp and camp != ris.get('f2') else ''}">{e(nome('f2'))}</div>
<div class="abs" style="left:80px;top:1112px;width:920px;text-align:center;font-size:20px;font-weight:700;letter-spacing:3px;color:#A34F0F">CAMPIONE DEL MONDO</div>
<div class="abs" style="left:80px;top:1150px;width:920px;text-align:center;font-size:56px;font-weight:800;color:{O if camp else P}">{e(CONSOLE[camp]['nome'] if camp else '?')}</div>
<div class="abs" style="left:50px;top:1284px;width:980px;font-size:22px;font-weight:500;color:#5A3A48">Si vota nelle Storie: 24 ore per sfida, passa la console più votata</div>
{filigrana(prova)}</body></html>"""


def html_campione(cid, riga, prova):
    c = CONSOLE[cid]
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{base_css(1080,1350)}</style></head><body>
<div class="abs brand" style="left:60px;top:60px;font-size:30px">SOFFIA CARTUCCIA</div>
<div class="abs" style="right:60px;top:52px;background:{O};padding:8px 16px;font-size:24px;font-weight:700;letter-spacing:3px;border-radius:4px">LIVELLO 3.000</div>
<div class="abs" style="left:60px;top:140px;font-size:30px;font-weight:700;letter-spacing:4px;color:#A34F0F">MONDIALE DELLE CONSOLE</div>
<div class="abs" style="left:60px;top:185px;width:960px;font-size:84px;font-weight:800;line-height:1.05">Campione del <span style="color:{O}">mondo</span></div>
<div class="abs" style="left:60px;top:390px;width:960px;height:560px;background:#fff;border-radius:40px"></div>
<img class="abs" src="{foto(cid)}" style="left:100px;top:420px;width:880px;height:500px;object-fit:contain">
<div class="abs" style="left:60px;top:990px;width:960px;font-size:96px;font-weight:800;line-height:1">{e(c['nome'])}</div>
<div class="abs" style="left:60px;top:1110px;width:960px;font-size:34px;font-weight:600">{e(riga)}</div>
<div class="abs" style="left:60px;top:1190px;width:960px;height:3px;background:{P}"></div>
<div class="abs" style="left:60px;top:1215px;width:960px;font-size:22px;color:#5A3A48">{e(crediti([cid]))}</div>
{filigrana(prova)}</body></html>"""


def salva(doc: str, w: int, h: int, out: str):
    pathlib.Path(out).parent.mkdir(parents=True, exist_ok=True)
    pathlib.Path(out).with_suffix(".html").write_text(doc)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.set_content(doc, wait_until="load")
        pg.evaluate("document.fonts.ready")
        pg.screenshot(path=out, full_page=False)
        b.close()
    print(out)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("sfida"); s.add_argument("--turno", required=True); s.add_argument("--a", required=True); s.add_argument("--b", required=True)
    s.add_argument("--domanda", default=f'Chi passa il <span style="color:{O}">turno</span>?'); s.add_argument("--cta", default="Metti qui il sondaggio ↓")
    t = sub.add_parser("tabellone"); t.add_argument("--risultati", default=""); t.add_argument("--stato", required=True); t.add_argument("--finale", default="FINALE · PREVISTA GIOVEDÌ 3 DICEMBRE")
    c = sub.add_parser("campione"); c.add_argument("--console", required=True); c.add_argument("--riga", required=True)
    for x in (s, t, c):
        x.add_argument("-o", "--out", required=True); x.add_argument("--prova", action="store_true")
    a = ap.parse_args()
    if a.cmd == "sfida":
        for k in (a.a, a.b):
            if k not in CONSOLE: sys.exit(f"console sconosciuta: {k}")
        salva(html_sfida(a.turno, a.a, a.b, a.domanda, a.cta, a.prova), 1080, 1920, a.out)
    elif a.cmd == "tabellone":
        ris = json.loads(pathlib.Path(a.risultati).read_text()) if a.risultati else {}
        salva(html_tabellone(a.stato, ris, a.finale, a.prova), 1080, 1350, a.out)
    else:
        salva(html_campione(a.console, a.riga, a.prova), 1080, 1350, a.out)


if __name__ == "__main__":
    main()
