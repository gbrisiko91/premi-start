# Mondiale delle console: generatore grafico (identità ufficiale)

Ramo di lavoro separato: **non va unito a `main`** e non fa parte del sito pubblico.

Il generatore è gratuito e locale: HTML/CSS e Chromium headless con Playwright. Non usa servizi esterni né crediti Orshot.

## Identità visiva (vincolante)
Palette e font sono in `brand.py`, copiati da `src/stile.css` del sito (25/11/2026).

| Ruolo | Variabile | Colore |
|---|---|---|
| Fondo | notte | `#15122b` |
| Pannelli | pannello / pannello-2 | `#211c40` / `#2b2552` |
| Testo | testo / tenue | `#f4f1ff` / `#b0aad0` |
| Accento principale | viola | `#8b6cff` |
| Cursore del marchio, avvisi | rosso | `#ff3b4e` |
| Campionessa, traguardo | giallo | `#ffc21a` |
| Qualificata | verde | `#22d07a` |
| Informazioni | blu | `#3d8bff` |

- I colori funzionali compaiono sempre insieme a un'etichetta testuale. Il bianco si usa solo come fondo delle foto delle console.
- **Font:** Anybody per titoli e marchio (900, corsivo largo come nel sito) e Atkinson Hyperlegible per i testi di lettura. Tutti e due sono SIL Open Font License, in `font-brand/` con le licenze.
- **Logo:** la cartuccia di `public/favicon.svg`, in `logo-cartuccia.svg`, con la scritta "Soffia Cartuccia" e il cursore rosso, come nella testata del sito.

## Comandi
Guida completa per Windows: `ISTRUZIONI-WINDOWS.md`.
```bash
python3 -m unittest -v test_validazione                                   # test, nessuna immagine
python3 genera.py verifica --risultati risultati-torneo.json              # controlla i risultati
python3 genera.py sfida --sfida O3 -o out/ottavi-3.png                    # ottavi: coppie fisse
python3 genera.py sfida --sfida Q1 --risultati risultati-torneo.json -o out/quarti-1.png
python3 genera.py tabellone --risultati risultati-torneo.json --stato "Quarti: si vota stasera" -o out/tabellone.png
python3 genera.py campione --risultati risultati-torneo.json -o out/campionessa.png
python3 produci.py ../kit-out                                             # rigenera tutto il kit di partenza
```
Prove: `--prova` aggiunge la filigrana "ESEMPIO · NON PUBBLICARE". È l'unico modo per scegliere le console a mano (`--turno --a --b`, `--console`) o per usare `esempio-risultati.json`.

## Validazione dei risultati (`validazione.py`)
- **`risultati-torneo.json`** è il modello operativo, vuoto. Per ogni sfida (O1–O8, Q1–Q4, S1–S2, F1) si registrano i tentativi con `voti_a`, `voti_b`, `chiusura` e `verificato`. Le console non si scrivono: si ricavano dal tabellone.
- **C'è un vincitore solo se** l'ultimo tentativo è verificato, ha conteggi interi ≥ 0, un totale maggiore di zero e non è in parità. Altrimenti la sfida risulta "da verificare" o "da ripetere" (art. 6, 7 e 9).
- **Il generatore rifiuta:**
  - risultati in una sfida le cui sfidanti non sono ancora decise;
  - sfide o chiavi sconosciute;
  - conteggi non validi;
  - una console contro sé stessa;
  - console scelte a mano senza `--prova`;
  - la campionessa senza una finale decisa e verificata;
  - il file di esempio senza `--prova`.
- Le grafiche iniziali (ottavi, tabellone vuoto, celebrazione, G0) non richiedono risultati.
- Se la foto del Dreamcast (CC BY-SA 3.0) compare in una grafica di produzione oltre la sfida 6 degli ottavi, il generatore stampa un promemoria sui crediti e sulla licenza.

## File
- `validazione.py`: regole sui risultati; `test_validazione.py`: 23 test, anche negativi; `risultati-torneo.json`: modello vuoto; `esempio-risultati.json`: dati inventati, solo per le prove.
- `brand.py`: palette, font, marchio e filigrana. `modelli.py`: Storia della sfida e post di ringraziamento. `kit.py`: Storie della celebrazione, carosello G0, tabellone, campionessa e cover dell'evidenza. `produci.py`: genera l'intero kit.
- `console.json`: nomi, anni, crediti e link Commons delle 16 console.
- `foto/`: ritagli delle foto di Wikimedia Commons. Dreamcast è CC BY-SA 3.0, Switch 2 CC BY 4.0, PS5 CC0, le altre di pubblico dominio. Nei mosaici e nei trailer il Dreamcast compare solo con il nome, per non estendere la licenza share-alike a tutta la grafica. Nella Storia della sfida 6 compare la foto, con il credito.
- `trailer/`: sorgenti dei due trailer, cioè `scena.html`, `scena-storie.html` (derivata con `deriva_storie.py`), la musica chiptune originale (`musica.py`, `musica-storie.py`) e la registrazione (`render.mjs`, `render-storie.mjs`). Servono ffmpeg e Playwright per Node. Per cambiare la data basta modificare `#s6d` in `scena.html` e rigenerare.
- `pronti/`: PNG pubblicabili, solo dopo il GO. `esempi/`: dati inventati con filigrana, da non pubblicare.

Limite: le foto sono ritagli di circa 870×330 px. Vanno bene per le Storie, ma nel post della campionessa risultano un po' morbide.
