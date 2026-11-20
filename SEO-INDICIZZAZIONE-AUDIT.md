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


## Controllo Google Search Console: 20 novembre 2026 (verifica diretta)

**Fonte:** proprietà collegata `sc-domain:soffiacartuccia.it`, letta con OpenSEO il 20/11/2026. Dati di rendimento per ricerca web (orario e ritardo propri di Search Console), periodo 05–17 novembre, stato **final**. Gli ultimi giorni possono essere a zero perché i risultati pubblici sono quasi assenti, non perché Google abbia confermato una penalizzazione.

### Cosa mostrano i dati
- 11/11: **625 impressioni, 11 clic**. 12/11: **7 impressioni, 0 clic**. 13/11 e 14/11: **6 impressioni ciascuno, 0 clic**. 15/11: 0; 16/11: 1 impressione e 1 clic; 17/11: 0. Il brusco calo risulta confermato nel report consolidato ma **non se ne conosce la causa**.
- Nelle ultime 28 giornate consolidate (21/10–17/11), fra le URL che hanno generato clic figurano Fortnite negozio pirata in russo (14 clic / 160 impressioni), inglese (11 / 365), spagnolo (7 / 150); Worlds T1/Karmine in italiano (3 / 95); Zelda Ocarina of Time remake in italiano (3 / 24). I conteggi sono per singola URL, non per dominio.
- Il report delle *performance* è storico e diverso dall'ispezione di indicizzazione *corrente*: un URL può avere clic in un intervallo precedente e oggi essere non indicizzato.

### Ispezione delle URL
- `https://soffiacartuccia.it/`: **indicizzata**, crawl mobile del 16/11, canonical dichiarato e scelto coincidono.
- `/articoli/gta-6-disponibile-italia/`: **URL sconosciuta a Google** al momento dell'ispezione; articolo pubblicato solo il 19/11, quindi non si può concludere che sia bloccato.
- `/articoli/gta-6-guida-lancio/`: **scoperta, non indicizzata**; rilevata la sitemap.
- `/en/articles/gta-6-preload-date-file-size/`: **scansionata, non indicizzata**; robots ammesso, fetch riuscito, canonical dichiarato/scelto coerente (ultimo crawl 15/11).
- `/ru/articles/fortnite-pirate-shop-token/`: **scansionata, non indicizzata**; robots ammesso, fetch riuscito e canonical coerente (ultimo crawl 14/11).
- `/articoli/fortnite-gettone-negozio-pirata/`: **scansionata, non indicizzata**; robots ammesso, fetch riuscito e canonical coerente (ultimo crawl 13/11).
- `/articoli/worlds-2026-t1-karmine-semifinali/`: **scansionata, non indicizzata**; robots ammesso, fetch riuscito e canonical coerente (ultimo crawl 8/11).
- `/sfondi/`: **scoperta, non indicizzata**, presente nella sitemap; pagina aggiornata dopo il traguardo 2.500 follower.

### Priorità operative successive
1. **Verificare produzione e link da Instagram:** landing `/instagram/` noindex voluta, premi e articoli collegati; controllare direttamente risposte HTTP della CDN/Netlify. Gli UTM presenti sui link non significano che GA4 o altra analisi siano installati.
2. **Rafforzare poche pagine con domanda dimostrata:** Fortnite negozio pirata nelle lingue con impressioni, GTA 6 guida/preload, Worlds. Cercare lacune informative verificabili, aggiornamenti realmente nuovi e link contestuali; non aggiungere testo di riempimento o alterare versioni tradotte senza revisione.
3. **Non cambiare indiscriminatamente robots, canonical o sitemap:** nei campioni di URL scansionate questi elementi risultano già coerenti; il problema attuale non è dimostrato essere di accessibilità.
4. **Riesaminare GSC dopo il normale ritardo dati**, confrontando periodi identici e distinguendo le metriche Search Console (impressioni/clic) dallo stato di indicizzazione (ispezione).
5. **Non proclamare recupero di traffico** finché GSC non mostri trend stabili; non è disponibile una causa verificata del crollo del 12/11.

**Riferimenti:** [Google Search Console](https://search.google.com/search-console), [progetto OpenSEO](https://app.openseo.so/p/8d399ae4-3611-4c7e-a913-cb5fc1f49af0), [report precedente 18/11](https://app.openseo.so/p/8d399ae4-3611-4c7e-a913-cb5fc1f49af0).
