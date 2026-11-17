# Soffia Cartuccia 2.0 — Collaborazione, stato e decisioni

> **Documento centrale e unico registro operativo** per Gianmarco, Claude e ChatGPT. Prima di qualsiasi intervento, leggere qui, controllare GitHub/CI/Netlify e aggiornare i fatti che sono cambiati. `STATO-PROGETTO.md` è soltanto la sintesi di passaggio fra chat: non mantiene un secondo registro autonomo.
>
> **Snapshot del 17 novembre 2026 (Europe/Rome)**. Stato verificato su GitHub: repository `gbrisiko91/premi-start`, ultimo commit tecnico verificato su `main` prima del presente aggiornamento di continuità: `0eac3e9cd7895490c8f82a01d17a70b3281be329` (PR #44), GitHub Actions `44182813602` completata con successo. **0 PR aperte** al controllo, dopo il merge delle PR #41–#44. La documentazione di continuità fa avanzare nuovamente il commit: ricontrollare GitHub prima di agire.

## 1. Missione e riferimenti

- Sito pubblico: https://soffiacartuccia.it · codice: https://github.com/gbrisiko91/premi-start
- Obiettivo: testata gaming italiana e multilingue (9 lingue), orientata a notizie **verificabili**, GTA 6 e grandi eventi, scoperte indie, retrogaming, guida al lettore e crescita organica misurabile; la qualità prevale sulla quantità.
- Regole redazionali: [GUIDA-REDAZIONE.md](GUIDA-REDAZIONE.md). La **copia del Progetto privato Claude** è quella letta dalle automazioni; Claude deve mantenerla coerente con GitHub (la sincronizzazione dei due documenti non è automatica).
- Disegno tecnico dell'autopubblicazione, **non attivo**: [PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md](PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md).
- Continuità fra conversazioni: [STATO-PROGETTO.md](STATO-PROGETTO.md); rilievi SEO: [SEO-INDICIZZAZIONE-AUDIT.md](SEO-INDICIZZAZIONE-AUDIT.md).

## 2. Ruoli, autorizzazioni e aree del repository

| Responsabile | Ambito e limiti |
|---|---|
| **Gianmarco** | Decide priorità, strategia, approvazione editoriale e autorizzazione dei rilasci. **Non deve operare manualmente su GitHub**. |
| **Claude** | Notizie, verifica fonti, articoli, traduzioni, guida editoriale nel Progetto, kit social, newsletter e sincronizzazione PR. Non esegue push diretto su `main` né merge non autorizzati. |
| **ChatGPT** | Architettura, sicurezza, SEO tecnico, indicizzazione, audit, test, revisione delle PR, verifiche e **merge autorizzati**. |

Aree: `content/articoli/`, `content/traduzioni/`, `content/pagine/` e `GUIDA-REDAZIONE.md` prevalentemente Claude. `tests/`, `.github/workflows/`, `netlify/`, strumenti SEO e sicurezza prevalentemente ChatGPT. `build.mjs`, `src/`, `rubriche.mjs`, `sito.config.mjs`, `lingue.mjs`, `novita.mjs` sono **condivisi/delicati**: segnalare la modifica prima di una PR. Non modificare il medesimo file in due PR concorrenti. Non eliminare i branch storici senza nuova decisione di Gianmarco.

**Rilascio:** il proprietario autorizza, un assistente può eseguire il merge per suo conto dopo verifica di fatti, diff, SHA, CI, gate e preview Netlify. L'autorizzazione generale al lavoro tecnico non equivale ad approvazione automatica di nuovi articoli. Non modificare segreti, produzione, newsletter/Brevo, protezione branch o automazioni senza autorizzazione appropriata.

## 3. Flusso giornaliero: programma del 18 novembre

Le attività sono configurate **nel Progetto privato Claude**, non in GitHub. Claude ha **riferito** il 17/11 di aver aggiornato le istruzioni; l'effettivo funzionamento **non è ancora collaudato**.

| Ora Europe/Rome | Comportamento previsto | Criterio di successo |
|---|---|---|
| **06:34** | Ricerca privata, verifica del fatto principale, fonti e diritti immagini; classifica ogni articolo `pronto`, `non_pronto`, `revisione_umana`. Scrive segnale `bozze/_stato/AAAA-MM-GG.md` alla fine. | Data del giorno, identificativo univoco **per singola esecuzione** (anche ripetuta), `completato: true`, inizio/fine coerenti, elenco articoli/stati, fonti e motivi. Nessuna bozza su GitHub. |
| **07:20** | Attende il segnale valido; ritenta ogni 10 minuti fino a 60 minuti; se manca interrompe e avvisa. Crea/aggiorna `contenuti/AAAA-MM-GG` e una sola PR con **solo articoli pronti e traduzioni verificate**. | Verifica che l'ID non sia già elaborato, che ogni file pronto sia integro, test/preview; nessuna modifica diretta di `main`, nessun merge autonomo. |
| **07:47** | Vecchia attività separata di traduzioni in Progetto. Risulta ancora attiva, ma senza esecuzioni utili segnalate dal 6/11. | **Non disattivarla ancora**: verificare prima che le 07:20 producano correttamente anche le traduzioni degli articoli nuovi, senza duplicazioni. |
| **Domenica 10:00** | Newsletter tramite Netlify/Brevo (come da configurazione preesistente). | Controllo separato; la variabile `NEWSLETTER_AUTOMATICA=no` è documentata come interruttore. Nessun cambiamento senza approvazione. |

Per il primo giro del **18/11/2026** chiedere: ID e orari, conferma segnale, titolo e fonti per ciascun pronto, numero e ragioni dei non pronti e dei revisioni umane, traduzioni/languages, URL della PR, esiti CI/gate/Netlify e problemi di accesso o traduzione. Se la ricerca non riesce a leggere GitHub, la 07:20 ricontrolla i link sul repository; nessun link interno inventato.

**Stati:** `pronto` = `bozza: false`, fatto principale verificato, scheda `verifica` con `dubbi: []`; `non_pronto` = bozza privata con dubbi aperti; `revisione_umana` = bozza privata anche se fonti confermate. Il mero punteggio di fonti non certifica i fatti. Contenuti delicati su persone reali, interviste, recensioni, indiscrezioni, leak, rettifiche e prove soggettive non entrano nel flusso automatico.

**Immagini:** facoltative; con immagine, URL HTTPS, alt, crediti e verifica effettiva dei diritti. Senza diritti chiari, niente immagine (copertina di categoria). **Link interni:** solo pertinenti e verso pagine già pubblicate. Il repository pubblico non deve ricevere bozze private incompiute.

## 4. Controllo delle PR e sicurezza (stato reale)

Il **gate editoriale è solo diagnostico**: un job GitHub verde non significa che la notizia sia vera o sia pronta per il merge. Controllare il **report** per G1–G10 e la natura dei contenuti, non solo la conclusione del job. Le PR tecniche hanno test GitHub + preview Netlify sull'ultimo HEAD SHA, poi merge autorizzato e nuova CI su `main`.

Le protezioni integrate comprendono: sanitizer HTML dopo `marked` (PR #31), gate dry-run (PR #29), immagini opzionali e controllo su natura sensibile (PR #37), controllo del flag esplicito `verifica.revisione_umana` anche su notizie `ufficiale` (PR #40), test SEO per canonical/robots/sitemap (PR #33). La PR #41 ripristina layout immagini usando classi CSS; la PR #43 recupera i video Pirates con `controls` e `video.src` consentito soltanto per protocolli sicuri; la PR #44, su autorizzazione di Gianmarco, ripristina **autoplay soltanto con `muted`**, mantenendo `controls` e bloccando i protocolli non sicuri. Gli altri controlli XSS restano attivi. Il gate non verifica diritti immagini, la verità delle fonti né il segnale salvato nel Progetto privato.

**Auto-merge: NON ATTIVO.** La proposta richiede: identità GitHub App/bot indipendente, controlli read-only separati dal workflow privilegiato, protezioni di `main`, fonte primaria/evidenze verificabili, XSS protetto, protezioni anti-concorrenza, verifica SHA e deploy finale, kill switch, **almeno 5 giorni consecutivi di dry-run documentati** e una nuova autorizzazione specifica di Gianmarco. Nessun merge automatico di urgenze, rettifiche, recensioni o codice.

## 5. Registro PR — snapshot GitHub 17/11

**PR aperte: 0** al controllo successivo alla #44. Ultimo `main` tecnico `0eac3e9`, CI `44182813602` verde. Il presente aggiornamento documentale genera un commit successivo.

| PR | Intervento verificato | Stato |
|---|---|---|
| #19 | Pagina `/sfondi/` e 3 PNG pixel art | Integrata |
| #20–#26 | Notizie, guida GTA 6, fix CI, sitemap Google News, registro | Integrate |
| #27 | Protocollo di collaborazione e proposta auto-pubblicazione **non attiva** | Integrata |
| #28 | **Solo 48 traduzioni** di 6 articoli già online; 4 bozze escluse prima del merge | Integrata |
| #29–#30 | Gate dry-run e aggiornamento registro | Integrate |
| #31 | Sanitizzazione HTML Markdown | Integrata |
| #32 | 3 articoli: Grammy 2027, Miyamoto Legend Award, DualStation | Integrata |
| #33 | SEO: titoli duplicati, meta-description homepage 9 lingue, test indicizzabilità | Integrata |
| #34–#35 | Percorsi GTA 6/Indie; guide Quiz/Sondaggi 9 lingue | Integrate |
| #36 | Rettifica GTA 6 orario Xbox, 9 lingue, basata sulla fonte ufficiale | Integrata |
| #37 | Gate immagini opzionali/revisione umana | Integrata |
| #38 | Guida redazionale allineata; ID segnale non riutilizzabile e controlli di sincronizzazione | Integrata |
| #39 | Netlify Edge Function filtro in tempo reale degli URL scaduti nella sitemap Google News | Integrata |
| #40 | Gate G3: `verifica.revisione_umana` esplicito non ignorato | Integrata |
| #41 | Hotfix media: ripristino foto Dragone7/IFreddo e screenshot Pirates con CSS senza stili inline, nove lingue | Integrata; verifica visiva live non confermata |
| #43 | Video Pirates: `controls` e sorgente `src` sicura nel sanitizer, test nove lingue e anti-XSS | Integrata; CI `44181472714` verde, prova browser live non confermata |
| #42 | Consolidamento di `COLLABORAZIONE.md` e `STATO-PROGETTO.md` | Integrata |
| #44 | Autoplay muto dei video Pirates con controlli manuali e sanitizzazione sicura, autorizzato espressamente da Gianmarco | Integrata; test GitHub/Netlify Preview verdi; prova browser live pendente |

**Conservare la distinzione storica:** nella PR #28 quattro bozze del 17/11 erano presenti nel ramo pubblico e poi rimosse dal diff prima del merge. In seguito **tre** di quelle notizie sono uscite con la #32; **Craig Houston** resta in revisione umana e non va pubblicato automaticamente. La cronologia pubblica della #28 potrebbe ancora esporre i vecchi contenuti: non ripetere l'errore con bozze future.

## 6. SEO, rilascio e misurazione

- **Search Console (18/10–14/11, dati verificati):** 60 clic e 3.492 impressioni, CTR circa 1,72%. Alcune lingue estere portano clic, specie Fortnite. Google ha scansionato ma **non indicizzato** vari articoli campionati; homepage indicizzata. Calo delle impressioni dal 12/11 da approfondire; **non è dimostrata alcuna penalizzazione**.
- **Audit OpenSEO 15/11, campione 50 pagine:** 4 titoli duplicati, 27 segnalazioni di pagine leggere, 37 meta-description brevi. Le correzioni mirate ai template e agli hub sono state integrate; non garantiscono indicizzazione.
- **News sitemap:** PR #25 generazione statica, PR #39 Edge Function che filtra le voci scadute anche senza rebuild. Test GitHub e anteprima Netlify verdi, **ma il comportamento live della funzione Edge e gli header di produzione non sono stati verificati** (ambiente di controllo non raggiunge il dominio). Non inventare una conferma di deploy pubblico.
- **Priorità:** verifica pubblica Netlify/sitemap e **resa reale della pagina Dragone7/Pirates**, 18/11 primo ciclo Claude con evidenze, controllo traduzioni, successiva analisi Google Search Console. Migliorare qualità, originalità, link interni e intenti dei lettori, non aumentare gli articoli indiscriminatamente.

## 7. Regole operative permanenti

1. Prima di ogni lavoro: leggere questo documento, `STATO-PROGETTO.md` e l'eventuale guida specifica; poi **controllare live** branch `main`, PR, commit, CI e preview. I documenti sono snapshot, non una prova di aggiornamento del repository.
2. Nessun push diretto su `main`. PR piccole, un solo obiettivo, e file condivisi annunciati. Se un altro assistente ha modificato `main`, sincronizzare e ripetere i test sull'HEAD corrente. Non forzare branch altrui.
3. Le approvazioni riguardano il contenuto e l'ambito dichiarati. Gianmarco non fa merge manuali. Nessun invio newsletter, modifica segreti, deploy alternativo, aumento costi o abilitazione auto-merge senza consenso.
4. Notizie urgenti e rettifiche: PR separata con verifica fonti e revisione umana; tempi rapidi non eliminano i controlli.
5. A fine sessione aggiornare **questo registro centrale** (PR, decisioni, blocchi, prossima azione). Tenere `STATO-PROGETTO.md` come **breve handoff**, senza copia del registro o informazioni contraddittorie; non eliminare vecchi branch.
6. La produzione Netlify va verificata separatamente dalla CI e dalla Deploy Preview: un merge riuscito non prova da solo che l'articolo sia servito dal dominio.

## 8. Decisioni registrate e prossima sessione

| Data | Decisione approvata | Stato |
|---|---|---|
| 16/11 | GitHub fonte persistente del progetto, PR per ogni cambiamento; `COLLABORAZIONE.md` documento principale, `STATO-PROGETTO.md` handoff | In vigore |
| 16/11 | Claude contenuti, ChatGPT SEO/tecnica/audit, Gianmarco responsabile approvazioni; assistenti possono eseguire merge autorizzati | In vigore |
| 16/11 | Una PR editoriale giornaliera; niente bozze private incomplete nel repository pubblico | In vigore |
| 16/11 | Conservare i branch storici fino a successiva decisione | In vigore |
| 17/11 | Avvio controllo editoriale diagnostico, **non auto-merge**. Automatizzare pubblicazione solo dopo requisiti di sicurezza, dry-run e ulteriore approvazione | Proposta non attiva |
| 17/11 | Claude dichiara aggiornato flusso 06:34 → 07:20; 07:47 da disattivare **solo dopo verifica** delle traduzioni nel primo ciclo | Configurato secondo Claude, **collaudo 18/11 pendente** |
| 17/11 | **Gianmarco autorizza l’avvio automatico dei video solo se muti**, con controlli manuali disponibili; nessuna deroga a XSS o avvio con audio | Approvato e integrato in PR #44; CI e preview verdi, browser live da verificare |

**Prossima azione:** il 18 novembre verificare evidenze del ciclo 06:34 → 07:20, classi editoriali, segnale unico, test/preview e traduzioni; poi valutare eventuale PR giornaliera con autorizzazione editoriale di Gianmarco. In parallelo controllare dal vivo sitemap News, risposte HTTP e indicizzazione con strumenti che possano accedere al dominio.

**Ripresa in una nuova chat:** «Riprendiamo Soffia Cartuccia 2.0. Controlla `COLLABORAZIONE.md` e `STATO-PROGETTO.md` in `gbrisiko91/premi-start`; verifica stato GitHub, PR, CI e Netlify prima di agire. Non riaprire attività completate. Prosegui dalla prima priorità aperta senza auto-merge non autorizzato.»
