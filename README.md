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

## Formato di un articolo

Vedi la sezione 6 di `GUIDA-REDAZIONE.md`. Campi per le immagini: `immagine` e `immagine_riserva` (indirizzo `https://...` oppure un file in `public/`, es. `/img/foto.jpg`), `alt_immagine`, `crediti_immagine`. Campi SEO: `titolo_seo`, `parola_chiave`, `aggiornato`.
