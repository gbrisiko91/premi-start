"""Modelli HTML delle grafiche del Mondiale delle console e della celebrazione 3K (identità ufficiale)."""
import base64, html, json, pathlib
from brand import QUI, css, marchio, filigrana, NOTTE, PANNELLO, PANNELLO_2, TESTO, TENUE, VIOLA, ROSSO, GIALLO, VERDE, BLU

CONSOLE = json.loads((QUI / "console.json").read_text(encoding="utf-8"))
ORDINE = ["snes", "megadrive", "playstation", "n64", "ps2", "gamecube", "xbox360", "wii",
          "gameboy", "atari2600", "nes", "dreamcast", "ps4", "switch", "ps5", "switch2"]


def e(t: str) -> str:
    return html.escape(t, quote=True)


def foto(cid: str) -> str:
    return "data:image/png;base64," + base64.b64encode((QUI / "foto" / f"{cid}.png").read_bytes()).decode()


def crediti(ids) -> str:
    cr = [CONSOLE[i]["credito"] for i in ids]
    if all(c == "Evan-Amos, pubblico dominio" for c in cr):
        return "Foto: Evan-Amos, Wikimedia Commons (pubblico dominio)"
    parti = [f'{CONSOLE[i]["nome"]}: {CONSOLE[i]["credito"]}' for i in ids]
    return "Foto Wikimedia Commons · " + " · ".join(parti) + " · licenze nel link"


def doc(w, h, corpo, prova=False, griglia=True):
    return (f'<!doctype html><html><head><meta charset="utf-8"><style>{css(w, h)}</style></head><body>'
            f'{"<div class=griglia></div>" if griglia else ""}{corpo}{filigrana(prova)}</body></html>')


# ---------- elementi pixel originali ----------
def pixel_art(righe, colori, lato):
    """righe: stringhe di caratteri; colori: dict carattere -> colore; lato: px per pixel."""
    out = []
    for y, r in enumerate(righe):
        for x, ch in enumerate(r):
            if ch in colori:
                out.append(f'<rect x="{x}" y="{y}" width="1.02" height="1.02" fill="{colori[ch]}"/>')
    w, h = len(righe[0]), len(righe)
    return f'<svg class="pixel" width="{w*lato}" height="{h*lato}" viewBox="0 0 {w} {h}" shape-rendering="crispEdges">{"".join(out)}</svg>'


COPPA = ["..YYYYYYYYYY..",
         "YYYYYYYYYYYYYY",
         "Y.YYYYYYYYYY.Y",
         "Y.YYYYWYYYYY.Y",
         "Y.YYYYWYYYYY.Y",
         ".YYYYYYYYYYYY.",
         "..YYYYYYYYYY..",
         "....YYYYYY....",
         ".....YYYY.....",
         "......YY......",
         "......YY......",
         "....YYYYYY....",
         "...VVVVVVVV...",
         "...VVVVVVVV..."]


def barra_pixel(percento, blocchi=20, lato=34, gap=6, colore=VIOLA):
    pieni = round(blocchi * percento / 100)
    celle = "".join(f'<div style="width:{lato}px;height:{lato}px;background:{colore if i < pieni else PANNELLO_2};'
                    f'{"" if i < pieni else f"border:2px solid {TESTO}1f;"}"></div>' for i in range(blocchi))
    return f'<div style="display:flex;gap:{gap}px">{celle}</div>'


