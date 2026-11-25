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
```bash
python3 produci.py ../kit-out                                   # rigenera tutte le grafiche del kit
python3 genera.py sfida --turno "Quarti · Sfida 1/4" --a snes --b playstation -o out/quarti-1.png
python3 genera.py tabellone --risultati risultati.json --stato "Quarti: si vota stasera" -o out/tabellone.png
python3 genera.py campione --console snes --riga "In finale [N] voti contro [N]" -o out/campionessa.png
```
L'opzione `--prova` aggiunge la filigrana "ESEMPIO · NON PUBBLICARE".

`risultati.json` usa le chiavi q1–q8, s1–s4, f1, f2 e campione, con l'id della console vincente. Vanno inseriti solo risultati reali e verificati: il modello è `esempio-risultati.json`, che contiene dati inventati.

## File
- `brand.py`: palette, font, marchio e filigrana. `modelli.py`: Storia della sfida e post di ringraziamento. `kit.py`: Storie della celebrazione, carosello G0, tabellone, campionessa e cover dell'evidenza. `produci.py`: genera l'intero kit.
- `console.json`: nomi, anni, crediti e link Commons delle 16 console.
- `foto/`: ritagli delle foto di Wikimedia Commons. Dreamcast è CC BY-SA 3.0, Switch 2 CC BY 4.0, PS5 CC0, le altre di pubblico dominio. Nei mosaici e nei trailer il Dreamcast compare solo con il nome, per non estendere la licenza share-alike a tutta la grafica. Nella Storia della sfida 6 compare la foto, con il credito.
- `trailer/`: sorgenti dei due trailer, cioè `scena.html`, `scena-storie.html` (derivata con `deriva_storie.py`), la musica chiptune originale (`musica.py`, `musica-storie.py`) e la registrazione (`render.mjs`, `render-storie.mjs`). Servono ffmpeg e Playwright per Node. Per cambiare la data basta modificare `#s6d` in `scena.html` e rigenerare.
- `pronti/`: PNG pubblicabili, solo dopo il GO. `esempi/`: dati inventati con filigrana, da non pubblicare.

Limite: le foto sono ritagli di circa 870×330 px. Vanno bene per le Storie, ma nel post della campionessa risultano un po' morbide.
