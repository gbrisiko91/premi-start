# Soffia Cartuccia 2.0 — Handoff per nuova conversazione

> **Snapshot 17 novembre 2026, Europe/Rome.** Questo documento è una breve scheda di ripresa, **non** il registro principale. La fonte di verità operativa è [COLLABORAZIONE.md](COLLABORAZIONE.md); la verità sul codice e sul rilascio si verifica su GitHub e Netlify.

## Stato verificato a fine sessione

- Repository: [gbrisiko91/premi-start](https://github.com/gbrisiko91/premi-start); sito https://soffiacartuccia.it.
- `main`: **`0eac3e9cd7895490c8f82a01d17a70b3281be329`** dopo il merge #44 e prima del presente aggiornamento dei documenti. **0 PR aperte** al controllo. Ultimo workflow GitHub Actions: [44182813602](https://github.com/gbrisiko91/premi-start/actions/runs/44182813602), **success**. La revisione documentale può avanzare ulteriormente `main`: verificare sempre il nuovo SHA.
- PR **#19–#44 integrate** (registro e dettagli in [COLLABORAZIONE.md §5](COLLABORAZIONE.md)). Recenti fondamentali: #31 sanitizer HTML; #32 Grammy/Miyamoto/DualStation; #33 SEO e test; #34–#35 percorsi e guide multilingua; #36 rettifica GTA 6; #37 immagini opzionali; #38 guida redazionale; #39 sitemap News dinamica; #40 controllo `revisione_umana`; **#41 foto intere, #42 memoria consolidata, #43 controlli/sorgenti video e #44 autoplay muto autorizzato con controlli manuali**.
- Nessuna pubblicazione automatica o auto-merge autorizzato/attivo. Gate editoriale **solo diagnostico**.

## Primo collaudo di domani: mercoledì 18 novembre 2026

- **06:34** — Claude nel Progetto privato cerca notizie verificate, le classifica `pronto`, `non_pronto`, `revisione_umana`, salva segnale del giorno con ID differente a ogni run.
- **07:20** — Claude attende il segnale, massimo un'ora (10 minuti fra tentativi). Crea una PR con soli articoli pronti e traduzioni; nessun merge autonomo.
- **07:47** — vecchia attività non disattivata: farlo **solo dopo aver visto** che le 07:20 traducono correttamente anche i nuovi articoli.
- **Craig Houston** — in revisione umana, non pubblicazione automatica.
- La copia `GUIDA-REDAZIONE.md` di GitHub è aggiornata via #38; **Claude deve confermare di aver allineato la copia privata** che le attività leggono davvero. La prima esecuzione è ancora da verificare: non anticipare esiti.

## Lavori e limiti non risolti

1. **Collaudo del ciclo Claude** del 18/11: segnale completo/anti-riuso, controlli fonti, traduzioni, nessuna bozza incompleta nel repo, PR, CI, gate, preview.
2. **Verifica produzione Netlify:** la PR #39 filtro Edge per `/sitemap-news.xml` e le altre modifiche sono in `main`, con test e preview superati, ma **risposta e header live non confermati**. Verificare anche il layout di Dragone7/IFreddo (#41) e i video Pirates (#43/#44) in browser: i test automatici verificano HTML e CSS, non l’interazione mobile. Non dichiarare che queste verifiche visive sono già completate.
3. **SEO Search Console:** 60 clic/3.492 impressioni nel periodo 18/10–14/11; numerosi articoli scansionati ma non indicizzati, calo impressioni dal 12/11 senza causa dimostrata. Monitorare dopo nuovi dati e intervenire su qualità/intent/link, non garantire risultati.
4. **Auto-merge**: NON ATTIVO; richiede bot/App separato, protezioni ed evidenze e almeno 5 giorni di dry-run, poi nuova approvazione di Gianmarco.
5. Non cancellare vecchi branch; non scrivere su `main` senza PR; non duplicare lavori condivisi.

## Ruoli e decisioni

Gianmarco decide e autorizza; **non deve fare merge manuali**. ChatGPT segue architettura, SEO tecnico, audit, verifiche e merge approvati. Claude segue notizie, fonti, traduzioni e operazioni nel Progetto privato. **`COLLABORAZIONE.md` è il registro unico**: aggiornare quello dopo ogni PR e mantenere questo documento come breve handoff, evitando informazioni concorrenti.

## Prompt da incollare in una nuova chat

> Riprendiamo Soffia Cartuccia 2.0 dal punto in cui ci siamo fermati. Leggi prima `COLLABORAZIONE.md` e `STATO-PROGETTO.md` nel repository `gbrisiko91/premi-start`; verifica dal vivo PR, commit `main`, GitHub Actions e Netlify perché i documenti potrebbero essere superati. Prosegui dal primo punto non completato: collaudo 06:34→07:20 del 18 novembre, traduzioni, verifica sitemap News e media Dragone7/Pirates in produzione, SEO Search Console. Non ripetere lavori già integrati, non pubblicare contenuti dubbi, non attivare auto-merge. Non chiedermi di fare merge manuali: esegui tu quelli che autorizzo, dopo controlli.