# ---------- Storia sfida (1080×1920) ----------
def sfida(turno, a, b, domanda='Chi passa il <span style="color:%s">turno</span>?' % VIOLA, cta="Vota qui ↓", prova=False):
    def scheda(y, cid, testa):
        c = CONSOLE[cid]
        ty, fy = (y + 22, y + 108) if testa else (y + 384, y + 24)
        return f"""
<div class="abs" style="left:60px;top:{y}px;width:960px;height:470px;background:{PANNELLO};border:2px solid {PANNELLO_2};border-radius:40px"></div>
<div class="abs" style="left:84px;top:{fy}px;width:912px;height:340px;background:#fff;border-radius:26px;overflow:hidden">
  <img src="{foto(cid)}" style="position:absolute;left:21px;top:5px;width:870px;height:330px;object-fit:contain"></div>
<div class="abs largo" style="left:100px;top:{ty}px;width:640px;height:66px;font-size:48px;font-stretch:112%;display:flex;align-items:center;white-space:nowrap">{e(c['nome'])}</div>
<div class="abs largo" style="left:740px;top:{ty}px;width:240px;height:66px;font-size:40px;font-stretch:112%;color:{VIOLA};text-align:right;display:flex;align-items:center;justify-content:flex-end">{e(c['anno'])}</div>"""
    cr = crediti([a, b])
    corpo = f"""
<div class="abs" style="left:60px;top:150px">{marchio(0.78)}</div>
<div class="abs largo" style="right:60px;top:156px;text-align:right;font-size:22px;letter-spacing:3px;line-height:1.3;color:{TENUE}">MONDIALE<br>DELLE CONSOLE</div>
<div class="abs" style="left:60px;top:262px"><span class="chip chip-viola" style="font-size:26px">{e(turno)}</span></div>
<div class="abs display" style="left:60px;top:350px;width:960px;font-size:76px;font-stretch:118%;white-space:nowrap">{domanda}</div>
{scheda(470, a, True)}
{scheda(990, b, False)}
<div class="abs display" style="left:460px;top:880px;width:160px;height:160px;border-radius:50%;background:{VIOLA};border:12px solid {NOTTE};display:flex;align-items:center;justify-content:center;font-size:56px;font-stretch:120%;color:{NOTTE};padding-right:4px">VS</div>
<div class="abs" style="left:60px;top:1500px;width:960px;height:160px;border:4px dashed {TESTO}66;border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:700;color:{TESTO}cc">{e(cta)}</div>
<div class="abs" style="left:60px;top:1680px;width:960px;font-size:{24 if len(cr) < 70 else 20}px;color:{TENUE};line-height:1.35">{e(cr)}</div>"""
    return doc(1080, 1920, corpo, prova)


# ---------- Post di ringraziamento 3K (1080×1350) ----------
def celebrazione_feed(prova=False):
    coppa = pixel_art(COPPA, {"Y": GIALLO, "W": TESTO, "V": VIOLA}, 14)
    corpo = f"""
<div class="abs" style="left:64px;top:64px">{marchio(0.8)}</div>
<div class="abs" style="right:64px;top:72px"><span class="chip chip-scuro" style="font-size:22px">Missione 5K</span></div>
<div class="abs" style="left:64px;top:230px;display:flex;align-items:center;gap:30px">
  {coppa}
  <div class="largo" style="font-size:40px;letter-spacing:4px;line-height:1.2">ACHIEVEMENT<br><span style="color:{GIALLO}">UNLOCKED</span></div></div>
<div class="abs display" style="left:56px;top:470px;width:980px;font-size:250px;font-stretch:118%;color:{VIOLA};text-shadow:0 0 60px {VIOLA}66">3.000</div>
<div class="abs largo" style="left:64px;top:735px;font-size:40px;letter-spacing:8px;color:{TENUE}">FOLLOWER</div>
<div class="abs display" style="left:64px;top:820px;width:960px;font-size:54px;font-stretch:112%;line-height:1.08">Non siamo più solo giocatori.<br><span style="color:{VIOLA}">Siamo una community.</span></div>
<div class="abs" style="left:64px;top:1060px;width:952px;padding:30px 34px;background:{PANNELLO};border:2px solid {PANNELLO_2};border-radius:30px">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:22px">
    <div class="largo" style="font-size:30px;letter-spacing:2px">NEXT LEVEL: <span style="color:{VIOLA}">5.000 FOLLOWER</span></div>
    <div class="largo" style="font-size:30px;color:{TENUE}">60%</div></div>
  {barra_pixel(60, blocchi=22, lato=36, gap=6)}
  <div style="margin-top:18px;font-size:26px;color:{TENUE}">Missione 5K · 3.000 su 5.000</div></div>"""
    return doc(1080, 1350, corpo, prova)
