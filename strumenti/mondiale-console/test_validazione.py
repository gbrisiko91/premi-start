"""Test della validazione dei risultati e dei controlli di genera.py (nessun PNG viene prodotto).
Esecuzione:  python3 -m unittest -v test_validazione
"""
import copy, json, pathlib, tempfile, unittest
from unittest import mock
import validazione as V
import genera

QUI = pathlib.Path(__file__).resolve().parent


def t(a, b, ver=True):
    return {"voti_a": a, "voti_b": b, "chiusura": "2026-11-30T18:00", "verificato": ver}


def con(**sfide):
    d = V.modello_vuoto()
    for k, tent in sfide.items():
        d["sfide"][k]["tentativi"] = tent
    return d


OTTAVI_OK = {f"O{i}": [t(10, 5)] for i in range(1, 9)}  # passa sempre la console "a"


class Validazione(unittest.TestCase):
    def test_modello_vuoto_valido_senza_vincitori(self):
        an = V.analizza(V.modello_vuoto())
        self.assertEqual(V.per_tabellone(an), {})
        self.assertEqual(an["O1"]["a"], "snes")
        self.assertIsNone(an["Q1"]["a"])

    def test_parita_nessun_vincitore(self):
        an = V.analizza(con(O1=[t(7, 7)]))
        self.assertIsNone(an["O1"]["vincitore"])
        self.assertIn("ripetere", an["O1"]["stato"])

    def test_zero_voti_nessun_vincitore(self):
        self.assertIsNone(V.analizza(con(O1=[t(0, 0)]))["O1"]["vincitore"])

    def test_non_verificato_nessun_vincitore(self):
        an = V.analizza(con(O1=[t(9, 3, ver=False)]))
        self.assertIsNone(an["O1"]["vincitore"])
        self.assertEqual(an["O1"]["stato"], "da verificare")

    def test_conteggi_mancanti_nessun_vincitore(self):
        self.assertIsNone(V.analizza(con(O1=[{"verificato": True}]))["O1"]["vincitore"])

    def test_vale_ultimo_tentativo_dopo_parita(self):
        an = V.analizza(con(O1=[t(5, 5), t(4, 6)]))
        self.assertEqual(an["O1"]["vincitore"], "megadrive")

    def test_conteggi_non_validi(self):
        for cattivo in (-1, 2.5, "10", True):
            with self.assertRaises(V.ErroreRisultati):
                V.analizza(con(O1=[t(cattivo, 3)]))

    def test_sfida_sconosciuta(self):
        d = V.modello_vuoto(); d["sfide"]["X9"] = {"tentativi": []}
        with self.assertRaises(V.ErroreRisultati):
            V.analizza(d)

    def test_quarti_senza_ottavi_decisi(self):
        with self.assertRaises(V.ErroreRisultati):
            V.analizza(con(Q1=[t(5, 3)]))

    def test_finale_senza_semifinali(self):
        d = con(**OTTAVI_OK, F1=[t(5, 3)])
        with self.assertRaises(V.ErroreRisultati):
            V.analizza(d)

    def test_percorso_coerente(self):
        sfide = dict(OTTAVI_OK)
        sfide.update({f"Q{i}": [t(3, 9)] for i in range(1, 5)})   # passa la "b"
        sfide.update(S1=[t(8, 2)], S2=[t(1, 2)], F1=[t(100, 99)])
        an = V.analizza(con(**sfide))
        self.assertEqual((an["Q1"]["a"], an["Q1"]["b"]), ("snes", "playstation"))
        self.assertEqual(an["Q1"]["vincitore"], "playstation")
        self.assertEqual(an["F1"]["vincitore"], an["S1"]["vincitore"])
        self.assertEqual(V.per_tabellone(an)["campione"], "playstation")

    def test_esempio_rifiutato_senza_prova(self):
        with self.assertRaises(V.ErroreRisultati):
            V.carica(QUI / "esempio-risultati.json")
        V.carica(QUI / "esempio-risultati.json", consenti_esempio=True)

    def test_modello_operativo_vuoto(self):
        dati = V.carica(QUI / "risultati-torneo.json")
        self.assertFalse(dati["esempio"])
        self.assertTrue(all(v["tentativi"] == [] for v in dati["sfide"].values()))


