# Soffia Cartuccia — Collaborazione Claude · ChatGPT · Gianmarco

Documento vivo di coordinamento. **È la fonte unica sullo stato del lavoro in corso**: chi interviene sul repository lo legge prima di iniziare e lo aggiorna quando finisce.

Ultimo aggiornamento: 16/11/2026 22:30 (Europe/Rome) — Claude, PR di introduzione del documento.

---

## 1. Ruoli e responsabilità

| Chi | Si occupa di | Branch |
|---|---|---|
| **Gianmarco Buono** | Supervisione, priorità, approvazione finale. **È l'unico che fa merge su `main`.** | — |
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
| 07:20 | **Sincronizzazione**: copia le bozze nel repository, traduzioni degli articoli già pubblicati, calendario, sondaggi, newsletter domenicale, kit Instagram | Branch `contenuti/AAAA-MM-GG` + PR verso `main` | Da riattivare con le nuove regole (vedi nota) |
| 07:47 | **Traduzioni degli ordini**: traduce gli `ordini/` del Progetto | Solo nel Progetto Claude (`traduzioni/`), niente GitHub | Attiva |
| Domenica 10:00 | **Newsletter "Il Soffio della settimana"**: funzione Netlify `newsletter-domenica` (09:00 UTC) | Brevo | Attiva; si sospende con la variabile Netlify `NEWSLETTER_AUTOMATICA=no` |

Nota sulla sincronizzazione delle 07:20: fino al 16/11 faceva commit diretti su `main` e si riprogrammava da sola un giorno alla volta. L'esecuzione del 16/11 non ha programmato quella del 17/11. Viene sostituita da un'attività ricorrente che lavora solo su branch e PR.

---

## 3. Protocollo di sincronizzazione giornaliera

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
7. Gianmarco approva e fa il merge. Dopo il merge, ChatGPT può verificare il rilascio (deploy Netlify, sitemap, pagine). Un push o una CI verde **non** vuol dire che il deploy sia andato a buon fine.
8. Se la PR del giorno prima non è ancora stata unita, quella nuova parte comunque da `main` e non la tocca. Gli articoli in sospeso restano nella loro PR.

---

## 4. Registro delle PR aperte

Aggiornare a ogni apertura, merge o chiusura. Campi: numero · branch · autore · file principali · stato · chi deve agire.

| PR | Branch | Autore | File principali | Stato | Prossima azione |
|---|---|---|---|---|---|
| [#19](https://github.com/gbrisiko91/premi-start/pull/19) | `missione-5k-sfondi-pixel` | Claude | `build.mjs`, `content/pagine/it/sfondi.md`, `public/sfondi/*` | Aperta, CI verde, mergeable | **In attesa di revisione tecnica da parte di ChatGPT** (tocca `build.mjs`, file condiviso), poi approvazione di Gianmarco |
| [#23](https://github.com/gbrisiko91/premi-start/pull/23) | `editoriale/gta6-guida-lancio-20261116` | ChatGPT | `content/articoli/2026-11-16-gta-6-guida-lancio.md` | Aperta, CI **rossa** al 16/11 22:20 | **Area di lavoro già assegnata a ChatGPT.** Claude non la modifica e non scrive articoli GTA 6 che si sovrappongano finché è aperta |
| [#27](https://github.com/gbrisiko91/premi-start/pull/27) | `claude/docs-collaborazione` | Claude | `COLLABORAZIONE.md` | Aperta | Revisione di ChatGPT, poi approvazione di Gianmarco |

### Integrate di recente (16/11)
#20 Nintendo Milano · #21 Fortnite Pirate Token · #22 GTA 6 preload · #24 fix CI note interne · #25 sitemap Google News · #26 registro di continuità.

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
4. **Il merge lo fa comunque Gianmarco**, anche dal telefono: l'urgenza riduce i tempi, non le approvazioni.
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
- `STATO-PROGETTO.md` resta come archivio storico; lo stato attuale è qui. Al 16/11 indicava ancora la #25 come aperta e in bozza, mentre è stata integrata alle 22:06, e non citava la #26.

### Registro delle decisioni

| Data | Decisione | Approvata da |
|---|---|---|
| 16/11/2026 | GitHub è la fonte unica del progetto; si lavora con branch e PR separati | Gianmarco |
| 16/11/2026 | Ruoli: ChatGPT SEO tecnico/architettura/audit; Claude funzionalità e contenuti; Gianmarco supervisione e merge | Gianmarco |
| 16/11/2026 | Opzione A: una PR al giorno (`contenuti/AAAA-MM-GG`) per articoli e traduzioni; anche la pubblicazione passa dalla PR | Gianmarco |
| 16/11/2026 | Restano le automazioni delle 06:34 e delle 07:47 | Gianmarco |
| 16/11/2026 | I branch storici non si eliminano per ora | Gianmarco |
