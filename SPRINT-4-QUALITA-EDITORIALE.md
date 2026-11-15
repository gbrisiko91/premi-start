# Sprint 4 — Qualità editoriale, non altre funzioni

Stato: **proposta di lavoro**, non una modifica automatica agli articoli pubblicati.
Responsabile della revisione e delle firme: **Gianmarco Buono**. Editore: **Soffia Cartuccia**.

## Diagnosi iniziale (repository del 15 novembre 2026)

- Nel repository risultano 71 file Markdown in `content/articoli/`. La quantità, da sola, non prova la qualità o la crescita del pubblico.
- La `GUIDA-REDAZIONE.md` suggerisce 450-800 parole e le FAQ per ogni articolo: utile come schema di partenza, ma rischia di rendere tutte le notizie troppo simili.
- Diverse bozze pubblicate includono ancora commenti `NOTE PER LA REDAZIONE` su dettagli da verificare. Il build li esclude dall'HTML pubblico, ma questo non equivale alla verifica dei fatti.
- `2026-11-05-pirates-black-sails-of-the-sea-gioco-offline.md` chiede conferma di piattaforma, disponibilità, prezzo, portata dell'offline e dettagli del gameplay. L'articolo è pubblicato: **priorità alta**.
- `2026-11-15-majoras-mask-remake-switch-2.md` riporta una speculazione e suggerisce una verifica di dati storici. Va mantenuta ben distinta da un annuncio ufficiale.
- `2026-11-15-take-two-ia-cloni-giochi.md` segnala in nota una fonte originale non consultata e una FAQ da verificare. La verifica deve precedere qualsiasi ulteriore rilancio.

Queste sono **segnalazioni interne da risolvere**, non dimostrazioni che le informazioni siano necessariamente false. Controllare sempre il testo effettivamente visibile online, non soltanto le note.

## Priorità immediata: controllo qualità degli articoli già pubblicati

1. Partire dagli articoli indicati sopra. Aprire la fonte primaria o contattare il soggetto interessato, quando possibile.
2. Per ogni affermazione dubbia: registrare la prova, correggere il testo oppure rimuovere il dettaglio non confermato.
3. Se cambia sostanzialmente il significato dell'articolo, segnalarlo chiaramente ai lettori secondo la pagina «Come lavoriamo»; indicare la data reale della correzione.
4. Non cancellare le note di controllo per far diventare verde un test: chiudere ogni punto soltanto dopo la verifica.
5. Ripetere la revisione sul gruppo più recente di articoli e poi sugli articoli storici. Tenere un registro essenziale (articolo, punto da verificare, fonte, esito, data, revisore).
6. Solo dopo la bonifica iniziale, irrigidire gradualmente i controlli automatici per impedire nuove pubblicazioni con note irrisolte; non bloccare in massa articoli vecchi senza un piano di correzione.

## Tre formati editoriali distinti

### A. Notizia verificata (breve)

- Risponde subito a chi/cosa/quando e attribuisce la fonte.
- Separa esplicitamente conferme, dichiarazioni e indiscrezioni.
- Lunghezza in funzione della notizia: non allungare a 450 parole se sono sufficienti 200-350.
- FAQ **solo quando realmente utili**; niente sezioni obbligatorie o frasi riempitive.

### B. Scoperta indie / intervista originale

- Presentare lo sviluppatore e la storia del progetto, con materiale originale autorizzato.
- Preparare domande aperte; intervistare davvero prima di utilizzare risposte, virgolette o la dicitura «intervista».
- Distinguere esperienza diretta, affermazioni dello sviluppatore e dati confermati indipendentemente.
- Titolo e introduzione basati sui fatti emersi, non su una promessa di esclusiva.

### C. Approfondimento evergreen / retro

- Rispondere a una domanda utile anche mesi dopo la pubblicazione (storia di una console, versione di un gioco, conservazione, emulazione legale, ecc.).
- Usare fonti primarie, documentazione storica o testimonianze autentiche, esplicitando le incertezze.
- Aggiornare con una data quando cambiano informazioni materiali.
- Preferire un confronto documentato o un dato originale al riassunto di articoli concorrenti.

## Calendario operativo indicativo: 4 settimane

| Periodo | Attività | Risultato verificabile |
|---|---|---|
| Settimana 1 | Verifica delle note aperte negli articoli prioritari; audit degli ultimi 10 pubblicati | Registro delle verifiche, correzioni motivate |
| Settimana 2 | Riscrivere la guida operativa con tre formati e FAQ facoltative; preparare una notizia breve ben documentata | 1 pezzo verificato e un modello riutilizzabile |
| Settimana 3 | Approfondimento su uno sviluppatore indie, iniziando dal dossier Pirates | Intervista **solo se** ottenute risposte reali; altrimenti aggiornamento documentato |
| Settimana 4 | Pubblicare un approfondimento retro o evergreen verificato; misurare l'utilità dei nuovi formati | 1 approfondimento e valutazione dei risultati |

Il calendario è una proposta, non un'automazione né una promessa di pubblicazione.

## Criteri di pubblicazione (checklist)

- [ ] Titolo non più forte delle prove; rumor riconoscibile fin dall'apertura.
- [ ] Fatti importanti supportati da almeno una fonte primaria o da due fonti indipendenti pertinenti; citazioni controllate all'origine.
- [ ] Date, numeri, prezzi, piattaforme e requisiti tecnici verificati.
- [ ] Immagini autorizzate o ufficiali, con crediti accurati e verifica di caricamento.
- [ ] Nessuna nota interna irrisolta; se servono conferme, il pezzo resta bozza o viene circoscritto ai soli fatti verificati.
- [ ] La prosa è originale, senza attribuire all'autore prove o interviste mai svolte.
- [ ] Firma Gianmarco Buono; editore Soffia Cartuccia; controllo finale umano.
- [ ] Link interni pertinenti, solo se aiutano il lettore; FAQ opzionali.
- [ ] Aggiornamenti e correzioni sostanziali spiegati con trasparenza.

## Come misurare il progresso

**Qualità**: numero di note irrisolte chiuse con evidenza, percentuale di nuovi pezzi con fonti primarie, correzioni segnalate, pluralità dei formati.

**Crescita**: dopo l'attivazione o l'accesso a strumenti di misurazione rispettosi della privacy, osservare query, impression, click e pagine che generano visite di ritorno. Non inventare visite, CTR o punteggi Lighthouse.

**Obiettivo dello sprint**: meno materiale ripetitivo e più informazioni difficili da trovare altrove. Non aumentare la produzione giornaliera finché la verifica non è sostenibile.

## Nota sul processo

La `GUIDA-REDAZIONE.md` indica che una sua copia è usata anche nel progetto Claude «Sito blog gaming». Quando si approveranno le nuove regole, **allineare anche quella copia** prima di considerarle applicate al flusso automatico. Questa proposta non cambia da sola l'automazione.
