# Soffia Cartuccia 2.0 — Handoff per nuova conversazione

> **Snapshot 18 novembre 2026, Europe/Rome.** Questo documento è una breve scheda di ripresa, **non** il registro principale. La fonte di verità operativa è [COLLABORAZIONE.md](COLLABORAZIONE.md); la verità sul codice e sul rilascio si verifica su GitHub e Netlify.

## Stato verificato a fine sessione

- Repository: [gbrisiko91/premi-start](https://github.com/gbrisiko91/premi-start); sito https://soffiacartuccia.it.
- `main`: **`7ef4128d419453fc8641d8cb8b9c3b0ca247b36d`** dopo il merge autorizzato della #46. **0 PR aperte** al controllo. Ultimo workflow GitHub Actions: [44386380609](https://github.com/gbrisiko91/premi-start/actions/runs/44386380609), **success**. La presente revisione documentale avanzerà il commit; verificare sempre live.
- PR #19–#45, #47–#49 e **#46 integrate** (registro in [COLLABORAZIONE.md §5](COLLABORAZIONE.md)). Il 18/11: #47 articolo GTA 5 Last Ride, #48 revisione accurata dell'evento, #49 GTA 6 Nuova Zelanda, #46 2 articoli + 40 traduzioni, autorizzata e integrata da ChatGPT dopo CI, gate e preview verdi.
- Nessuna pubblicazione automatica o auto-merge autorizzato/attivo. Gate editoriale **solo diagnostico**.

## Primo collaudo effettuato: mercoledì 18 novembre 2026

- **06:34** — Claude ha dichiarato segnale `ricerca-2026-11-18T06:34-ali9` e due articoli pronti; la configurazione privata e i riavvii non sono verificabili via GitHub.
- **07:20** — Claude ha aperto PR #46 con due articoli e 40 traduzioni in otto lingue; gate/CI/preview verdi. ChatGPT ha effettuato il merge **solo dopo l'approvazione esplicita** di Gianmarco.
- **07:47** — vecchia attività non disattivata: farlo **solo dopo aver visto** che le 07:20 traducono correttamente anche i nuovi articoli.
- **Craig Houston** — in revisione umana, non pubblicazione automatica.
- Claude ha dichiarato di avere allineato la copia privata della guida a GitHub; il primo ciclo è riuscito, ma l'idempotenza e i casi di guasto non sono stati ancora provati ripetutamente.

## Lavori e limiti non risolti

1. **Prossimo collaudo Claude**: la prima PR del 18/11 è stata completata e integrata, ma vanno ancora verificati anti-riuso su seconde esecuzioni e traduzioni stabili nei giorni successivi.
2. **Verifica produzione Netlify:** la PR #39 filtro Edge per `/sitemap-news.xml` e le altre modifiche sono in `main`, con test e preview superati, ma **risposta e header live non confermati**. Verificare anche il layout di Dragone7/IFreddo (#41) e i video Pirates (#43/#44) in browser: i test automatici verificano HTML e CSS, non l’interazione mobile. Non dichiarare che queste verifiche visive sono già completate.
3. **SEO Search Console:** calo impressioni dal 12/11 senza causa dimostrata; nuova scansione OpenSEO del 18/11 (campione 50 pagine) mostra 0 title duplicati, 8 pagine leggere, 28 meta brevi, 817 URL non scansionate per limite. Vedi `SEO-INDICIZZAZIONE-AUDIT.md`; non attribuire penalizzazioni o garantire risultati.
4. **Auto-merge**: NON ATTIVO; richiede bot/App separato, protezioni ed evidenze e almeno 5 giorni di dry-run, poi nuova approvazione di Gianmarco.
5. Non cancellare vecchi branch; non scrivere su `main` senza PR; non duplicare lavori condivisi.

## Ruoli e decisioni

Gianmarco decide e autorizza; **non deve fare merge manuali**. ChatGPT segue architettura, SEO tecnico, audit, verifiche e merge approvati. Claude segue notizie, fonti, traduzioni e operazioni nel Progetto privato. **`COLLABORAZIONE.md` è il registro unico**: aggiornare quello dopo ogni PR e mantenere questo documento come breve handoff, evitando informazioni concorrenti.

## Prompt da incollare in una nuova chat

> Riprendiamo Soffia Cartuccia 2.0 dal punto in cui ci siamo fermati. Leggi prima `COLLABORAZIONE.md` e `STATO-PROGETTO.md` nel repository `gbrisiko91/premi-start`; verifica dal vivo PR, commit `main`, GitHub Actions e Netlify perché i documenti potrebbero essere superati. Prosegui dal primo punto non completato: verifica produzione dopo il merge #46, risposta sitemap News e media Dragone7/Pirates, monitoraggio GSC e successivi cicli automatici Claude. La PR #46 è già integrata; non riaprire il lavoro. Non ripetere lavori già integrati, non pubblicare contenuti dubbi, non attivare auto-merge. Non chiedermi di fare merge manuali: esegui tu quelli che autorizzo, dopo controlli.
