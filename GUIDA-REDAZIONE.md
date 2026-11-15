# Guida redazionale per le bozze di Soffia Cartuccia

Questa guida orienta l'attività pianificata che seleziona le notizie e prepara le **bozze**, non la pubblicazione automatica. Le informazioni devono essere verificate e approvate da Gianmarco Buono prima di impostare `bozza: false`. Se cambia la guida, occorre **aggiornare anche la copia** salvata nel Progetto claude.ai "Sito blog gaming": la sincronizzazione non è automatica.

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
- Paragrafi brevi (2-4 frasi). Grassetto solo alla prima menzione dei 2-3 nomi protagonisti dell'articolo (di solito il gioco e lo studio o la console); mai su date, numeri, prezzi o nomi secondari.
- Usa sinonimi e termini correlati (nomi delle console, dello studio, del genere) invece di ripetere la parola chiave: niente keyword stuffing.
- Almeno un **link interno** a un altro articolo di Soffia Cartuccia pertinente (cerca in `content/articoli/`), con testo del link descrittivo, e un link alla **fonte ufficiale** quando esiste.
- Le **FAQ sono facoltative**: aggiungile solo se rispondono a domande reali e aggiungono informazioni non già presenti nel testo. Non inventare domande solo per riempire lo schema.
- **Lunghezza commisurata al contenuto**: una notizia breve può richiedere 200-350 parole, una notizia articolata 350-700, un approfondimento originale quanto necessario. Nessuna soglia fissa deve indurre a ripetizioni o aggiunte senza fonte.

**Viralità sui social**
- Il titolo deve funzionare anche da solo in un'anteprima su WhatsApp, Telegram o X.
- L'immagine di copertina è obbligatoria quando possibile: le anteprime senza immagine vengono cliccate molto meno e Google Discover mostra quasi solo articoli con immagini grandi.

## 4. Come scrivere

- Lingua italiana, tono diretto e informato, da appassionati per appassionati.
- **Scrivi sempre con parole tue.** Non copiare frasi dagli articoli delle fonti; al massimo una citazione breve (meno di 15 parole) tra virgolette, attribuita.
- Ogni fatto importante richiede **una fonte primaria verificabile** (annuncio, documento, intervista raccolta davvero, dichiarazione diretta dello sviluppatore) oppure **due fonti indipendenti** attendibili. Una notizia ripresa da più testate che citano la stessa fonte non è automaticamente confermata da più fonti indipendenti. Distingui fatti, dichiarazioni, opinioni e indiscrezioni.
- Le indiscrezioni non vanno trasformate in annunci: scrivi "secondo...", attribuisci la fonte fin dal titolo o dal primo paragrafo e indica chiaramente l'assenza di conferma ufficiale.
- Il materiale fornito direttamente da uno sviluppatore (come nel caso di *Pirates: Black Sails of the Sea*) è **materiale originale e fonte primaria**, con attribuzione precisa e consenso per le immagini. Non presentarlo come una "intervista" se non esistono domande e risposte effettivamente raccolte.
- **Scrivi come una persona, non come un'IA** (regole della skill Humanizer, la stessa usata per revisionare gli articoli il 13 novembre 2026):
  - niente contrasti costruiti del tipo "non è solo X, ma Y", "non X, bensì Y", "per ora è un indizio, non un annuncio": dici direttamente cosa è successo;
  - niente frasi di chiusura che ripetono il punto o lo "commentano" ("Il messaggio è chiaro", "Una cosa però è chiara", "Resta da vedere", "Una frenata che pesa"), niente frasi a effetto di una riga;
  - niente aperture di lancio ("Va detto chiaramente:", "Ecco tutto quello che c'è da sapere", "Non solo:", "Il paradosso è che") e niente gonfiature ("segna la fine di un'epoca", "un momento storico", "dato impressionante", "ben quattro");
  - niente elenchi di tre cose messi lì solo per ritmo: elenca quanti elementi ci sono davvero;
  - niente lineette (— o –) nel testo: usa virgole, punti, due punti o parentesi;
  - negli elenchi puntati niente etichette in grassetto con i due punti;
  - verbi semplici ("è", "ha") invece di "rappresenta", "si configura come", "vanta";
  - frasi di lunghezza varia, attacchi diversi, qualche reazione da appassionato quando ci sta (senza inventare opinioni sui fatti).
  - Prima di salvare, rileggi la bozza cercando proprio questi schemi e riscrivi le frasi che li contengono.
