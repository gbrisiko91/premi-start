"""Modelli del kit Mondiale 3K (celebrazione, G0, tabellone, campionessa, cover evidenza). Identità ufficiale."""
from brand import NOTTE, PANNELLO, PANNELLO_2, TESTO, TENUE, VIOLA, GIALLO, VERDE, marchio
from modelli import CONSOLE, ORDINE, COPPA, e, foto, crediti, doc, pixel_art, barra_pixel

CREDITI_MOSAICO = "Foto Wikimedia Commons: Evan-Amos (pubblico dominio), Howardcorn33 (CC0), PantheraLeo1359531 (CC BY 4.0, ritagliata)"


def etichetta_foto(cid, x, y, w, h, raggio=22):
    """Etichetta chiara con la foto (fondo bianco). Dreamcast: solo il nome, perché la foto è CC BY-SA 3.0."""
    if cid == "dreamcast":
        dentro = (f'<div class="display" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'
                  f'color:{NOTTE};font-size:{int(h * .26)}px;font-stretch:112%">DREAMCAST</div>')
    else:
        dentro = f'<img src="{foto(cid)}" style="position:absolute;left:4%;top:4%;width:92%;height:92%;object-fit:contain">'
    return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:#fff;'
            f'border-radius:{raggio}px;overflow:hidden">{dentro}</div>')


