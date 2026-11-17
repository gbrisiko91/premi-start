# Soffia Cartuccia — Collaborazione Claude · ChatGPT · Gianmarco

Documento vivo di coordinamento. **È la fonte unica sullo stato del lavoro in corso**: chi interviene sul repository lo legge prima di iniziare e lo aggiorna quando finisce.

Ultimo aggiornamento: 17/11/2026 (Europe/Rome) — PR #19/#27/#28/#29 integrate e registro sincronizzato; auto-merge NON attivo.

---

## 1. Ruoli e responsabilità

| Chi | Si occupa di | Branch |
|---|---|---|
| **Gianmarco Buono** | Supervisione, priorità, approvazione finale. **Approva e autorizza i merge. Non deve eseguirli manualmente: un assistente autorizzato può effettuare il merge per suo conto; l'eventuale bot editoriale richiede attivazione separata.** | — |
| **ChatGPT** | SEO tecnico, architettura, prestazioni, audit, verifica dei rilasci, revisione tecnica delle PR di Claude che toccano file condivisi. | `chatgpt/…` (le PR già aperte mantengono il loro nome) |
| **Claude** | Funzionalità concordate, contenuti editoriali, articoli, traduzioni, newsletter, kit social, miglioramenti assegnati. | `contenuti/AAAA-MM-GG` per i contenuti del giorno · `claude/feat-<nome>` · `claude/fix-<nome>` · `claude/docs-<nome>` |

### Aree dei file

| Area | Responsabile | Altri possono modificarla? |
|---|---|---|
| `content/articoli/`, `content/traduzioni/` | Claude | Sì, con PR e citando la PR in questo documento |
| `content/pagine/` | Claude | Sì, con PR |
| `rubriche.mjs` (calendario `USCITE`, `SONDAGGI`) | Claude | Avvisare prima |
| `strumenti/newsletter*.mjs`, `strumenti/instagram.mjs`, `strumenti/traduzioni.mjs` | Claude | Avvisare prima |
| `GUIDA-REDAZIONE.md` | Claude + Gianmarco | Solo con approvazione di Gianmarco |
| `build.mjs`, `src/`, `lingue.mjs`, `sito.config.mjs`, `novita.mjs` | **Condivisi / delicati** | Chi li modifica lo segnala nel registro *prima* di aprire la PR |
| `strumenti/sitemap-news.mjs`, `strumenti/articoli-correlati.mjs`, `strumenti/report-editoriale.mjs`, `strumenti/verifica-editoriale.mjs` | ChatGPT | Avvisare prima |
| `netlify.toml`, `netlify/functions/`, `.github/workflows/`, `tests/` | ChatGPT | Avvisare prima; nessuna variabile di produzione senza Gianmarco |
| `STATO-PROGETTO.md`, `SPRINT-*.md`, `REDAZIONE-*.md` | ChatGPT | Avvisare prima |

---

## 2. Attività automatiche

Le automazioni girano su Claude. **Nessuna fa merge, pubblica articoli (`bozza: false`) o scrive direttamente su `main`.**

| Ora (Europe/Rome) | Attività | Dove scrive | Stato al 16/11 |
|---|---|---|---|
| 06:34 | **Bozze mattutine**: ricerca notizie, 3-5 bozze con `bozza: true` | Solo nel Progetto Claude (`bozze/`), niente GitHub | Attiva |
| 07:20 | **Sincronizzazione**: copia le bozze nel repository, traduzioni degli articoli già pubblicati, calendario, sondaggi, newsletter domenicale, kit Instagram | Branch `contenuti/AAAA-MM-GG` + PR verso `main` | Attiva dal 17/11, ricorrente ogni giorno (vedi nota) |
| 07:47 | **Traduzioni degli ordini**: traduce gli `ordini/` del Progetto | Solo nel Progetto Claude (`traduzioni/`), niente GitHub | Attiva |
| Domenica 10:00 | **Newsletter "Il Soffio della settimana"**: funzione Netlify `newsletter-domenica` (09:00 UTC) | Brevo | Attiva; si sospende con la variabile Netlify `NEWSLETTER_AUTOMATICA=no` |

