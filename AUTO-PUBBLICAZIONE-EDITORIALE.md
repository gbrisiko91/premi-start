# Auto-pubblicazione controllata — Soffia Cartuccia

**Decisione proprietario: 25 novembre 2026.** Gli articoli giornalieri **già verificati** non devono restare bloccati per la mancata approvazione del merge da parte di Gianmarco. Questo documento descrive l'implementazione tecnica della fase automatica, distinta da tutte le PR tecniche e editoriali manuali.

## Come funziona

1. Claude alle 06:34 prepara le notizie, le fonti e le schede `verifica`; alle 07:20 trasferisce sul repository **solo** gli articoli effettivamente pronti e le traduzioni in una PR `contenuti/AAAA-MM-GG`.
2. GitHub esegue `Verify Soffia Cartuccia 2.0` (`npm test`) e il gate editoriale diagnostico; Netlify genera la Deploy Preview.
3. `.github/workflows/auto-pubblicazione-editoriale.yml` si attiva alla fine di ciascuno dei due workflow. In un job **privilegiato e serializzato** usa esclusivamente il codice già presente su `main`, non effettua checkout né esegue il contenuto della PR.
4. `strumenti/auto-pubblicazione-editoriale.mjs` ricontrolla dalla API GitHub lo SHA, la branch, che `main` non sia avanzato, e che tutte le modifiche siano esclusivamente **nuovi** Markdown `content/articoli/` e `content/traduzioni/`. Controlla il gate **di nuovo, da codice attendibile**, sui contenuti recuperati alla specifica SHA.
5. Prima del merge richiede **tutti**: build verde, gate verde, status Netlify Deploy Preview verde della medesima SHA e della medesima PR. Se qualcosa manca, è vecchio, o è ambiguo, **non unisce**.
6. Se soddisfatti, GitHub unisce solo quella PR, con controllo `sha` nell'API di merge. Viene invocato con `workflow_dispatch` il workflow `Verifica pubblicazione reale Netlify`, per collaudare il commit effettivamente servito dalla produzione. Il dispatch è importante perché i merge con `GITHUB_TOKEN` normalmente **non attivano i workflow `push`**.
7. Tre esecuzioni schedulate al giorno riprovano solo le PR editoriali ancora aperte e datate oggi/ieri, in caso di preview Netlify in ritardo. Gli errori restano visibili in GitHub Actions; nessun merge in presenza di controlli mancanti.

## Non pubblicabile senza controllo umano

- PR con branch diversi da `contenuti/AAAA-MM-GG`; PR urgenti/torneo, `Premi Start`, qualunque PR tecnica o che modifica file esistenti.
- Bozze `bozza: true` e scheda `verifica` assente, con dubbi o con `revisione_umana`; interviste, recensioni, indiscrezioni/rumor, temi sensibili intercettati dal gate.
- PR con file fuori whitelist, nuove immagini/binari o modifica a script, test, workflow, pagine fisse, file YAML/config, rettifiche o cancellazioni.
- Branch indietro rispetto al `main` corrente, conflitti, data della PR precedente a ieri, assenza di un articolo italiano nuovo, più di 5 articoli / 45 traduzioni, file oltre 60 KB.
- Contenuti con qualsiasi risultato tecnico non verde o con preview assente/sbagliata.

**Nota editoriale:** il gate non certifica che una notizia sia vera. La qualità dipende dalla verifica fatta da Claude con fonti primarie e dalla scelta di mettere in revisione manuale i dubbi. Chi prepara il contenuto deve compilare i campi con accuratezza e non mascherare i dubbi per ottenere la pubblicazione.

## Interruttore d'emergenza

GitHub → repository → **Settings → Secrets and variables → Actions → Variables** → creare o modificare `AUTO_PUBBLICAZIONE` con valore **`off`**. Questo blocca i merge automatici futuri; non ritira articoli già online.

Per riattivare, impostare il valore `on` (valore di default se la variabile non esiste). L'esito di ciascun run compare nel workflow **Auto-pubblicazione articoli verificati**.

## Limiti e audit

- Questa automazione non pubblica post Instagram, non invia email, non modifica Premi Start e non cambia policy privacy.
- Netlify deve effettivamente ricevere il merge via integrazione GitHub. Il successivo workflow di controllo HTTP confermerà la produzione; un deploy fallito deve essere trattato manualmente.
- Le esecuzioni con `GITHUB_TOKEN` non attivano di norma i workflow `push` di GitHub Actions. Per questo il controllo della produzione è lanciato esplicitamente tramite `workflow_dispatch`.
- Prima di estendere l'automazione a casi non previsti o a PR da collaboratori esterni, occorre un'identità bot separata, protezioni `main` e revisione del modello di sicurezza.
- Per rettifiche e ritiri, usare la procedura manuale in `COLLABORAZIONE.md`.

**Non cambiare il gate per “far passare” un articolo:** sistemare invece le fonti oppure lasciarlo alla revisione umana.