def mosaico(x, y, w, colonne=4, gap=16):
    lw = (w - gap * (colonne - 1)) // colonne
    lh = int(lw * 0.42)
    pezzi = []
    for i, cid in enumerate(ORDINE):
        r, c = divmod(i, colonne)
        pezzi.append(etichetta_foto(cid, x + c * (lw + gap), y + r * (lh + gap), lw, lh, 16))
    return "".join(pezzi), (lh + gap) * (len(ORDINE) // colonne) - gap


def pagina(n, tot):
    return f'<div class="abs largo" style="right:64px;top:74px;font-size:24px;color:{TENUE}">{n}/{tot}</div>'


# ---------------- Celebrazione 3K: Storie 1080×1920 (safe area y 250–1670) ----------------
def celebrazione_s1(prova=False):
    coppa = pixel_art(COPPA, {"Y": GIALLO, "W": TESTO, "V": VIOLA}, 26)
    corpo = f"""
<div class="abs" style="left:60px;top:250px">{marchio(0.8)}</div>
<div class="abs" style="left:0;top:430px;width:1080px;display:flex;justify-content:center">{coppa}</div>
<div class="abs largo" style="left:0;top:850px;width:1080px;text-align:center;font-size:44px;letter-spacing:10px;color:{TENUE}">LIVELLO</div>
<div class="abs display" style="left:0;top:915px;width:1080px;text-align:center;font-size:270px;font-stretch:118%;color:{VIOLA};text-shadow:0 0 70px {VIOLA}66">3.000</div>
<div class="abs" style="left:0;top:1200px;width:1080px;display:flex;justify-content:center"><span class="chip" style="background:{GIALLO};color:{NOTTE};font-size:44px;padding:16px 40px">Sbloccato</span></div>
<div class="abs display" style="left:60px;top:1400px;width:960px;text-align:center;font-size:84px;font-stretch:115%">Grazie a <span style="color:{VIOLA}">tutti voi</span></div>"""
    return doc(1080, 1920, corpo, prova)


def celebrazione_s2(prova=False):
    tess, alto = mosaico(60, 330, 960)
    y = 330 + alto
    corpo = f"""
<div class="abs" style="left:60px;top:230px">{marchio(0.75)}</div>
{tess}
<div class="abs largo" style="left:60px;top:{y + 60}px;font-size:34px;letter-spacing:6px;color:{VIOLA}">MONDIALE DELLE CONSOLE</div>
<div class="abs display" style="left:60px;top:{y + 125}px;width:960px;font-size:104px;font-stretch:115%;line-height:1.02">16 console.<br>15 sfide.<br><span style="color:{VIOLA}">Una sola<br>leggenda.</span></div>
<div class="abs" style="left:60px;top:1650px;width:960px;font-size:21px;color:{TENUE}">{e(CREDITI_MOSAICO)}</div>"""
    return doc(1080, 1920, corpo, prova)


def celebrazione_s3(prova=False):
    corpo = f"""
<div class="abs" style="left:60px;top:250px">{marchio(0.8)}</div>
<div class="abs largo" style="left:60px;top:500px;font-size:44px;letter-spacing:8px;color:{TENUE}">PROSSIMO LIVELLO</div>
<div class="abs display" style="left:52px;top:570px;width:980px;font-size:270px;font-stretch:118%;color:{VIOLA};text-shadow:0 0 70px {VIOLA}66">5.000</div>
<div class="abs" style="left:60px;top:910px;width:960px;padding:40px;background:{PANNELLO};border:2px solid {PANNELLO_2};border-radius:34px">
  <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:26px">
    <div class="largo" style="font-size:38px;letter-spacing:2px">MISSIONE 5K</div>
    <div class="largo" style="font-size:38px;color:{VIOLA}">60%</div></div>
  {barra_pixel(60, blocchi=16, lato=46, gap=8)}
  <div style="margin-top:22px;font-size:30px;color:{TENUE}">3.000 su 5.000 follower</div></div>
<div class="abs display" style="left:60px;top:1320px;width:960px;font-size:92px;font-stretch:115%;line-height:1.02">La partita è<br><span style="color:{VIOLA}">appena cominciata</span></div>"""
    return doc(1080, 1920, corpo, prova)


# ---------------- Cover evidenza "Mondiale 3K" (1080×1920, Instagram mostra il cerchio centrale) ----------------
def cover_evidenza(prova=False):
    coppa = pixel_art(COPPA, {"Y": GIALLO, "W": NOTTE, "V": NOTTE}, 22)
    corpo = f"""
<div class="abs" style="left:190px;top:610px;width:700px;height:700px;border-radius:50%;background:{VIOLA};box-shadow:0 0 120px {VIOLA}88"></div>
<div class="abs" style="left:0;top:700px;width:1080px;display:flex;justify-content:center">{coppa}</div>
<div class="abs display" style="left:0;top:1030px;width:1080px;text-align:center;font-size:150px;font-stretch:118%;color:{NOTTE}">3K</div>"""
    return doc(1080, 1920, corpo, prova, griglia=False)


# ---------------- Carosello G0 (1080×1350) ----------------
def g0_copertina(prova=False):
    tess, alto = mosaico(64, 180, 952)
    y = 180 + alto
    corpo = f"""
<div class="abs" style="left:64px;top:64px">{marchio(0.8)}</div>
{pagina(1, 3)}
{tess}
<div class="abs" style="left:64px;top:{y + 44}px"><span class="chip chip-viola" style="font-size:22px">Livello 3.000</span></div>
<div class="abs display" style="left:64px;top:{y + 115}px;width:960px;font-size:96px;font-stretch:108%;line-height:1;white-space:nowrap">Il <span style="color:{VIOLA}">Mondiale</span><br>delle console</div>
<div class="abs largo" style="left:64px;top:{y + 330}px;font-size:30px;letter-spacing:1px">16 console · 15 sfide · votate voi nelle Storie</div>
<div class="abs" style="left:64px;top:1290px;width:952px;font-size:19px;color:{TENUE}">{e(CREDITI_MOSAICO)}</div>"""
    return doc(1080, 1350, corpo, prova)


REGOLE_SINTESI = [
    "Si vota <b>solo</b> con il sondaggio nelle Storie di @soffiacartuccia. È gratis e senza obblighi: commenti, DM e like non contano.",
    "Ogni sfida resta aperta <b>24 ore</b>. Passa la console con più voti effettivi alla chiusura.",
    "16 console, <b>15 sfide</b>: ottavi, quarti, semifinali e finale.",
    "Parità o zero voti: si rivota per altre 24 ore e il calendario slitta.",
    "Vietati bot, voti comprati e account falsi.",
    "<b>Nessun premio</b>: il titolo di Campionessa è simbolico. Non è un concorso e non è sponsorizzato da Instagram né dai produttori.",
]


def g0_regole(prova=False):
    voci = []
    for i, t in enumerate(REGOLE_SINTESI):
        t = t.replace("<b>", f'<b style="color:{VIOLA}">')
        voci.append(
            f'<div style="display:flex;gap:26px;align-items:flex-start">'
            f'<div class="display" style="flex:none;width:62px;height:62px;border-radius:16px;background:{VIOLA};color:{NOTTE};'
            f'display:flex;align-items:center;justify-content:center;font-size:36px;font-stretch:110%">{i + 1}</div>'
            f'<div style="font-size:31px;line-height:1.32;padding-top:6px">{t}</div></div>')
    corpo = f"""
<div class="abs" style="left:64px;top:64px">{marchio(0.8)}</div>
{pagina(3, 3)}
<div class="abs display" style="left:64px;top:165px;width:960px;font-size:96px;font-stretch:115%">Come <span style="color:{VIOLA}">si vota</span></div>
<div class="abs" style="left:64px;top:300px;width:952px;display:grid;gap:24px">{''.join(voci)}</div>
<div class="abs" style="left:64px;top:1190px;width:952px;padding:22px 28px;background:{PANNELLO};border:2px solid {PANNELLO_2};border-radius:24px;font-size:26px;color:{TENUE}">
  Regolamento completo: <b style="color:{TESTO}">link in bio</b> · Calendario indicativo, può slittare</div>"""
    return doc(1080, 1350, corpo, prova)


# ---------------- Tabellone (1080×1350) ----------------
def tabellone(stato, ris, finale_lbl="FINALE · PREVISTA GIOVEDÌ 3 DICEMBRE", pag=None, prova=False):
    """ris: q1..q8, s1..s4, f1, f2, campione -> id console vincente (solo risultati verificati).
    Verde = qualificata, barrata = eliminata, giallo = campionessa (sempre con legenda testuale)."""
    def nome(k):
        v = ris.get(k)
        return CONSOLE[v]["breve"] if v else "?"

    def slot(x, y, w, testo, vince=False, fuori=False):
        if vince:
            st = f"background:{VERDE};color:{NOTTE};font-weight:700;"
        elif fuori:
            st = f"background:{PANNELLO};color:{TENUE}99;text-decoration:line-through;"
        else:
            st = f"background:{PANNELLO};color:{TESTO};border:2px solid {PANNELLO_2};"
        return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:46px;display:flex;align-items:center;justify-content:center">'
                f'<span style="{st}padding:6px 12px;border-radius:12px;font-size:22px;white-space:nowrap">{e(testo)}</span></div>')

    out, tops = [], [330, 480, 630, 780]
    for side in (0, 1):
        ox, qx, sx = (40, 255, 420) if side == 0 else (845, 675, 545)
        for k in range(4):
            i, qk = side * 8 + k * 2, f"q{side * 4 + k + 1}"
            for j, dy in ((i, 0), (i + 1, 58)):
                cid, deciso = ORDINE[j], bool(ris.get(qk))
                out.append(slot(ox, tops[k] + dy, 195, CONSOLE[cid]["breve"],
                                vince=deciso and ris[qk] == cid, fuori=deciso and ris[qk] != cid))
            sv = ris.get(f"s{side * 2 + k // 2 + 1}")
            out.append(slot(qx, tops[k] + 29, 150, nome(qk), vince=bool(sv) and ris.get(qk) == sv, fuori=bool(sv) and ris.get(qk) != sv))
        for j, y in ((0, 434), (1, 734)):
            sk, fv = f"s{side * 2 + j + 1}", ris.get(f"f{side + 1}")
            out.append(slot(sx, y, 115, nome(sk), vince=bool(fv) and ris.get(sk) == fv, fuori=bool(fv) and ris.get(sk) != fv))
    linee = ("M235 353H245V411H235M245 382H255 M235 503H245V561H235M245 532H255 M235 653H245V711H235M245 682H255 M235 803H245V861H235M245 832H255 "
             "M405 382H412V532H405M412 457H420 M405 682H412V832H405M412 757H420 M845 353H835V411H845M835 382H825 M845 503H835V561H845M835 532H825 "
             "M845 653H835V711H845M835 682H825 M845 803H835V861H845M835 832H825 M675 382H668V532H675M668 457H660 M675 682H668V832H675M668 757H660 M477 480V734 M603 480V734")
    teste = "".join(f'<div class="abs largo" style="left:{x}px;top:285px;width:{w}px;text-align:center;font-size:17px;letter-spacing:2px;color:{VIOLA}">{t}</div>'
                    for x, w, t in [(40, 195, "OTTAVI"), (255, 150, "QUARTI"), (420, 115, "SEMI"), (545, 115, "SEMI"), (675, 150, "QUARTI"), (845, 195, "OTTAVI")])
    camp = ris.get("campione")

    def fin(k):
        return f"color:{TENUE}99;text-decoration:line-through;" if camp and camp != ris.get(k) else ""
    corpo = f"""
<div class="abs" style="left:50px;top:50px">{marchio(0.72)}</div>
{pagina(*pag) if pag else f'<div class="abs" style="right:50px;top:56px"><span class="chip chip-viola" style="font-size:20px">Livello 3.000</span></div>'}
<div class="abs display" style="left:50px;top:138px;font-size:62px;font-stretch:108%;white-space:nowrap">Il tabellone del <span style="color:{VIOLA}">Mondiale</span></div>
<div class="abs" style="left:50px;top:228px;width:980px;font-size:27px;color:{TENUE}">{e(stato)}</div>
{teste}
<svg class="abs" style="left:0;top:0" width="1080" height="1350" viewBox="0 0 1080 1350"><path fill="none" stroke="{TESTO}" stroke-opacity=".28" stroke-width="3" stroke-linecap="round" d="{linee}"/></svg>
{''.join(out)}
<div class="abs" style="left:40px;top:950px;width:1000px;height:270px;background:{PANNELLO};border:2px solid {PANNELLO_2};border-radius:32px"></div>
<div class="abs largo" style="left:80px;top:975px;width:920px;text-align:center;font-size:19px;letter-spacing:3px;color:{VIOLA}">{e(finale_lbl)}</div>
<div class="abs largo" style="left:80px;top:1015px;width:400px;text-align:right;font-size:36px;{fin('f1')}">{e(nome('f1'))}</div>
<div class="abs display" style="left:490px;top:1015px;width:100px;text-align:center;font-size:34px;color:{VIOLA}">VS</div>
<div class="abs largo" style="left:600px;top:1015px;width:400px;font-size:36px;{fin('f2')}">{e(nome('f2'))}</div>
<div class="abs largo" style="left:80px;top:1090px;width:920px;text-align:center;font-size:19px;letter-spacing:3px;color:{GIALLO}">CAMPIONESSA 2026</div>
<div class="abs display" style="left:80px;top:1125px;width:920px;text-align:center;font-size:60px;font-stretch:115%;color:{GIALLO if camp else TESTO}">{e(CONSOLE[camp]['nome'] if camp else '?')}</div>
<div class="abs" style="left:50px;top:1248px;width:980px;font-size:21px;color:{TENUE};line-height:1.45">
  <span style="color:{VERDE};font-weight:700">Verde</span> = qualificata · <s>barrata</s> = eliminata · <span style="color:{GIALLO};font-weight:700">giallo</span> = campionessa<br>Si vota nelle Storie: 24 ore per sfida, passa la console con più voti</div>"""
    return doc(1080, 1350, corpo, prova)


