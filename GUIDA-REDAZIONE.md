# Guida redazionale per le bozze di Premi Start

Questa guida è il "cervello" dell'algoritmo: ogni mattina l'attività pianificata la segue per trovare le notizie più virali e scrivere le bozze. Se vuoi cambiare il comportamento dell'algoritmo, cambia questo file (anche la copia salvata nel Progetto claude.ai "Sito blog gaming").

## 1. Dove cercare

Cerca le notizie delle ultime 24-36 ore su almeno tre di questi gruppi:

- **Testate italiane**: Multiplayer.it, Everyeye.it, IGN Italia, Spaziogames, Eurogamer.it, Game Experience.
- **Testate internazionali**: IGN, VGC (Video Games Chronicle), Eurogamer, Kotaku, The Verge (sezione games), GamesIndustry.biz, Gematsu (Giappone).
- **Segnali di viralità**: discussioni più votate su Reddit (r/Games, r/gaming, r/PS5, r/NintendoSwitch, r/XboxSeriesX, r/pcgaming, r/retrogaming), trailer in tendenza su YouTube, ricerche in crescita su Google Trends Italia (categoria giochi).
- **Fonti ufficiali** per confermare: blog PlayStation, Xbox Wire, Nintendo, Steam, comunicati degli editori.

## 2. Come misurare la viralità (punteggio 0-100)

Per ogni notizia candidata assegna un punteggio sommando:

| Criterio | Punti |
|---|---|
| Ripresa da 5 o più testate diverse | fino a 30 |
| Grande discussione social (post Reddit con migliaia di voti, trailer con milioni di visualizzazioni, trend) | fino a 25 |
| Interesse per il pubblico italiano (uscita in Italia, prezzo in euro, studio italiano, giochi molto popolari da noi) | fino a 15 |
| Freschezza (meno di 12 ore = massimo) | fino a 15 |
| Effetto sorpresa o polemica (annuncio inatteso, leak, rinvio, licenziamenti, prezzi) | fino a 15 |

Scegli le notizie con il punteggio più alto, **da 3 a 5**, preferendo una varietà di categorie. Una notizia dedicata al **retro gaming** va inclusa ogni volta che ce n'è una con almeno 50 punti: è il tema che distingue Premi Start.

Scarta: notizie già coperte dalle bozze dei giorni precedenti (controlla la cartella `bozze/`), offerte e sconti puri, contenuti sponsorizzati, voci prive di qualsiasi fonte credibile.

## 3. Come scrivere

- Lingua italiana, tono diretto e informato, da appassionati per appassionati. Niente clickbait che il testo non mantiene.
- **Scrivi sempre con parole tue.** Non copiare frasi dagli articoli delle fonti; al massimo una citazione breve (meno di 15 parole) tra virgolette, attribuita.
- Ogni fatto importante deve essere confermato da almeno due fonti, oppure da una fonte ufficiale. Le indiscrezioni vanno dichiarate come tali nel titolo o nel primo paragrafo ("secondo un leak", "non ancora confermato").
- Lunghezza: 350-600 parole.
- Struttura:
  1. Primo paragrafo: la notizia in due o tre frasi (chi, cosa, quando).
  2. `## Cosa sappiamo`: i dettagli verificati.
  3. `## Perché se ne parla`: il motivo della viralità (reazioni, numeri, contesto).
  4. `## Cosa aspettarsi`: prossime date, cosa resta da chiarire.
  5. In fondo, un commento `<!-- NOTE PER LA REDAZIONE: ... -->` con dubbi da verificare, spunti per il pezzo finale e idee di immagine (da recuperare dai press kit ufficiali).
- Non inserire immagini prese dal web: i diritti vanno verificati a mano.

## 4. Formato del file

Un file Markdown per bozza, chiamato `AAAA-MM-GG-titolo-breve.md` (minuscole, trattini, niente accenti), con questa intestazione:

```markdown
---
titolo: "Titolo dell'articolo, massimo 90 caratteri"
sommario: "Una o due frasi che riassumono la notizia, massimo 200 caratteri"
data: 2026-11-01
categoria: console
tag: [playstation, sony]
viralita: 82
bozza: true
fonti:
  - titolo: "Nome testata – titolo del pezzo"
    url: "https://..."
  - titolo: "..."
    url: "https://..."
---

Testo dell'articolo in Markdown...
```

Categorie ammesse: `console`, `pc`, `retro`, `industria`.

## 5. Dalla bozza all'articolo

1. Leggi la bozza, verifica le note per la redazione e riscrivi dove serve con la tua voce.
2. Copia il file in `content/articoli/` del sito.
3. Cambia `bozza: true` in `bozza: false` e, se vuoi, aggiungi `immagine:` e `crediti_immagine:`.
4. Pubblica (vedi README).
