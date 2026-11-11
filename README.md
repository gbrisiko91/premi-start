# Soffia Cartuccia — blog di notizie gaming

Sito statico leggero: gli articoli sono file Markdown in `content/articoli/`, la build crea le pagine HTML in `dist/`. Nessun database, nessun costo di hosting.

## Cosa c'è dentro

| Percorso | A cosa serve |
|---|---|
| `content/articoli/` | Un file `.md` per articolo (anche le bozze, con `bozza: true`) |
| `content/chi-siamo.md` | Testo della pagina "Chi siamo" |
| `sito.config.mjs` | Nome, motto, indirizzo del sito e categorie |
| `src/stile.css` | Grafica |
| `GUIDA-REDAZIONE.md` | Le regole che l'algoritmo segue per scegliere le notizie e scrivere le bozze |
| `build.mjs` | Genera il sito (home, articoli, categorie, archivio, RSS, sitemap) |

## Provarlo sul tuo computer

Serve [Node.js](https://nodejs.org) 20 o più recente.

```bash
npm install
npm run anteprima   # sito con le bozze, segnalate da un banner giallo
npm run dev         # sito come lo vedranno i lettori (senza bozze)
```

Poi apri http://localhost:4321.

## Pubblicarlo gratis (GitHub + Netlify)

1. Crea un repository su GitHub (es. `soffia-cartuccia`) e carica tutti i file di questa cartella.
2. Su [netlify.com](https://www.netlify.com) scegli **Add new site → Import from GitHub** e seleziona il repository. Le impostazioni di build sono già in `netlify.toml`.
3. Collega il tuo dominio in Netlify e aggiorna `url` in `sito.config.mjs`.

Ogni volta che modifichi o aggiungi un file su GitHub, Netlify ricostruisce e pubblica il sito da solo.

## Il flusso di lavoro quotidiano

1. **Ogni mattina** l'attività pianificata di Claude cerca le notizie gaming più virali e aggiunge 3-5 bozze in `content/articoli/` di questo repository, con `bozza: true` (una copia finisce anche nella cartella `bozze/` del Progetto claude.ai "Sito blog gaming"). Ricevi una notifica quando sono pronte.
2. **Scegli** le bozze che ti interessano, leggi le note per la redazione in fondo a ciascuna, verifica e riscrivi con la tua voce (puoi farlo direttamente su GitHub con l'icona della matita).
3. **Pubblica** cambiando `bozza: true` in `bozza: false` e salvando: dopo un minuto è online.

Le bozze con `bozza: true` non vengono mai pubblicate. Quelle che non ti interessano puoi cancellarle o lasciarle lì.

4. **Traduzioni**: alle 7:20 di ogni mattina, insieme alla sincronizzazione delle bozze, Claude traduce in inglese, tedesco, spagnolo, norvegese, svedese, finlandese, giapponese e russo gli articoli pubblicati che non hanno ancora una traduzione (un assistente per lingua). Le traduzioni finiscono in `content/traduzioni/<lingua>/` con lo stesso nome del file italiano. Finché una traduzione manca, quella lingua semplicemente non mostra l'articolo.

Strumenti utili: `node strumenti/traduzioni.mjs mancanti` mostra cosa manca; `node strumenti/traduzioni.mjs istruzioni <lingua> <cartella>` prepara le istruzioni per chi traduce; `node strumenti/traduzioni.mjs importa <pacchetto>` salva un pacchetto di traduzioni. Se correggi un articolo italiano già tradotto, cancella le sue traduzioni: verranno rifatte la mattina dopo.

## Calendario uscite, sondaggio e newsletter

- **Calendario uscite** (`/uscite/`, e in homepage): le date sono in `rubriche.mjs`, nell'elenco `USCITE`. Per aggiungere un gioco copia una riga e cambia nome, data, piattaforme e fonte; `evidenza: true` mette il gioco nel conto alla rovescia grande. I giochi già usciti spariscono da soli.
- **Sondaggio della settimana** (`/sondaggio/`, e in homepage): le domande sono in `rubriche.mjs`, nell'elenco `SONDAGGI`, una per lunedì, già tradotte in 9 lingue. I voti si salvano su Netlify (come i "Mi piace"). Quando restano poche domande, la build stampa un avviso: Claude ne aggiunge di nuove.
- **Newsletter "Il Soffio della settimana"** (solo in italiano, in homepage e in fondo agli articoli): il modulo invia le iscrizioni alla funzione `/api/newsletter` (in `netlify/functions/newsletter.mjs`), che le passa a **Brevo** dal server, così i blocchi pubblicità dei visitatori non le fermano (lista della newsletter, con email di doppia conferma); l'indirizzo del modulo Brevo è in `sito.config.mjs`, alla voce `newsletter`. **Ogni domenica alle 10:00 (11:00 con l'ora legale) parte da sola**: la funzione `netlify/functions/newsletter-domenica.mjs` compone il Soffio con le 5 notizie più virali pubblicate nella settimana e lo spedisce tramite l'API di Brevo (serve che la chiave `BREVO_API_KEY` abbia anche il permesso "Campagne email"). Per saltare una settimana: variabile Netlify `NEWSLETTER_AUTOMATICA` = `no`; per tornare all'invio a mano: `invioAutomatico: false` in `sito.config.mjs`. In più, ogni domenica Claude salva una copia del testo nella cartella `newsletter/` del Progetto (si genera anche a mano con `node strumenti/newsletter.mjs`): in Brevo crei una campagna email, incolli il testo e la invii alla lista. Se cambi servizio, aggiorna `azione`, `campo`, `fornitore` e `campiExtra`: la privacy si aggiorna da sola. Lasciando `azione` vuoto, le iscrizioni tornano al pannello Forms di Netlify.

## Missione 2K: voto della top 100

- **Pagina** `/top-100/` (solo italiano): ognuno sceglie fino a 10 giochi dall'elenco e può proporne uno che manca. Si vota dal 14 al 20 novembre 2026 compresi; le date, il numero di scelte e l'elenco dei giochi sono in `top100.mjs`. Durante il voto la pagina del link in bio (`/instagram/`) mostra in cima il tasto "🏆 Vota la top 100".
- **Aggiungere giochi** (per esempio quelli più proposti nei commenti o nel campo "Manca il tuo gioco?"): copia una riga in `top100.mjs` con un id nuovo. Non cambiare l'id di un gioco già votato.
- **Vedere i risultati**: su Netlify, in *Site configuration → Environment variables*, crea `TOP100_CHIAVE` con una parola segreta, rifai il deploy e apri `https://soffiacartuccia.it/top-100/?chiave=LA-PAROLA`. C'è il tasto per copiare la top 100. Non condividere quel link.
- **Anti-furbetti**: il voto è legato a un codice casuale nel browser (si può modificare fino alla chiusura); da una stessa connessione si accettano al massimo 15 votanti diversi. I voti sono salvati su Netlify Blobs come quelli del sondaggio.

## Formato di un articolo

Vedi la sezione 6 di `GUIDA-REDAZIONE.md`. Campi per le immagini: `immagine` e `immagine_riserva` (indirizzo `https://...` oppure un file in `public/`, es. `/img/foto.jpg`), `alt_immagine`, `crediti_immagine`. Campi SEO: `titolo_seo`, `parola_chiave`, `aggiornato`.
