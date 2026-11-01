# Guida redazionale per le bozze di Soffia Cartuccia

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

Scegli le notizie con il punteggio più alto, **da 3 a 5**, preferendo una varietà di categorie. Una notizia dedicata al **retro gaming** va inclusa ogni volta che ce n'è una con almeno 50 punti: è il tema che distingue Soffia Cartuccia.

Scarta: notizie già coperte dalle bozze dei giorni precedenti (controlla la cartella `bozze/`), offerte e sconti puri, contenuti sponsorizzati, voci prive di qualsiasi fonte credibile.

## 3. SEO: come scrivere per Google, Google Discover e i social

Ogni bozza deve essere ottimizzata prima ancora di essere scritta. Parti dalla **parola chiave principale**: la frase che un lettore italiano scriverebbe su Google per trovare questa notizia (es. "the duskbloods rinvio", "gta 6 prezzo", "switch 2 nuovo modello"). Verifica con WebSearch come la cercano le persone e quali titoli usano i concorrenti in Italia, poi fai di meglio.

**Titoli**
- `titolo` (H1, visibile sul sito e nelle anteprime social): 55-80 caratteri, contiene la parola chiave il più vicino possibile all'inizio, dice esattamente cosa è successo e dà un motivo per cliccare (un numero, una data, una conseguenza, una domanda a cui l'articolo risponde davvero). Mai promettere ciò che il testo non mantiene: il clickbait abbassa il tempo di lettura e Google Discover lo penalizza.
- `titolo_seo` (il titolo della scheda di Google): massimo 60 caratteri, parola chiave all'inizio. Il sito aggiunge da solo " – Soffia Cartuccia".
- Il nome del file (che diventa l'indirizzo della pagina) contiene la parola chiave: `AAAA-MM-GG-parola-chiave-breve.md`, 3-6 parole.

**Sommario (meta description)**
- 140-155 caratteri, contiene la parola chiave, riassume la notizia e incuriosisce. È il testo grigio sotto il titolo su Google e nelle condivisioni.

**Testo**
- Parola chiave (o una sua variante naturale) nelle prime 100 parole e in almeno un sottotitolo `##`.
- Primo paragrafo di 2-3 frasi che risponde subito a chi, cosa, quando: è quello che Google mostra come risposta.
- Sottotitoli `##` che sono frasi cercabili, non etichette generiche. Al posto di "Cosa sappiamo" scrivi ad esempio "## Quando esce The Duskbloods su Switch 2".
- Paragrafi brevi (2-4 frasi), nomi propri di giochi, studi e console in **grassetto** alla prima menzione.
- Usa sinonimi e termini correlati (nomi delle console, dello studio, del genere) invece di ripetere la parola chiave: niente keyword stuffing.
- Almeno un **link interno** a un altro articolo di Soffia Cartuccia pertinente (cerca in `content/articoli/`), con testo del link descrittivo, e un link alla **fonte ufficiale** quando esiste.
- Chiudi con una sezione `## Domande frequenti` con 2-3 domande che le persone cercano davvero su Google (controlla le "Altre domande" nei risultati), ognuna come `### Domanda?` seguita da una risposta di 1-2 frasi.
- Lunghezza: 450-800 parole. Meglio completo che lungo.

**Viralità sui social**
- Il titolo deve funzionare anche da solo in un'anteprima su WhatsApp, Telegram o X.
- L'immagine di copertina è obbligatoria quando possibile: le anteprime senza immagine vengono cliccate molto meno e Google Discover mostra quasi solo articoli con immagini grandi.

## 4. Come scrivere

- Lingua italiana, tono diretto e informato, da appassionati per appassionati.
- **Scrivi sempre con parole tue.** Non copiare frasi dagli articoli delle fonti; al massimo una citazione breve (meno di 15 parole) tra virgolette, attribuita.
- Ogni fatto importante deve essere confermato da almeno due fonti, oppure da una fonte ufficiale. Le indiscrezioni vanno dichiarate come tali nel titolo o nel primo paragrafo ("secondo un leak", "non ancora confermato").
- Struttura consigliata:
  1. Primo paragrafo: la notizia in due o tre frasi (chi, cosa, quando).
  2. Due o tre sezioni `##` con titoli cercabili: i dettagli verificati, perché se ne parla (reazioni, numeri, contesto), cosa aspettarsi (date, cosa resta da chiarire).
  3. `## Domande frequenti`.
  4. In fondo, un commento `<!-- NOTE PER LA REDAZIONE: ... -->` con dubbi da verificare, spunti per il pezzo finale e la verifica delle immagini.

## 5. Immagini

Ogni bozza ha un'**immagine di copertina** e, se utile, **una sola immagine nel testo**. Le immagini non si scaricano: si inserisce il loro indirizzo web.

**Da dove prenderle, in ordine di preferenza**
1. **Fonti ufficiali dell'annuncio**: il post sul blog di PlayStation, Xbox Wire, Nintendo, il sito o il press kit dell'editore. Apri la pagina con WebFetch e prendi l'indirizzo dell'immagine principale (il tag `og:image`).
2. **Pagina Steam ufficiale del gioco**: trova la pagina con WebSearch ("nome gioco steam"), aprila con WebFetch e prendi il numero del gioco (dall'indirizzo `store.steampowered.com/app/NUMERO`) e l'indirizzo `og:image`. Poi usa:
   - copertina: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/NUMERO/library_hero.jpg` (grande, senza scritte)
   - `immagine_riserva`: l'indirizzo `og:image` della pagina (di solito `.../apps/NUMERO/header.jpg`)
   Se il sito mostra la pagina Steam di un altro gioco o una versione diversa, non usarla.
3. **Wikimedia Commons** per console, hardware e loghi, solo con licenza libera (CC0, CC BY, CC BY-SA): indica autore e licenza nei crediti.

**Mai**
- Immagini prese da altre testate giornalistiche (IGN, Multiplayer.it, VGC, Everyeye...), da Google Immagini, da Pinterest o dai social.
- Foto di persone reali (sviluppatori, dirigenti, giocatori), anche se famose.
- Immagini legate a tragedie, vittime o fatti di cronaca: per queste notizie usa il logo o la copertina ufficiale del gioco, oppure nessuna immagine.
- Leak, materiale non ancora annunciato, immagini generate con l'IA presentate come reali.

**Campi da compilare**
- `immagine`: indirizzo completo `https://...` dell'immagine di copertina.
- `immagine_riserva`: un secondo indirizzo ufficiale, usato se il primo non si carica.
- `alt_immagine`: descrizione di cosa mostra l'immagine, 8-15 parole, con la parola chiave se è naturale (es. "Copertina ufficiale di The Duskbloods con il cacciatore nella città gotica").
- `crediti_immagine`: chi possiede l'immagine e da dove viene (es. "Immagine: FromSoftware / Nintendo, press kit ufficiale" oppure "Immagine: Bethesda via Steam").
- Immagine nel testo: `![descrizione dell'immagine](https://indirizzo "Crediti: Editore, fonte")`.

Se non trovi un'immagine sicura, lascia vuoti i campi: il sito mostra la copertina colorata della categoria. Scrivilo nelle note per la redazione.

## 6. Formato del file

Un file Markdown per bozza, chiamato `AAAA-MM-GG-parola-chiave-breve.md` (minuscole, trattini, niente accenti), con questa intestazione:

```markdown
---
titolo: "The Duskbloods rinviato al 2027: perché FromSoftware ha deciso di aspettare"
titolo_seo: "The Duskbloods rinviato al 2027: cosa cambia"
sommario: "FromSoftware rinvia The Duskbloods, l'esclusiva Switch 2, al 2027 per migliorare combattimento e bilanciamento dopo il network test di agosto."
parola_chiave: "the duskbloods rinvio"
data: 2026-11-01
categoria: console
tag: [the-duskbloods, fromsoftware, nintendo-switch-2]
viralita: 82
bozza: true
immagine: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/NUMERO/library_hero.jpg"
immagine_riserva: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/NUMERO/header.jpg"
alt_immagine: "Descrizione di cosa mostra l'immagine"
crediti_immagine: "Immagine: Editore, fonte ufficiale"
fonti:
  - titolo: "Nome testata – titolo del pezzo"
    url: "https://..."
  - titolo: "..."
    url: "https://..."
---

Testo dell'articolo in Markdown...
```

Categorie ammesse: `console`, `pc`, `retro`, `industria`. I tag sono 3-5, in minuscolo con trattini: nomi di giochi, studi, console. Se in seguito l'articolo viene aggiornato, aggiungi `aggiornato: AAAA-MM-GG`.

Prima di salvare esegui `npm run build`: segnala in giallo titoli o sommari troppo lunghi e immagini senza crediti. Correggi finché non ci sono avvisi.

## 7. Dalla bozza all'articolo

1. Leggi la bozza, verifica le note per la redazione e riscrivi dove serve con la tua voce.
2. Controlla che l'immagine si veda (apri l'indirizzo nel browser) e che i crediti siano corretti.
3. Cambia `bozza: true` in `bozza: false` e salva: dopo un minuto è online.