- **Revisione finale con la skill Humanizer (obbligatoria).** Quando la bozza è completa, carica con lo strumento Skill la skill `humanizer` (nome completo `anthropic-skills:humanizer`) e passaci il testo di ogni bozza, e ogni didascalia Instagram, seguendo la sua modalità file. Cambia solo la prosa: intestazione YAML, link, tabelle di dati, numeri, date, nomi, citazioni e note per la redazione restano identici. Poi ricontrolla che non sia sparito o cambiato nessun fatto e che la revisione non abbia aggiunto dettagli senza fonte. Se la skill non è disponibile nella sessione, fai la stessa revisione a mano con le regole qui sopra e scrivilo nelle note per la redazione ("revisione humanizer manuale").
- **Struttura flessibile:** apri con il fatto principale verificato, usa sottotitoli solo quando servono e non imporre a tutti i pezzi lo stesso numero di sezioni.
- Nelle **bozze** puoi usare commenti `<!-- NOTE PER LA REDAZIONE: ... -->` per registrare dubbi e richieste di verifica. **Prima di pubblicare**, risolvi tutti i dubbi, elimina le note dal file pubblico e registra eventuali questioni residue in un documento redazionale separato. Il controllo del repository blocca gli articoli pubblicati nuovi o modificati che contengono note interne.
- Se una verifica non può essere completata, circoscrivi l'articolo ai soli fatti confermati oppure mantienilo in bozza. Non rimuovere un dubbio soltanto per far passare i test.

## 4-bis. Tre formati editoriali, senza stampi uguali per tutti

**A. Notizia breve e verificata**
- Il fatto principale subito, fonte attribuita e conseguenza concreta. Se è una semplice dichiarazione, attribuirla al soggetto che l'ha fatta.
- Bastano 200-350 parole quando la notizia non ne giustifica altre. Una o due sezioni solo se aggiungono contesto.
- Per rumor o indiscrezioni: cosa è confermato, cosa non lo è, e perché l'affidabilità della fonte conta.

**B. Scoperta indie e storia originale**
- Parti da ciò che hai davvero visto, ricevuto o verificato: gioco, piattaforme, materiali, contatto con lo sviluppatore e link ufficiali.
- Differenzia con cura le **dichiarazioni dello sviluppatore** dai **fatti osservati direttamente**; non inventare citazioni né prove sul campo.
- Le parole "intervista" e "esclusiva" richiedono fatti che le giustifichino: risposte reali e, se si parla di esclusiva, controllo effettivo dell'esclusività.
- Una buona scoperta indie risponde anche alla domanda pratica: dove si gioca e dove si scarica, se già disponibile.

**C. Approfondimento retro o evergreen**
- Scegli una domanda che rimanga utile nel tempo e confronta documentazione storica, fonti primarie ed eventuali testimonianze.
- Racconta il contesto, le differenze tra versioni e le informazioni accertate; cita le incertezze invece di colmarle con supposizioni.
- Aggiorna i dettagli se cambiano e inserisci `aggiornato: AAAA-MM-GG` solo per modifiche effettive.

**Il punteggio Hype resta una valutazione editoriale**, non una prova che il fatto sia vero né un voto del pubblico. La scelta degli argomenti non deve premiare il rumor sensazionale a scapito di una buona storia originale.

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

1. Leggi la bozza, scegli il formato corretto, verifica date, numeri, piattaforme, citazioni e collegamenti, poi riscrivi con una voce riconoscibile.
2. Controlla tutte le fonti indicate e i diritti/crediti delle immagini. Se la fonte è una comunicazione originale dello sviluppatore, attribuiscila senza inventare un link inesistente.
3. Risolvi le **note per la redazione**: nessuna nota o marcatore di lavoro deve restare in un articolo pubblicato. Le questioni aperte vanno nel registro interno e il testo pubblico non deve affermare ciò che non è provato.
4. Esegui `npm run audit:editoriale` per avere il riepilogo dei pezzi che richiedono un controllo. È un report indicativo, non un fact-check automatico.
5. Esegui `npm test`; solo dopo il controllo finale umano di Gianmarco Buono imposta `bozza: false` e pubblica. **Il verde dei test non certifica da solo la verità delle notizie.**
