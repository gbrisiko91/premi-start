"""Identità visiva ufficiale di Soffia Cartuccia (vincolante).

Fonte: src/stile.css su main (variabili :root) e public/favicon.svg (logo a cartuccia).
- Fondo indaco dominante: notte, pannello, pannello-2
- Testo chiaro: testo, tenue
- Accento principale: viola
- Accenti funzionali: rosso (cursore del marchio, avvisi), giallo (campione),
  verde (qualificata), blu (informazioni). Mai usati da soli: sempre con un'etichetta testuale.
- Font: Anybody (titoli, 900 corsivo largo come il marchio del sito) e Atkinson Hyperlegible (lettura).
Nessun altro colore è ammesso nelle grafiche (il bianco serve solo come fondo delle foto).
"""
import base64, pathlib

QUI = pathlib.Path(__file__).resolve().parent

NOTTE = "#15122b"
PANNELLO = "#211c40"
PANNELLO_2 = "#2b2552"
TESTO = "#f4f1ff"
TENUE = "#b0aad0"
VIOLA = "#8b6cff"
ROSSO = "#ff3b4e"
GIALLO = "#ffc21a"
VERDE = "#22d07a"
BLU = "#3d8bff"
PALETTE = {"notte": NOTTE, "pannello": PANNELLO, "pannello-2": PANNELLO_2, "testo": TESTO, "tenue": TENUE,
           "viola": VIOLA, "rosso": ROSSO, "giallo": GIALLO, "verde": VERDE, "blu": BLU}


def _dati(p: pathlib.Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def logo_svg() -> str:
    return (QUI / "logo-cartuccia.svg").read_text()


def css(w: int, h: int) -> str:
    f = QUI / "font-brand"
    return f"""
@font-face {{ font-family:'Anybody'; src:url('{_dati(f/'Anybody.ttf','font/ttf')}') format('truetype'); font-weight:100 900; font-stretch:50% 150%; font-style:normal; }}
@font-face {{ font-family:'Anybody'; src:url('{_dati(f/'Anybody-Italic.ttf','font/ttf')}') format('truetype'); font-weight:100 900; font-stretch:50% 150%; font-style:italic; }}
@font-face {{ font-family:'Atkinson'; src:url('{_dati(f/'AtkinsonHyperlegible-Regular.ttf','font/ttf')}') format('truetype'); font-weight:400; }}
@font-face {{ font-family:'Atkinson'; src:url('{_dati(f/'AtkinsonHyperlegible-Bold.ttf','font/ttf')}') format('truetype'); font-weight:700; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{w}px; height:{h}px; overflow:hidden; color:{TESTO}; font-family:'Atkinson', sans-serif;
  background: radial-gradient({int(w*1.1)}px {int(h*.55)}px at 85% -8%, {VIOLA}38, transparent 70%),
              radial-gradient({int(w*.9)}px {int(h*.45)}px at -10% 108%, {VIOLA}22, transparent 65%), {NOTTE}; }}
.abs {{ position:absolute; }}
.griglia {{ position:absolute; inset:0; background-image:linear-gradient({TESTO}08 2px,transparent 2px),linear-gradient(90deg,{TESTO}08 2px,transparent 2px);
  background-size:60px 60px; -webkit-mask-image:linear-gradient(180deg,#000 0%,transparent 70%); }}
.display {{ font-family:'Anybody', sans-serif; font-weight:900; font-style:italic; font-stretch:150%; letter-spacing:-.02em; line-height:.95; }}
.largo {{ font-family:'Anybody', sans-serif; font-weight:800; font-stretch:125%; }}
.marchio {{ display:flex; align-items:center; gap:18px; }}
.marchio svg {{ width:72px; height:72px; flex:none; }}
.marchio .nome {{ font-family:'Anybody', sans-serif; font-weight:900; font-style:italic; font-stretch:150%; font-size:44px; white-space:nowrap; letter-spacing:-1px; line-height:1; }}
.marchio .nome span:first-child {{ color:{VIOLA}; }}
.cursore {{ display:inline-block; width:.45em; height:.7em; background:{ROSSO}; margin-left:6px; vertical-align:-1px; }}
.chip {{ display:inline-flex; align-items:center; gap:12px; font-family:'Anybody',sans-serif; font-weight:800; font-stretch:125%;
  text-transform:uppercase; letter-spacing:2px; border-radius:999px; padding:12px 26px; }}
.chip-viola {{ background:{VIOLA}; color:{NOTTE}; }}
.chip-scuro {{ background:{TESTO}12; border:2px solid {TESTO}22; color:{TESTO}; }}
.pixel {{ image-rendering:pixelated; }}
.prova {{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:99; }}
.prova span {{ transform:rotate(-28deg); font-family:'Anybody',sans-serif; font-weight:900; font-size:{int(w*0.06)}px; color:{ROSSO}55;
  border:8px solid {ROSSO}55; padding:10px 40px; border-radius:20px; white-space:nowrap; }}
"""


def marchio(scala: float = 1.0) -> str:
    return (f'<div class="marchio" style="transform:scale({scala});transform-origin:left center">{logo_svg()}'
            f'<div class="nome"><span>Soffia</span> <span>Cartuccia</span><span class="cursore"></span></div></div>')


def filigrana(prova: bool) -> str:
    return '<div class="prova"><span>ESEMPIO · NON PUBBLICARE</span></div>' if prova else ""