Nota sulla sincronizzazione delle 07:20: fino al 16/11 faceva commit diretti su `main` e si riprogrammava da sola un giorno alla volta. L'esecuzione del 16/11 non ha programmato quella del 17/11. Dal 17/11 è sostituita da un'attività ricorrente che lavora solo su branch e PR e non fa mai merge.

Verifica delle dipendenze (dettagli in `PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md` §1):
- l'attività delle 07:47 è inattiva nei fatti dal 06/11, perché le traduzioni le fa la sincronizzazione delle 07:20;
- le 06:34 non lasciano un segnale di "concluso";
- le traduzioni partono solo per gli articoli già pubblicati.

La proposta corregge tutti e tre i punti.

---

## 3. Protocollo di sincronizzazione giornaliera

> In vigore **fino all'attivazione** della pubblicazione automatica (§8). Dopo l'attivazione, il passaggio 6 e il merge manuale valgono solo per le PR non editoriali e per i casi bloccati dal gate.

1. Alle 07:20 Claude parte dall'ultimo `main` remoto e controlla le PR aperte.
2. Crea il branch `contenuti/AAAA-MM-GG`. Se esiste già, lo riprende senza riscriverne la storia.
3. Aggiunge le nuove bozze (`bozza: true`) e le traduzioni degli articoli **già pubblicati**. Aggiorna `rubriche.mjs` solo se serve.
4. Esegue `npm run audit:editoriale`, `npm test`, `node build.mjs --bozze` e `node build.mjs`. Se i test falliscono, non apre la PR e lo segnala.
5. Apre (o aggiorna) **una sola PR al giorno** con il titolo `Contenuti AAAA-MM-GG`. Nella descrizione elenca:
   - le bozze arrivate e i file toccati;
   - le traduzioni per lingua;
   - l'esito di test e audit;
   - le note redazionali ancora aperte.
6. **Pubblicazione**: quando Gianmarco indica quali bozze uscire, Claude le controlla, risolve le note e mette `bozza: false` **nella stessa PR del giorno**, con commit separati e riconoscibili.
7. Gianmarco approva o autorizza il rilascio; ChatGPT/Claude può eseguire il merge consentito. Dopo il merge, ChatGPT può verificare il rilascio (deploy Netlify, sitemap, pagine). Un push o una CI verde **non** vuol dire che il deploy sia andato a buon fine.
8. Se la PR del giorno prima non è ancora stata unita, quella nuova parte comunque da `main` e non la tocca. Gli articoli in sospeso restano nella loro PR.

---

## 4. Registro delle PR aperte

Aggiornare a ogni apertura, merge o chiusura. Campi: numero · branch · autore · file principali · stato · chi deve agire.

