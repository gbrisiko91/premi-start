# Soffia Cartuccia 2.0 — Stato operativo del progetto

Ultimo aggiornamento: 16 novembre 2026 (Europe/Rome).

## Regole di continuità
- Questo documento è la fonte di riferimento per riprendere il lavoro da una nuova conversazione ChatGPT.
- All'inizio di ogni sessione confrontare questo file con lo stato **effettivo** di GitHub (PR, commit, Actions) e con il deploy Netlify; non dare per completate operazioni solo perché descritte in chat.
- Ogni modifica al sito va proposta in una PR, verificata e sottoposta ad approvazione prima del merge, salvo nuova istruzione esplicita del proprietario.
- Al termine di ogni sessione aggiornare: PR integrate, PR aperte, controlli superati, verifiche manuali mancanti, decisioni editoriali, prossimo passo.
- Non pubblicare affermazioni non verificate (specie GTA 6: date, pesi, preload, disponibilità, orari, versioni) e distinguere fonti ufficiali dalle indiscrezioni.

## Stato verificato al 16/11/2026
- Repository: https://github.com/gbrisiko91/premi-start
- PR #22 (GTA 6): integrata in main durante la sessione precedente.
- PR #24 (correzione CI: commenti redazionali storici): **merged**; i contenuti visibili non sono stati cambiati. https://github.com/gbrisiko91/premi-start/pull/24
- PR #25 (SEO News: sitemap dedicata nelle nove lingue): **open, draft, non merged**. https://github.com/gbrisiko91/premi-start/pull/25
  - Implementazione dichiarata: `/sitemap-news.xml`, notizie fresche, aggiornamento a ogni build, integrazione `robots.txt`, preservata sitemap generale.
  - Ultimo workflow GitHub Actions osservato: **success** (run https://github.com/gbrisiko91/premi-start/actions/runs/43952585159).
  - Rimangono da verificare revisione tecnica finale e preview/deploy Netlify. Non interpretare CI verde come deploy avvenuto.
- PR #23 (guida centrale al lancio di GTA 6): **open, non merged**. https://github.com/gbrisiko91/premi-start/pull/23
  - Verificare fonti Rockstar, date/orari, spazio installazione, immagini, traduzioni, build e contenuti prima dell'approvazione.
- PR #19 (Missione 5K — pagina Sfondi pixel): **open**, ancora da pianificare. https://github.com/gbrisiko91/premi-start/pull/19

## Prossime azioni in ordine
1. Revisionare la PR #25 (sitemap Google News), verificare test/CI e comportamento della sitemap nella preview Netlify, poi presentarla al proprietario per approvazione. **Non fare merge automaticamente.**
2. Verificare il deploy Netlify reale e la presenza delle sitemap/robots dopo eventuale merge.
3. Revisionare separatamente la PR #23 su GTA 6 (accuratezza editoriale, link interni, immagini, traduzioni, test) e presentare esiti e problemi.
4. Valutare priorità della PR #19 e successivi interventi SEO/traffico, misurando risultati anziché promettere indicizzazione.

## Checklist aggiornamento a ogni fine sessione
- Data e fase:
- PR integrate (numero, scopo):
- PR aperte / in bozza (numero e motivo):
- Stato CI:
- Stato Netlify verificato (URL e data):
- Decisioni approvate / ancora da approvare:
- Problemi e rischi:
- Primo passo della prossima sessione:

## Istruzione per nuova chat
«Riprendiamo Soffia Cartuccia 2.0. Leggi `STATO-PROGETTO.md` nel repository `gbrisiko91/premi-start`, confrontalo con le PR aperte, GitHub Actions e il deploy Netlify; poi continua dal primo passo non completato senza ripetere lavori già fatti e senza effettuare merge non approvati.»
