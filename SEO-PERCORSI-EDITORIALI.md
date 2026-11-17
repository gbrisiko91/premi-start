# Percorsi editoriali e approfondimenti — 17 novembre 2026

## Problema osservato
L'audit OpenSEO del 15/11/2026 ha segnalato 27 pagine a contenuto limitato, comprese le nove raccolte indie, in un campione di 50 URL. Search Console mostra anche articoli scansionati ma non indicizzati. Si tratta di segnali da approfondire, non di una prova di penalizzazione o di una relazione causale dimostrata.

## Intervento
- Dagli articoli già pubblicati con tag `gta-6`, aggiunto un rimando statico alla **guida al lancio nella stessa lingua**. Se la guida è mancante o in bozza non appare alcun link; la guida non rimanda a se stessa.
- Dagli articoli già pubblicati con tag `indie`, aggiunto un collegamento alla propria raccolta linguistica.
- Le nove pagine `/indie/` hanno ora una spiegazione originale e breve sul criterio di selezione degli articoli, un percorso verso l'archivio e un link al metodo di verifica. Nessuna notizia o statistica inventata per aumentare il numero di parole.
- I percorsi sono HTML statico, disponibili senza JavaScript, e lo stile usa solo il CSS del sito.
- Test di regressione su lingue, bozze, URL, collegamenti reciproci e disponibilità della guida.

## Limiti
Non modifichiamo date, titoli, fonti o corpo delle notizie; non tocchiamo canonical, robots, sitemap, Netlify o workflow. I collegamenti aiutano il lettore e il crawler, ma **non garantiscono che Google indicizzi o premi le pagine**. Le pagine quiz e sondaggi vanno analizzate separatamente in funzione della loro utilità reale prima di introdurre testo aggiuntivo o noindex.

## Verifica
- CI `npm test` sull'ultimo commit e Netlify Deploy Preview.
- Dopo il merge, verificare il deploy pubblico, la leggibilità su mobile e i link a GTA 6 e /indie/.
- Rileggere i dati Search Console dopo il normale ritardo, senza trarre conclusioni dai primi giorni.