# ---------------- Post campionessa (1080×1350) ----------------
def campione(cid, riga, prova=False):
    c = CONSOLE[cid]
    coppa = pixel_art(COPPA, {"Y": GIALLO, "W": TESTO, "V": VIOLA}, 9)
    corpo = f"""
<div class="abs" style="left:60px;top:60px">{marchio(0.78)}</div>
<div class="abs" style="right:60px;top:64px"><span class="chip chip-viola" style="font-size:20px">Livello 3.000</span></div>
<div class="abs" style="left:60px;top:160px;display:flex;align-items:center;gap:24px">{coppa}
  <div class="largo" style="font-size:30px;letter-spacing:4px;color:{GIALLO};line-height:1.25">CAMPIONESSA DEL MONDIALE<br>DELLE CONSOLE 2026</div></div>
<div class="abs" style="left:60px;top:330px;width:960px;height:560px;background:{PANNELLO};border:2px solid {GIALLO};border-radius:40px"></div>
{etichetta_foto(cid, 84, 354, 912, 512, 26)}
<div class="abs display" style="left:60px;top:930px;width:960px;font-size:{120 if len(c['nome']) < 9 else (92 if len(c['nome']) < 13 else 80)}px;font-stretch:108%;color:{GIALLO};white-space:nowrap">{e(c['nome'])}</div>
<div class="abs" style="left:60px;top:1080px;width:960px;font-size:34px;line-height:1.3">{e(riga)}</div>
<div class="abs" style="left:60px;top:1190px;width:960px;height:3px;background:{PANNELLO_2}"></div>
<div class="abs" style="left:60px;top:1212px;width:960px;font-size:22px;color:{TENUE};line-height:1.4">Titolo simbolico, nessun premio · {e(crediti([cid]))}</div>"""
    return doc(1080, 1350, corpo, prova)
