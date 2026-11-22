# Guida redazionale di Soffia Cartuccia

Versione del 17/11/2026, allineata alle istruzioni di Gianmarco Buono e alla revisione di ChatGPT (gate editoriale, PR #29 e #37).

Questa guida è letta ogni mattina dall'attività delle 06:34 (ricerca e preparazione articoli) e dalla sincronizzazione delle 07:20. La copia valida è quella nel Progetto claude.ai "Sito blog gaming"; la copia `GUIDA-REDAZIONE.md` nel repository GitHub va tenuta identica tramite PR.

## 0. Obiettivo e flusso

Lo scopo non è pubblicare il maggior numero possibile di articoli, ma contenuti **originali, affidabili e interessanti** che portino lettori su Soffia Cartuccia e migliorino indicizzazione e traffico misurabile (Google Search Console). Meglio tre articoli solidi che cinque deboli.

Flusso quotidiano:

1. **06:34, ricerca e preparazione** (solo nel Progetto privato): ogni articolo viene classificato in uno dei tre stati del §6 e salvato in `bozze/`. A fine lavoro viene scritto il segnale di completamento in `bozze/_stato/AAAA-MM-GG.md`.
2. **07:20, sincronizzazione**: attende il segnale del giorno, porta su GitHub **solo gli articoli PRONTI** (più le traduzioni verificate) in una PR `contenuti/AAAA-MM-GG`. Non fa merge e non tocca `main`.
3. **Rilascio**: Gianmarco è il responsabile editoriale e autorizza i rilasci; il merge può essere eseguito per suo conto da ChatGPT o da un assistente autorizzato, dopo aver controllato attendibilità e completezza editoriale, GitHub Actions, report del gate, anteprima Netlify sull'ultimo commit e assenza di conflitti con `main`.

Il **gate editoriale** (`strumenti/gate-pubblicazione.mjs`) è diagnostico: segnala problemi ma non approva le notizie. L'auto-merge resta disattivato; la sua attivazione richiede cinque giorni di prove documentate, controlli di sicurezza e un'autorizzazione esplicita di Gianmarco.

Il repository GitHub è **pubblico**: bozze incomplete, articoli con dubbi aperti e articoli in revisione umana non vanno mai nel repository.

## 1. Dove cercare

Cerca le notizie delle ultime 24-36 ore su almeno tre di questi gruppi:

- **Fonti ufficiali** (da cercare sempre per prime): blog PlayStation, Xbox Wire, Nintendo, Steam, siti e comunicati degli editori e degli sviluppatori, account ufficiali, comunicati stampa (PR Newswire, Business Wire).
- **Testate italiane**: Multiplayer.it, Everyeye.it, IGN Italia, Spaziogames, Eurogamer.it, Game Experience.
- **Testate internazionali**: IGN, VGC (Video Games Chronicle), Eurogamer, Kotaku, The Verge (sezione games), GamesIndustry.biz, Gematsu (Giappone), Nintendo Life, Push Square.
- **Segnali di interesse**: discussioni più votate su Reddit (r/Games, r/gaming, r/PS5, r/NintendoSwitch, r/XboxSeriesX, r/pcgaming, r/retrogaming), trailer in tendenza su YouTube, ricerche in crescita su Google Trends Italia (categoria giochi).

Se un indirizzo non si apre direttamente, trovalo con una ricerca e apri il risultato. Una fonte che non hai aperto non conta come verificata.

## 2. Come scegliere le notizie (punteggio 0-100)

Per ogni notizia candidata assegna un punteggio sommando:

| Criterio | Punti |
|---|---|
| Ripresa da 5 o più testate diverse | fino a 30 |
| Grande discussione social (post Reddit con migliaia di voti, trailer con milioni di visualizzazioni, trend) | fino a 25 |
| Interesse per il pubblico italiano (uscita in Italia, prezzo in euro, studio italiano, giochi molto popolari da noi) | fino a 15 |
| Freschezza (meno di 12 ore = massimo) | fino a 15 |
| Effetto sorpresa o polemica (annuncio inatteso, rinvio, prezzi) | fino a 15 |

Il punteggio è una valutazione editoriale, non una prova che il fatto sia vero.

**Priorità**: notizie con interesse reale, fonti primarie, approfondimenti utili, **scoperte indie**, **retrogaming** (includine una ogni volta che ce n'è una con almeno 50 punti: è il tema che distingue Soffia Cartuccia) e i grandi argomenti gaming del momento. Preferisci una varietà di categorie.

**Scarta**: notizie già coperte negli ultimi 7 giorni (controlla `bozze/` e gli articoli pubblicati: se c'è una novità, è un aggiornamento, non un nuovo articolo), offerte e sconti puri, contenuti sponsorizzati, voci prive di fonti credibili, articoli ripetitivi o costruiti solo per riempire il calendario.

## 3. SEO: Google, Google Discover e social

Parti dalla **parola chiave principale**: la frase che un lettore italiano scriverebbe su Google (es. "the duskbloods rinvio", "gta 6 prezzo"). Verifica con una ricerca come la cercano le persone e quali titoli usano i concorrenti in Italia, poi fai di meglio.

**Titoli**
- `titolo` (H1 e anteprime social): 55-80 caratteri, parola chiave vicino all'inizio, dice esattamente cosa è successo e dà un motivo per cliccare. Mai promettere ciò che il testo non mantiene.
- `titolo_seo`: **massimo 60 caratteri**, parola chiave all'inizio. Il sito aggiunge " – Soffia Cartuccia".
- Nome del file: `AAAA-MM-GG-parola-chiave-breve.md`, 3-6 parole, minuscole, trattini, niente accenti.

**Sommario (meta description)**
- Ideale 140-155 caratteri, **obbligatorio tra 120 e 160** (il gate lo controlla). Contiene la parola chiave e riassume la notizia. Contalo prima di salvare.

**Testo**
- Parola chiave (o una variante naturale) nelle prime 100 parole e in almeno un sottotitolo `##`.
- Primo paragrafo di 2-3 frasi che risponde subito a chi, cosa, quando.
- Sottotitoli `##` che sono frasi cercabili, non etichette generiche.
- Paragrafi brevi (2-4 frasi). Grassetto solo alla prima menzione dei 2-3 nomi protagonisti; mai su date, numeri, prezzi o nomi secondari.
- Sinonimi e termini correlati invece di ripetere la parola chiave.
- **Almeno un link interno realmente utile** verso un articolo **già pubblicato** (`bozza: false` su `main`; puoi controllarlo in sola lettura su `https://raw.githubusercontent.com/gbrisiko91/premi-start/main/content/articoli/<file>`). Formato: `[testo descrittivo](/articoli/<nome-file-senza-data-e-senza-.md>/)`. Mai link a bozze o a URL inventati. Il link deve aiutare il lettore (stesso gioco, stessa serie, stesso tema), non essere messo a caso.
- Un link alla **fonte ufficiale** quando esiste.
- **FAQ facoltative**: solo se rispondono a domande reali con informazioni nuove.
- **Lunghezza commisurata al contenuto**: notizia breve 200-350 parole, notizia articolata 350-700, approfondimento quanto serve. Nessuna soglia deve indurre a ripetizioni o aggiunte senza fonte.

**Social**: il titolo deve funzionare anche da solo in un'anteprima su WhatsApp, Telegram o X.

## 4. Come scrivere e verificare

- Lingua italiana, tono diretto e informato, da appassionati per appassionati. Testo giornalistico naturale.
- **Scrivi sempre con parole tue.** Al massimo una citazione breve (meno di 15 parole) tra virgolette, attribuita, letta davvero in una fonte e tradotta fedelmente.
- **Verifica del fatto principale**: serve **una fonte primaria verificabile** (annuncio, comunicato, documento, post dell'autore, dichiarazione diretta) oppure **due fonti indipendenti** attendibili. Più testate che riprendono la stessa fonte non sono fonti indipendenti. **Se il fatto principale non è confermato, l'articolo non è pronto.**
- Verifica nomi, date (data dell'evento, non dell'articolo che lo riporta), orari con conversione in ora italiana, piattaforme, prezzi, numeri e citazioni.
- **Dettagli secondari non verificabili** (statistiche di contorno, biografie non indispensabili, deduzioni, valutazioni come "nessun indie", dubbi su regolamenti): eliminali, mantenendo l'articolo accurato e completo. Non lasciarli nel testo con una nota.
- Distingui fatti, dichiarazioni, opinioni e indiscrezioni. Le indiscrezioni non diventano annunci: "secondo...", fonte attribuita dal titolo o dal primo paragrafo, assenza di conferma ufficiale dichiarata. Sono sempre in **revisione umana** (§6).
- Il materiale fornito direttamente da uno sviluppatore è fonte primaria, con attribuzione precisa. Non chiamarlo "intervista" se non esistono domande e risposte raccolte davvero.
- Non inventare recensioni, prove dirette, interviste, esperienze o dichiarazioni personali di Gianmarco Buono.

**Scrivi come una persona, non come un'IA** (regole della skill Humanizer):
- niente contrasti costruiti ("non è solo X, ma Y", "non X, bensì Y");
- niente frasi di chiusura che ripetono o "commentano" il punto ("Il messaggio è chiaro", "Resta da vedere"), niente frasi a effetto di una riga;
- niente aperture di lancio ("Va detto chiaramente:", "Ecco tutto quello che c'è da sapere") e niente gonfiature ("un momento storico", "dato impressionante");
- niente elenchi di tre cose messi lì per ritmo;
- niente lineette (— o –) nel testo: virgole, punti, due punti o parentesi;
- negli elenchi puntati niente etichette in grassetto con i due punti;
- verbi semplici ("è", "ha") invece di "rappresenta", "si configura come", "vanta";
- frasi di lunghezza varia, qualche reazione da appassionato quando ci sta (senza inventare opinioni sui fatti).

**Revisione finale con la skill Humanizer** (`anthropic-skills:humanizer`, modalità file) su ogni articolo e didascalia Instagram. Cambia solo la prosa: YAML, link, dati, numeri, date, nomi e citazioni restano identici. Poi ricontrolla che nessun fatto sia cambiato o sparito e che non siano stati aggiunti dettagli senza fonte. Se la skill non è disponibile, revisione manuale con le regole qui sopra, indicata nel riepilogo.

**Struttura flessibile**: apri con il fatto principale verificato, sottotitoli solo quando servono.

## 4-bis. Tre formati editoriali

**A. Notizia breve e verificata**: fatto principale subito, fonte attribuita, conseguenza concreta. 200-350 parole quando bastano.

**B. Scoperta indie e storia originale**: parti da ciò che hai davvero visto o verificato (gioco, piattaforme, materiali, link ufficiali). Distingui dichiarazioni dello sviluppatore e fatti osservati. "Intervista" ed "esclusiva" solo se giustificate. Rispondi anche a: dove si gioca, dove si scarica.

**C. Approfondimento retro o evergreen**: una domanda utile nel tempo, documentazione storica e fonti primarie, incertezze dichiarate invece che colmate. `aggiornato: AAAA-MM-GG` solo per modifiche effettive.

## 5. Immagini (richieste quando esiste una fonte ufficiale)

Ogni articolo deve avere un'**immagine reale con i crediti** ogni volta che ne esiste una ufficiale: è una richiesta esplicita di Gianmarco (22/11/2026), perché le copertine illustrate del sito vanno usate solo come ultima scelta. Prima di lasciare i campi vuoti, prova le fonti qui sotto nell'ordine indicato e annota nella scheda di stato quali hai provato.

**Ammesse, in ordine di preferenza**
1. Immagine dell'annuncio sul canale ufficiale: post di PlayStation Blog, Xbox Wire, Nintendo, Rockstar Newswire, sito o press kit dell'editore o dello sviluppatore. Apri la pagina con WebFetch e prendi l'`og:image` o l'immagine principale.
2. Asset ufficiali della pagina Steam del gioco, caricati dall'editore per la promozione: `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/NUMERO/library_hero.jpg` come copertina e `.../NUMERO/header.jpg` come `immagine_riserva`. Controlla che il numero corrisponda al gioco giusto. Crediti: "Immagine: Editore via Steam".
3. Per hardware e accessori: immagine del sito ufficiale del produttore, solo se l'articolo parla di quel prodotto. Crediti: "Immagine: Produttore, sito ufficiale".
4. Wikimedia Commons con licenza libera (pubblico dominio, CC0, CC BY, CC BY-SA), soprattutto per le console storiche negli articoli retro: le foto di Evan-Amos sono in pubblico dominio. Crediti con autore e licenza, es. "Immagine: Evan-Amos, Wikimedia Commons (pubblico dominio)". Indirizzi già usati e funzionanti:
   - Nintendo DS: `https://upload.wikimedia.org/wikipedia/commons/4/42/Nintendo-DS-Fat-Blue.jpg`
   - Nokia N-Gage: `https://upload.wikimedia.org/wikipedia/commons/1/11/Nokia-NGage-LL.jpg`
   - Super Nintendo: `https://upload.wikimedia.org/wikipedia/commons/3/31/SNES-Mod1-Console-Set.jpg`
   - PlayStation: `https://upload.wikimedia.org/wikipedia/commons/3/39/PSX-Console-wController.jpg`
   - Nintendo 64: `https://upload.wikimedia.org/wikipedia/commons/1/11/N64-Console-Set.jpg`
5. Materiale fornito direttamente dallo sviluppatore con consenso all'uso.

Se il gioco non ha ancora immagini ufficiali (per esempio un titolo trapelato da una classificazione), non usare artwork di altri giochi della serie: lascia la copertina illustrata e scrivilo nella scheda.

**Mai**: immagini di altre testate, Google Immagini, Pinterest o social; foto di persone reali; immagini legate a tragedie o cronaca; leak; immagini generate con l'IA presentate come reali.

**Campi**
- Con immagine: `immagine` (URL `https://`), facoltativa `immagine_riserva` (URL `https://`), `alt_immagine` (8-15 parole), `crediti_immagine` (proprietario e fonte, es. "Immagine: Editore, press kit ufficiale").
- **Senza immagine**: ometti del tutto `immagine`, `immagine_riserva`, `alt_immagine` e `crediti_immagine`, oppure lasciali tutti vuoti. Non lasciare alt o crediti senza immagine (il gate lo segnala).

## 6. I tre stati e la scheda di verifica

Ogni articolo ha nell'intestazione YAML la **scheda di verifica**:

```yaml
verifica:
  stato: verificata          # verificata | da_rivedere
  natura: ufficiale          # ufficiale | dichiarazione | report | indiscrezione | intervista | recensione
  fonti_primarie: 1          # fonti primarie realmente aperte
  fonti_indipendenti: 2      # testate attendibili indipendenti realmente aperte
  controllata_il: 2026-11-18T07:05+01:00
  dubbi: []                  # dubbi ancora aperti
```

**PRONTO**
- `bozza: false`, `verifica.stato: verificata`, `dubbi: []`.
- Fatto principale confermato (§4), fonti pertinenti in `fonti`, SEO completa (§3), almeno un link interno utile a un articolo pubblicato.
- **Nessuna nota interna** nel file: niente `<!-- -->`, NOTE PER LA REDAZIONE, DA VERIFICARE, TODO, FIXME, TBD. Le informazioni di lavoro vanno solo nel riepilogo.
- Natura `ufficiale`, `dichiarazione` o `report` non sensibile.

**NON PRONTO**
- `bozza: true`, `verifica.stato: da_rivedere`, dubbi elencati in `verifica.dubbi`. Le note `<!-- NOTE PER LA REDAZIONE: ... -->` sono ammesse.
- Resta esclusivamente nel Progetto privato.

**REVISIONE UMANA** (anche se le fonti sono verificate)
- `bozza: true` e `verifica.revisione_umana: "<motivo>"`.
- Riguarda: indiscrezioni, leak e rumor; interviste; recensioni, prove dirette e testi in prima persona di Gianmarco; vicende delicate su persone reali (licenziamenti, accuse, cause, decessi, salute); rettifiche di articoli già pubblicati; altri contenuti che richiedono una valutazione editoriale specifica.
- Resta nel Progetto privato. Non viene mai pubblicato automaticamente, neanche se arrivano ulteriori conferme: decide Gianmarco.

## 7. Formato del file

Un file Markdown per articolo, `bozze/AAAA-MM-GG-parola-chiave-breve.md`:

```markdown
---
titolo: "The Duskbloods rinviato al 2027: perché FromSoftware ha deciso di aspettare"
titolo_seo: "The Duskbloods rinviato al 2027: cosa cambia"
sommario: "FromSoftware rinvia The Duskbloods, l'esclusiva Switch 2, al 2027 per migliorare combattimento e bilanciamento dopo il network test di agosto."
parola_chiave: "the duskbloods rinvio"
data: 2026-11-18
categoria: console
tag: [the-duskbloods, fromsoftware, nintendo-switch-2]
viralita: 82
bozza: false
verifica:
  stato: verificata
  natura: ufficiale
  fonti_primarie: 1
  fonti_indipendenti: 2
  controllata_il: 2026-11-18T07:05+01:00
  dubbi: []
fonti:
  - titolo: "Nintendo – comunicato ufficiale"
    url: "https://..."
  - titolo: "Nome testata – titolo del pezzo"
    url: "https://..."
---

Testo dell'articolo in Markdown...
```

Categorie ammesse: `console`, `pc`, `retro`, `industria`. Tag 3-5, minuscolo con trattini. `data` = giorno di preparazione (il gate accetta oggi o ieri). Niente HTML grezzo nel testo. Per gli aggiornamenti, `aggiornato: AAAA-MM-GG`.

## 8. Segnale di completamento (06:34)

Al termine della ricerca, scrivi `bozze/_stato/AAAA-MM-GG.md`:

```yaml
---
data: 2026-11-18
completato: true
esecuzione: "ricerca-2026-11-18T06:34-7F3A"  # esempio: suffisso diverso a ogni singola esecuzione
iniziata: 2026-11-18T06:34+01:00
conclusa: 2026-11-18T06:49+01:00
articoli:
  - file: 2026-11-18-esempio.md
    stato: pronto                        # pronto | non_pronto | revisione_umana
    motivo: ""
---
```

Il segnale è valido solo per la data indicata. Il campo `esecuzione` deve essere **diverso a ogni avvio**, compresi i riavvii dello stesso giorno (identificativo nativo della run o timestamp con suffisso univoco). Salvare il segnale **solo dopo** che tutti i file e il riepilogo sono completi; se l'esecuzione si interrompe prima della fine, il segnale non va scritto. Se lo stesso giorno la ricerca viene ripetuta, la sincronizzazione deve usare soltanto il segnale più recente, completo e coerente con i file.

## 9. Sincronizzazione e rilascio (07:20)

1. La sincronizzazione legge il segnale di **oggi** e controlla `data`, `completato: true`, ID di `esecuzione` non vuoto e **non già elaborato**, `iniziata` e `conclusa` coerenti, presenza dell’elenco `articoli` e corrispondenza fra gli elementi pronti e i rispettivi file. Un segnale già consumato, scaduto o relativo a una precedente esecuzione non deve provocare una nuova PR né duplicare contenuti. Se manca un segnale valido, riprova ogni 10 minuti per un’ora al massimo; se non arriva, **si interrompe e avvisa Gianmarco**, senza copiare bozze incomplete.
2. Porta su GitHub solo gli articoli che il segnale classifica come `pronto` e che rispettano ancora tutti i criteri del §6, più le traduzioni verificate degli articoli già pubblicati o di quelli pronti nella stessa PR.
3. Esegue `npm run audit:editoriale`, `npm test`, i build e il gate diagnostico, e riporta gli esiti nella PR.
4. Crea o aggiorna la PR `contenuti/AAAA-MM-GG`, senza merge e senza toccare `main`. Le modifiche a `rubriche.mjs` vanno in una PR separata.
5. Il merge avviene per conto di Gianmarco dopo i controlli del §0. **Il verde dei test e del gate non certifica la verità delle notizie.**
