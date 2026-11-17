# SEO tecnico e diagnosi indicizzazione — 17/11/2026

## Risultati osservati (non supposizioni)
- **Search Console:** homepage italiana e inglese indicizzate; vari articoli campionati risultano *scansionati, attualmente non indicizzati*, con Googlebot ammesso e canonical self coerente. Alcuni URL recentissimi risultano ancora sconosciuti.
- **Rendimento (18/10–14/11):** 60 clic e 3.492 impressioni dalla ricerca web. Il forte calo giornaliero dal 12/11 è confermato dal report finale, ma non è stata identificata una causa univoca. Non affermare una penalizzazione.
- **Audit OpenSEO del 15/11, 50 pagine:** 4 segnalazioni di title duplicato (due coppie: autore de/es, quiz no/sv), 27 segnalazioni di pagine con poco testo, 37 meta-description brevi, crawl interrotto al limite di 50 pagine; non rappresenta l'intero sito.

## Intervento di questa PR
1. Meta-description della homepage descrittiva e localizzata per nove lingue. Lascia invariato il motto editoriale visibile.
2. Title SEO distinti per due coppie individuate nell'audit. I titoli visibili dei quiz e l'identità editoriale rimangono invariati.
3. Test automatico su *tutti* gli articoli pubblicati presenti negli indici generati: canonical identico alla propria URL, meta robots index/follow, inclusione nella sitemap, assenza di note di redazione; controllo di robots.txt.
4. Non aggiunge noindex a sezioni, non modifica il comportamento della sitemap News, non apre la pubblicazione automatica e non richiede modifiche a Netlify.

## Limiti e priorità editoriali
Una sitemap corretta **non obbliga Google a indicizzare**. I test garantiscono solo l'assenza di regressioni controllabili nel nostro HTML, non la qualità o l'indicizzazione. Le pagine leggere /quiz/, /sondaggio/, /indie/ sono contenuti interattivi/aggregazioni: valutarne caso per caso utilità e contenuti prima di escluderle dall'indice. Evitare creazione indiscriminata di pagine nuove: migliorare originalità, verificabilità e link interni degli articoli già pubblicati.

## Misurazione
- Dopo il merge, verificare live il deploy, i canonical e le pagine aggiornate. Registrare il risultato e non confondere il test build con un deploy completato.
- Riesaminare Search Console dopo il suo normale ritardo dati, confrontando pagine, impressioni, indicizzazione e clic. Nessuna garanzia di tempi/risultati.
- Tenere distinta la necessità futura di far scadere i vecchi URL nella sitemap News anche senza nuovi build.

Fonti ufficiali:
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors
