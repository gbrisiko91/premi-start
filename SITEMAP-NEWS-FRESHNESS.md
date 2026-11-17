# Sitemap Google News sempre aggiornata (Edge Function)

## Problema

La sitemap `sitemap-news.xml` è generata dalla build e contiene solo notizie pubblicate oggi o ieri (Europe/Rome).
Se non avvengono nuovi deploy, il file statico mantiene URL divenuti vecchi, contrariamente alle best practice di Google News.

## Soluzione

`netlify/edge-functions/sitemap-news-freshness.js` intercetta **solo** `/sitemap-news.xml` tramite dichiarazione inline Netlify.
Prende la versione statica generata dal build corrente (`context.next()`), elimina gli URL con `news:publication_date`
diversa da oggi o ieri, e restituisce il documento XML con `Cache-Control: no-store` e `Netlify-CDN-Cache-Control: no-store`.

- Non è un job pianificato, non crea rebuild e non modifica articoli o feed.
- Non introduce nuovi URL: la build pubblica sempre quelli nuovi, l’Edge Function elimina soltanto quelli scaduti.
- Dopo giorni senza pubblicazione, una sitemap News **vuota è normale**, come specifica Google.
- Le altre sitemap e `robots.txt` restano statici e invariati.
- Il filtro usa Europe/Rome, inclusi passaggi di fuso e di anno; mantiene l’esclusione conservativa degli articoli di oltre un giorno precedente.
- In caso di errore 404 della risorsa statica, conserva l’errore originale; non genera un elenco inventato.
- L’Edge Function viene eseguita sulle richieste a quella URL e comporta consumo della quota Netlify Edge Functions. Nessun segreto o variabile di produzione aggiunti.

## Test e verifica del rilascio

Test Node: generatore reale, scadenza senza deploy, fusi UTC/Roma, cambio dell’ora legale, markup XML, 404 e caching.
Netlify Deploy Preview e GitHub CI devono essere verdi sul commit finale.
In produzione verificare, dopo il merge, la risposta XML e gli header della `/sitemap-news.xml`. Se la verifica live non è possibile, **non affermare che l’Edge Function è attiva**.

Documentazione:
- Google: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
- Netlify: https://docs.netlify.com/build/edge-functions/api/
- Netlify: https://docs.netlify.com/build/edge-functions/declarations/
- Netlify cache: https://docs.netlify.com/build/caching/caching-overview/