| PR | Branch | Autore | File principali | Stato | Prossima azione |
|---|---|---|---|---|---|
| [#34](https://github.com/gbrisiko91/premi-start/pull/34) | `chatgpt/percorsi-editoriali-20261117` | ChatGPT | `build.mjs`, `src/stile.css`, percorsi editoriali | In verifica: guida GTA 6 e hub indie in nove lingue | GitHub Actions e Netlify sull'ultimo SHA, poi merge |

### PR del 17 novembre integrate
#33: template title e meta description, test canonical/sitemap, integrata e test su main superati. #19: pagina Sfondi pixel e 3 PNG, integrata; #27: protocollo collaborazione e proposta controllata integrati; #28: 48 traduzioni integrate; #29: gate editoriale diagnostico (dry-run) integrato. **Quattro bozze del 17/11 escluse**: verifiche editoriali ancora aperte, non pubblicate.

### Integrate di recente (16/11)
#19 Sfondi pixel (17/11) · #20 Nintendo Milano · #21 Fortnite Pirate Token · #22 GTA 6 preload · #23 guida GTA 6 · #24 fix CI note interne · #25 sitemap Google News · #26 registro di continuità · #27 coordinamento e proposta · #28 48 traduzioni (17/11) · #29 gate dry-run.

### Branch storici
Circa 25 branch di PR già integrate restano su GitHub. **Per decisione di Gianmarco non vanno eliminati per ora.**

---

## 5. Regole per evitare conflitti

1. **Prima di iniziare**: `git fetch`, leggere questo file, controllare le PR aperte e i file che toccano.
2. **Nessuna modifica diretta a `main`**, per nessun motivo: né pubblicazioni né correzioni di un refuso.
3. **Un file, un responsabile alla volta.** Se un file compare già in una PR aperta di un altro, non lo si modifica: si commenta la PR o si aspetta il merge.
4. **File condivisi o delicati** (vedi tabella al §1): chi li modifica li elenca nel registro *prima* di aprire la PR e chiede la revisione dell'altro.
5. **PR piccole e con un solo scopo.** Niente modifiche "già che c'ero" fuori dallo scopo.
6. **Branch sempre da `main` aggiornato.** Per riallinearsi si usa rebase o merge di `main`, mai `push --force` su branch altrui.
7. **Fonti**: si distinguono sempre conferme ufficiali e indiscrezioni (vedi `GUIDA-REDAZIONE.md`). Una CI verde non certifica che i fatti siano veri.
8. **Nessuna operazione su produzione** (variabili Netlify, Brevo, social, invii) senza ok esplicito di Gianmarco.

---

## 6. Procedura di emergenza per notizie urgenti

Vale per le notizie da mettere online in poche ore: annunci a sorpresa, risultati di eventi, rettifiche di errori già pubblicati.

1. Claude crea il branch `contenuti/AAAA-MM-GG-urgente-<parola-chiave>` da `main`, con un solo articolo (ed eventualmente la sua riga in `rubriche.mjs`).
2. Verifica le fonti come al solito, poi esegue `npm test` e `node build.mjs`.
3. Apre la PR con il titolo `URGENTE: <titolo>` e avvisa Gianmarco in chat, con link alla PR e un riassunto di una riga.
4. **Gianmarco autorizza il merge**, che un assistente può eseguire per suo conto; l'urgenza riduce i tempi, non la verifica e l'autorizzazione.
5. Dopo il merge, ChatGPT o Claude controlla che la pagina sia online e annota l'esito nel registro.
6. **Rettifiche**: se un articolo pubblicato contiene un errore di fatto, si segue la stessa procedura con il titolo `URGENTE rettifica: …`, e nell'articolo si aggiunge una riga di aggiornamento con la data.
7. Le traduzioni dell'articolo urgente arrivano con la sincronizzazione del giorno dopo.

---

## 7. Come si aggiorna questo documento

- **Chi apre, unisce o chiude una PR** aggiorna il registro (§4) nella stessa PR o nella PR successiva.
- **Claude** aggiorna lo stato delle automazioni (§2) e il registro dentro la PR `Contenuti AAAA-MM-GG` di ogni giorno.
- **ChatGPT** aggiorna le sezioni su architettura, file delicati e verifiche di rilascio quando cambiano.
- Le **decisioni** vanno nel registro qui sotto, con data e chi le ha approvate. Solo Gianmarco approva una decisione.
- Si tiene il documento corto: le PR integrate da più di 7 giorni escono dal registro e restano nella cronologia di GitHub.
- `STATO-PROGETTO.md` resta la sintesi di passaggio fra chat e rimanda a questo documento per il registro operativo; lo stato effettivo va sempre verificato su GitHub, non ricostruito da un testo datato.

### Registro delle decisioni

| Data | Decisione | Approvata da |
|---|---|---|
| 16/11/2026 | GitHub è la fonte unica del progetto; si lavora con branch e PR separati | Gianmarco |
| 16/11/2026 | Ruoli: ChatGPT SEO tecnico/architettura/audit; Claude funzionalità e contenuti; Gianmarco supervisione e merge | Gianmarco |
| 16/11/2026 | Opzione A: una PR al giorno (`contenuti/AAAA-MM-GG`) per articoli e traduzioni; anche la pubblicazione passa dalla PR | Gianmarco |
| 16/11/2026 | Restano le automazioni delle 06:34 e delle 07:47 | Gianmarco |
| 16/11/2026 | I branch storici non si eliminano per ora | Gianmarco |
| 16/11/2026 | Obiettivo: pubblicazione automatica degli articoli con controlli; modifiche tecniche sempre manuali. Proposta in revisione, **non attiva** | Gianmarco (obiettivo) · in attesa di revisione ChatGPT |

---

## 8. Proposta: pubblicazione automatica controllata (NON ATTIVA)

Proposta tecnica completa: **[`PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md`](PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md)**. In attesa di revisione di ChatGPT e approvazione di Gianmarco. **Nessun auto-merge è implementato.**

In sintesi:
- **Flusso**: 06:34 bozze verificate con scheda `verifica` e segnale di completamento → 07:20 gate editoriale, traduzioni prima della PR, PR `contenuti/…` con etichetta `editoriale-auto` → auto-merge se tutti i controlli sono verdi → deploy Netlify → controllo dopo la pubblicazione. La 07:47 viene disattivata.
- **Gate editoriale (G1-G10)**: fonte primaria o 2 fonti indipendenti, niente indiscrezioni, niente note aperte, SEO e immagini complete, niente doppioni o sovrapposizioni con PR aperte, niente HTML pericoloso, limiti di quantità.
- **Auto-merge (S1-S9, NON ATTIVO)**: da progettare con identità bot/App separata e distinta autorizzazione dopo 5 giorni di prova; solo branch `contenuti/…`, solo file **nuovi** in `content/articoli/` e `content/traduzioni/<lingua>/`, CI + gate + anteprima Netlify verdi, PR aggiornata, interruttore `AUTO_PUBBLICAZIONE`, una PR alla volta. Qualsiasi altro file (codice, config, SEO tecnico, template, workflow, `rubriche.mjs`) resta a **merge manuale**.
- **Bozze private**: su GitHub (repository pubblico) arrivano solo gli articoli pronti. Le bozze non pronte restano nel Progetto Claude.
- **Blocchi**: se un controllo fallisce la PR resta aperta con l'etichetta `blocco-editoriale` e parte una segnalazione. Un articolo bloccato non ferma gli altri.
- **Attivazione per fasi (0-5)**, con 5 giorni di prova a secco prima dell'auto-merge vero.
- **Da decidere (Gianmarco)**: indiscrezioni, limite giornaliero, seconda tornata delle 13:20, repository privato, account bot.

### Revisione richiesta a ChatGPT
- Funzionamento tecnico del gate e dei workflow (§2-3 della proposta).
- Condizioni di sicurezza S1-S9 e il limite di identità dell'account unico (§3.3).
- Sistema di pubblicazione automatica e criteri editoriali (§2).
- Prevenzione di doppioni e conflitti (§5).
- Rischi per Netlify e per il sito pubblico (§6), in particolare deploy da merge con `GITHUB_TOKEN`, minuti di build e sitemap News.


---

## 9. Esito della revisione tecnica ChatGPT (17/11)

La PR #27 documenta il disegno, **non autorizza né implementa l'auto-merge**. L'adozione della proposta richiede una PR di implementazione distinta e controlli in prova a secco (almeno cinque giorni), poi un'autorizzazione esplicita di Gianmarco per l'attivazione.

Condizioni da soddisfare prima della fase 4:
- Identità GitHub App/bot distinta: oggi account unico = nessuna indipendenza reale fra autore, revisore, e approvatore; CODEOWNERS da solo non basta.
- Gate editoriale deterministico + evidenze verificabili per le affermazioni principali, con revisione umana per casi sensibili. Un contatore di fonti inserito dall'agente non certifica la verità.
- Sanitizzazione o escaping sicuro dell'HTML generato da `marked`; blacklist regexp non sufficiente contro XSS.
- Workflow PR read-only separato da un workflow privilegiato trusted su `main`, mai eseguire codice della PR con segreti o token di scrittura.
- Verificare stati, SHA corrente, diff completo, protezione di `main`, deploy Netlify atteso, idempotenza, lock, possibilità di arresto e allarme in caso di mancata pubblicazione. Non fare affidamento su eventi GitHub Actions generati da `GITHUB_TOKEN` per attivare altri workflow.
- Nessun auto-merge di bozze, rettifiche, urgenze, modifiche tecniche o revert nella fase iniziale. Le quattro bozze del 17/11 restano in revisione.

Stato attuale: la #28 conteneva originariamente bozze nel repository pubblico; esse non sono state integrate su `main`, ma la cronologia della PR pubblica è già stata visibile. Le bozze future restano nel progetto privato fino al completamento dei controlli.
