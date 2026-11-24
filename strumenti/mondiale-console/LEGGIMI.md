# Mondiale delle console – grafiche locali e gratuite

Ramo di lavoro separato: **non va unito a `main`** e non fa parte del sito pubblico.

Generatore gratuito (HTML/CSS + Chromium headless via Playwright), senza crediti Orshot.

```bash
python3 genera.py sfida --turno "QUARTI · SFIDA 1/4" --a snes --b playstation -o out/quarti-1.png
python3 genera.py tabellone --risultati risultati.json --stato "Quarti: si vota stasera" -o out/tabellone.png
python3 genera.py campione --console snes --riga "Finale vinta con il 58% dei voti" -o out/campione.png
```
`--prova` aggiunge la filigrana "ESEMPIO · NON PUBBLICARE".

- `console.json`: nomi, anni, crediti e link Commons delle 16 console (id: snes, megadrive, playstation, n64, ps2, gamecube, xbox360, wii, gameboy, atari2600, nes, dreamcast, ps4, switch, ps5, switch2).
- `risultati.json`: chiavi q1–q8, s1–s4, f1, f2, campione con l'id della console vincente (solo risultati reali e verificati).
- `foto/`: ritagli delle foto Wikimedia Commons (licenze in `console.json`; Dreamcast CC BY-SA 3.0, Switch 2 CC BY 4.0, PS5 CC0, le altre pubblico dominio).
- `font/`: Lexend, SIL Open Font License (`font/OFL.txt`).
- `pronti/`: PNG del lancio (G0) e degli ottavi. `g0-1` e `g0-3` e la storia 3.000 sono render Orshot già esistenti; gli ottavi e il tabellone sono generati in locale.
- `esempi/`: prove con dati inventati e filigrana, da non pubblicare.

Limiti: le foto sono ritagli a circa 870×330 px dalle grafiche esistenti, adeguati alle Storie ma un po' morbidi se ingranditi molto (post campione). Per una resa migliore conviene scaricare l'originale da Commons.
