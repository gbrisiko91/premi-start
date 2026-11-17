# Gate editoriale — sola diagnosi

Questa prima fase controlla in modo ripetibile alcuni prerequisiti degli articoli e delle traduzioni nelle PR, **senza pubblicare nulla, senza autorizzare merge automatici e senza bloccare le PR** in caso di problemi editoriali.

- Script `strumenti/gate-pubblicazione.mjs`: whitelist di percorsi/file nuovi, scheda `verifica`, SEO, fonti URL, immagini, note, HTML grezzo, casi delicati, limiti quantitativi e traduzioni.
- Test unitari in `tests/gate-pubblicazione.mjs`.
- Workflow GitHub Actions `gate-editoriale-dry-run.yml`: `pull_request`, token read-only, nessun secret, nessun workflow privilegiato; riepilogo nel job summary.

**Limiti espliciti:** la scheda compilata da un agente non attesta la verità di una notizia; contatori e URL non garantiscono qualità o diritti immagini. G8 blocca l'idoneità di HTML grezzo ma NON è un sanitizer: la sanitizzazione del renderer va implementata prima di qualsiasi futuro auto-merge. Il controllo di doppioni tra PR aperte e le verifiche editoriali indipendenti sono ancora da implementare. Nessuna protezione di branch o variabile di produzione viene modificata.

**Fasi successive:** far compilare a Claude le schede e produrre evidenze per le fonti, dry-run per 5 giorni, revisione degli esiti, poi eventuale PR distinta per auto-merge soltanto con autorizzazione esplicita di Gianmarco.
