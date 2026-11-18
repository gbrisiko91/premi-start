# SEO tecnico e diagnosi indicizzazione — aggiornato 18/11/2026

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

## Controllo aggiornato: 18 novembre 2026

**Dati Google Search Console, ricerca Web (dal 5 al 17 novembre; gli ultimi giorni possono essere incompleti):**
- 11 novembre: 625 impressioni e 11 clic; 12 novembre: 7 impressioni e 0 clic; 13 e 14 novembre: 6 impressioni ciascuno, 0 clic. Il 16 novembre risulta 1 impressione e 1 clic.
- Il calo è effettivamente presente nei dati restituiti dalla proprietà `sc-domain:soffiacartuccia.it`, ma **non è dimostrata una penalizzazione** e non c'è una causa tecnica univoca verificata.
- La homepage italiana è `Submitted and indexed` e Googlebot l'ha scansionata il 16 novembre. Il controllo mirato su versioni Fortnite in ru/en/es/sv e articoli italiani Nintendo Milano/GTA 6 ha restituito `Crawled - currently not indexed`: su queste URL robots è consentito, il fetch è riuscito e i canonical dichiarati coincidono con quelli selezionati da Google. Non è prova dell'indicizzazione delle nuove pagine.

**Nuovo audit OpenSEO, ID `494ad6e3-7e39-468a-9023-be79bb3b160e` (18/11):**
- 50 pagine effettivamente esaminate, scansione limitata a 50; **817 URL non esaminate**: il campione non è l'intero sito.
- **0 segnalazioni di title duplicato**, 8 segnalazioni di contenuto breve (soprattutto quiz e sondaggi nelle lingue fi/no/ru/sv), 28 meta-description brevi, 6 title lunghi, 2 meta-description lunghe. Nessuna segnalazione critica emersa nel campione.
- Nel precedente audit del 15/11 il campione di 50 pagine mostrava 4 title duplicati, 27 contenuti brevi e 37 description brevi. Il confronto indica un miglioramento **nei campioni analizzati**, non una misura causale del rendimento o del numero di pagine effettivamente indicizzate.
- Il nuovo audit è consultabile nel progetto OpenSEO con l'ID sopra.

**Priorità successive (non interventi automatici):**
1. Controllare il **deploy di produzione** dell'ultimo merge, le pagine Sony/Xbox e la sitemap News nella risposta HTTP reale; GitHub Actions verdi e Deploy Preview non sono equivalenti a produzione verificata.
2. Continuare il controllo di Search Console quando arrivano dati consolidati; distinguere indicizzazione, impressioni e posizione, e confrontare le stesse URL a parità di intervallo.
3. Per quiz e sondaggi fi/no/ru/sv, valutare l'utilità per il lettore e aggiungere eventualmente istruzioni originali localizzate; **non applicare noindex indiscriminato**, non creare testo ripetitivo per raggiungere una soglia arbitraria.
4. Evitare dichiarazioni di recupero del traffico prima che siano confermate da dati successivi; non ricorrere a modifiche tecniche speculative.
