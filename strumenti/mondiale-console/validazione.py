"""Validazione dei risultati del Mondiale delle console (regolamento, art. 3, 6, 7, 9).

File dei risultati (`risultati-torneo.json`, modello vuoto nel kit):
{
  "esempio": false,
  "sfide": {
    "O1": {"tentativi": [{"voti_a": 812, "voti_b": 790, "chiusura": "2026-11-30T18:00", "verificato": true}]},
    ...
  }
}
- Sfide: O1–O8 (ottavi, coppie fisse), Q1–Q4 (quarti), S1–S2 (semifinali), F1 (finale).
- "a" e "b" di ogni sfida sono stabiliti dal tabellone: nel file si scrivono solo i conteggi.
- Vale l'ultimo tentativo. C'è un vincitore solo se il tentativo è verificato, ha conteggi interi ≥ 0,
  il totale è maggiore di zero e i voti non sono pari. Altrimenti la sfida va ripetuta (art. 7 e 9).
- Una sfida può avere risultati solo se le due sfidanti sono già determinate dal turno precedente.
"""
import json, pathlib

ORDINE = ["snes", "megadrive", "playstation", "n64", "ps2", "gamecube", "xbox360", "wii",
          "gameboy", "atari2600", "nes", "dreamcast", "ps4", "switch", "ps5", "switch2"]
SFIDE = [f"O{i}" for i in range(1, 9)] + [f"Q{i}" for i in range(1, 5)] + ["S1", "S2", "F1"]
PROVENIENZA = {f"Q{i}": (f"O{2*i-1}", f"O{2*i}") for i in range(1, 5)}
PROVENIENZA.update({"S1": ("Q1", "Q2"), "S2": ("Q3", "Q4"), "F1": ("S1", "S2")})
FASE = {"O": ("ottavi", "Ottavi", 8), "Q": ("quarti", "Quarti", 4), "S": ("semifinali", "Semifinale", 2), "F": ("finale", "Finale", 1)}


class ErroreRisultati(ValueError):
    pass


def modello_vuoto() -> dict:
    return {"esempio": False, "sfide": {k: {"tentativi": []} for k in SFIDE}}


def carica(percorso, consenti_esempio=False) -> dict:
    try:
        dati = json.loads(pathlib.Path(percorso).read_text(encoding="utf-8"))
    except json.JSONDecodeError as err:
        raise ErroreRisultati(f"{percorso}: JSON non valido ({err})")
    if dati.get("esempio") and not consenti_esempio:
        raise ErroreRisultati(f"{percorso} contiene dati di esempio: si può usare solo con --prova (filigrana)")
    return dati


def _esito(tentativo):
    """Restituisce 'a', 'b' oppure None (nessun vincitore valido)."""
    for campo in ("voti_a", "voti_b"):
        v = tentativo.get(campo)
        if v is None:
            return None
        if not isinstance(v, int) or isinstance(v, bool) or v < 0:
            raise ErroreRisultati(f"{campo} deve essere un intero ≥ 0, trovato {v!r}")
    if tentativo.get("verificato") is not True:
        return None
    a, b = tentativo["voti_a"], tentativo["voti_b"]
    if a + b == 0 or a == b:
        return None
    return "a" if a > b else "b"


def analizza(dati: dict) -> dict:
    """Controlla la coerenza e restituisce {sfida: {"a","b","vincitore","stato","tentativo"}}."""
    if not isinstance(dati, dict) or not isinstance(dati.get("sfide"), dict):
        raise ErroreRisultati('manca l\'oggetto "sfide"')
    sconosciute = set(dati["sfide"]) - set(SFIDE)
    if sconosciute:
        raise ErroreRisultati(f"sfide sconosciute: {', '.join(sorted(sconosciute))} (ammesse: {', '.join(SFIDE)})")
    out = {}
    for k in SFIDE:
        if k.startswith("O"):
            i = int(k[1:]) - 1
            a, b = ORDINE[2 * i], ORDINE[2 * i + 1]
        else:
            pa, pb = PROVENIENZA[k]
            a, b = out[pa]["vincitore"], out[pb]["vincitore"]
        voce = dati["sfide"].get(k, {"tentativi": []})
        tent = voce.get("tentativi", [])
        if not isinstance(tent, list):
            raise ErroreRisultati(f"{k}: \"tentativi\" deve essere una lista")
        if tent and (a is None or b is None):
            raise ErroreRisultati(f"{k}: ci sono risultati ma le sfidanti non sono ancora decise (manca il vincitore di {', '.join(p for p in PROVENIENZA[k] if out[p]['vincitore'] is None)})")
        vinc, stato = None, "da giocare"
        if tent:
            ultimo = tent[-1]
            try:
                es = _esito(ultimo)
            except ErroreRisultati as err:
                raise ErroreRisultati(f"{k}, tentativo {len(tent)}: {err}")
            if es:
                vinc, stato = (a if es == "a" else b), "decisa"
            elif ultimo.get("verificato") is not True:
                stato = "da verificare"
            else:
                stato = "da ripetere (parità o zero voti)"
        out[k] = {"a": a, "b": b, "vincitore": vinc, "stato": stato, "tentativo": tent[-1] if tent else None}
    return out


def per_tabellone(analisi: dict) -> dict:
    """Converte nel formato del tabellone: q1..q8, s1..s4, f1, f2, campione (solo vincitori verificati)."""
    ris = {}
    for i in range(1, 9):
        ris[f"q{i}"] = analisi[f"O{i}"]["vincitore"]
    for i in range(1, 5):
        ris[f"s{i}"] = analisi[f"Q{i}"]["vincitore"]
    ris["f1"], ris["f2"] = analisi["S1"]["vincitore"], analisi["S2"]["vincitore"]
    ris["campione"] = analisi["F1"]["vincitore"]
    return {k: v for k, v in ris.items() if v}


def sfidanti(analisi: dict, sfida: str):
    if sfida not in analisi:
        raise ErroreRisultati(f"sfida sconosciuta: {sfida}")
    s = analisi[sfida]
    if s["a"] is None or s["b"] is None:
        raise ErroreRisultati(f"{sfida}: le sfidanti non sono ancora decise da risultati verificati")
    return s["a"], s["b"]


def etichetta(sfida: str) -> str:
    _, nome, tot = FASE[sfida[0]]
    return f"{nome} · Sfida {sfida[1:]}/{tot}" if tot > 1 else nome
