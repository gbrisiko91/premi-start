# Soffia Cartuccia 2.0 — Stato di continuità

Ultimo aggiornamento: 17 novembre 2026 (Europe/Rome).

## Documenti di riferimento
- **Registro operativo e coordinamento corrente:** [COLLABORAZIONE.md](COLLABORAZIONE.md). Questo documento è la sintesi per riprendere una nuova conversazione; non è una seconda fonte in conflitto.
- **Pubblicazione automatica:** [PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md](PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md). **Solo progetto, NON attiva**; 5 giorni di dry-run e un successivo via libera prima di eventuale auto-merge.
- **Stato effettivo:** GitHub (PR, CI, commit) e Netlify (preview/produzione) prevalgono sui registri testuali datati.

## Integrazioni verificate
- PR #19: pagina `/sfondi/` + tre PNG, merge su `main` il 17/11 (commit d78c1ebc6aaa4c25dc14d9c567c96456910c7b0c), Actions success; deploy pubblico da verificare se non confermato.
- PR #23: guida GTA 6, merge 16/11; Actions `main` success.
- PR #24: risoluzione errori build per tre note editoriali, merge 16/11.
- PR #25: sitemap News, merge 16/11; XML e `robots.txt` verificati pubblici dall'utente.
- PR #26: precedente registro di continuità, merge 16/11.
- PR #28: 48 traduzioni di sei articoli pubblicati il 16/11, merge 17/11 (commit dd5c9d1ae0994ff0f406cf5a90a51b4a0105a252); quattro bozze con verifiche aperte rimosse dal diff prima del merge.

## Aperte e prossime azioni
- PR #27: documentazione di coordinamento e proposta auto-pubblicazione, con revisione tecnica ChatGPT. Solo documentazione, nessun auto-merge attivo. Controllare test/preview sul commit finale, poi unire.
- Quattro bozze del 17/11: rimangono non pubblicate; completare verifica fonti, immagini e link, successivamente una PR editoriale distinta.
- Automatizzazione sitemap News con aggiornamento anche nei giorni senza build: miglioramento tecnico futuro.
- Verificare Search Console, indicizzazione, performance e traffico con dati reali, senza garantire risultati.

## Regole operative
1. Prima di ogni lavoro leggere `COLLABORAZIONE.md`, poi controllare lo stato effettivo del repository e dei deploy.
2. Claude: contenuti, traduzioni, attività editoriali concordate. ChatGPT: architettura, sicurezza, SEO tecnico, audit, verifica e merge autorizzati. Gianmarco: supervisione, priorità, autorizzazioni.
3. Un assistente può effettuare merge approvati, senza che Gianmarco debba operare manualmente su GitHub. Nessun auto-merge editoriale fino alla fase 4 e alla sua nuova autorizzazione.
4. Non pubblicare automaticamente bozze, indiscrezioni, notizie su persone reali in ambiti sensibili, rettifiche o contenuti con fonti non verificate.
5. Fine sessione: aggiornare registro, PR integrate/aperte, stato CI/Netlify, prossima azione.

## Prompt di ripresa in nuova chat
«Riprendiamo Soffia Cartuccia 2.0. Leggi `COLLABORAZIONE.md` e `STATO-PROGETTO.md` in `gbrisiko91/premi-start`, verifica PR, Actions e Netlify, poi procedi dal primo passo non completato. Non considerare l'auto-merge attivo senza un'attivazione esplicita.»