class Generatore(unittest.TestCase):
    """Verifica che genera.py rifiuti i casi indebiti senza produrre file."""

    def esegui(self, *argv):
        with mock.patch.object(genera, "salva") as salva:
            try:
                genera.main(list(argv))
            except SystemExit as e:
                return False, salva.called, str(e.code)
        return True, salva.called, ""

    def file_risultati(self, dati):
        f = tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8")
        json.dump(dati, f); f.close()
        return f.name

    def test_stessa_console_rifiutata(self):
        ok, salvato, msg = self.esegui("sfida", "--prova", "--turno", "X", "--a", "snes", "--b", "snes", "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato); self.assertIn("sé stessa", msg)

    def test_console_a_mano_senza_prova_rifiutata(self):
        ok, salvato, _ = self.esegui("sfida", "--turno", "Quarti", "--a", "snes", "--b", "ps5", "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato)

    def test_quarti_senza_risultati_rifiutati(self):
        ok, salvato, _ = self.esegui("sfida", "--sfida", "Q1", "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato)

    def test_quarti_con_ottavi_non_decisi_rifiutati(self):
        f = self.file_risultati(con(O1=[t(5, 5)], O2=[t(4, 2)]))
        ok, salvato, msg = self.esegui("sfida", "--sfida", "Q1", "--risultati", f, "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato)

    def test_campione_senza_finale_rifiutato(self):
        f = self.file_risultati(con(**OTTAVI_OK))
        ok, salvato, msg = self.esegui("campione", "--risultati", f, "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato); self.assertIn("nessuna campionessa", msg)

    def test_campione_a_mano_senza_prova_rifiutato(self):
        ok, salvato, _ = self.esegui("campione", "--console", "dreamcast", "--riga", "x", "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato)

    def test_finale_in_parita_nessuna_campionessa(self):
        sfide = dict(OTTAVI_OK); sfide.update({f"Q{i}": [t(9, 3)] for i in range(1, 5)})
        sfide.update(S1=[t(5, 1)], S2=[t(5, 1)], F1=[t(50, 50)])
        f = self.file_risultati(con(**sfide))
        ok, salvato, msg = self.esegui("campione", "--risultati", f, "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato)

    def test_json_incoerente_q1_ps5_rifiutato(self):
        # vecchio formato con vincitori scritti a mano: non ha "sfide", viene respinto
        f = self.file_risultati({"q1": "ps5", "campione": "dreamcast"})
        ok, salvato, _ = self.esegui("tabellone", "--risultati", f, "--stato", "x", "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato)

    def test_esempio_senza_prova_rifiutato(self):
        ok, salvato, msg = self.esegui("tabellone", "--risultati", str(QUI / "esempio-risultati.json"), "--stato", "x", "-o", "x.png")
        self.assertFalse(ok); self.assertFalse(salvato); self.assertIn("--prova", msg)

    def test_casi_validi_producono(self):
        self.assertEqual(self.esegui("sfida", "--sfida", "O1", "-o", "x.png")[:2], (True, True))
        self.assertEqual(self.esegui("tabellone", "--stato", "Ottavi", "-o", "x.png")[:2], (True, True))
        f = self.file_risultati(con(**OTTAVI_OK))
        self.assertEqual(self.esegui("sfida", "--sfida", "Q2", "--risultati", f, "-o", "x.png")[:2], (True, True))
        self.assertEqual(self.esegui("campione", "--prova", "--risultati", str(QUI / "esempio-risultati.json"), "-o", "x.png")[:2], (True, True))


if __name__ == "__main__":
    unittest.main()
