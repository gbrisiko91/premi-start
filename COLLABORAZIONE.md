# Soffia Cartuccia 2.0 — Collaborazione, stato e decisioni

> **Documento centrale e unico registro operativo** per Gianmarco, Claude e ChatGPT. Prima di qualsiasi intervento, leggere qui, controllare GitHub/CI/Netlify e aggiornare i fatti che sono cambiati. `STATO-PROGETTO.md` è soltanto la sintesi di passaggio fra chat: non mantiene un secondo registro autonomo.
>
> **Snapshot del 18 novembre 2026 (Europe/Rome)**. Stato verificato su GitHub: `main` a `7ef4128d419453fc8641d8cb8b9c3b0ca247b36d` dopo il merge autorizzato della **PR #46**, GitHub Actions `44386380609` conclusa con successo, **0 PR aperte** al controllo. Il presente aggiornamento documentale produrrà un commit successivo; rileggere sempre GitHub prima di agire.

## 1. Missione e riferimenti

- Sito pubblico: https://soffiacartuccia.it · codice: https://github.com/gbrisiko91/premi-start
- Obiettivo: testata gaming italiana e multilingue (9 lingue), orientata a notizie **verificabili**, GTA 6 e grandi eventi, scoperte indie, retrogaming, guida al lettore e crescita organica misurabile; la qualità prevale sulla quantità.
- Regole redazionali: [GUIDA-REDAZIONE.md](GUIDA-REDAZIONE.md). La **copia del Progetto privato Claude** è quella letta dalle automazioni; Claude deve mantenerla coerente con GitHub (la sincronizzazione dei due documenti non è automatica).
- Pubblicazione automatica controllata per sole nuove notizie verificate (decisione 25/11, PR #85): [AUTO-PUBBLICAZIONE-EDITORIALE.md](AUTO-PUBBLICAZIONE-EDITORIALE.md). Disegno storico: [PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md](PROPOSTA-PUBBLICAZIONE-AUTOMATICA.md).
- Continuità fra conversazioni: [STATO-PROGETTO.md](STATO-PROGETTO.md); rilievi SEO: [SEO-INDICIZZAZIONE-AUDIT.md](SEO-INDICIZZAZIONE-AUDIT.md).

## 2. Ruoli, autorizzazioni e aree del repository

| Responsabile | Ambito e limiti |
|---|---|
| **Gianmarco** | Decide priorità, strategia, approvazione editoriale e autorizzazione dei rilasci. **Non deve operare manualmente su GitHub**. |
| **Claude** | Notizie, verifica fonti, articoli, traduzioni, guida editoriale nel Progetto, kit social, newsletter e sincronizzazione PR. Non esegue push diretto su `main` né merge non autorizzati. |
| **ChatGPT** | Architettura, sicurezza, SEO tecnico, indicizzazione, audit, test, revisione delle PR, verifiche e **merge autorizzati**. |

Aree: `content/articoli/`, `content/traduzioni/`, `content/pagine/` e `GUIDA-REDAZIONE.md` prevalentemente Claude. `tests/`, `.github/workflows/`, `netlify/`, strumenti SEO e sicurezza prevalentemente ChatGPT. `build.mjs`, `src/`, `rubriche.mjs`, `sito.config.mjs`, `lingue.mjs`, `novita.mjs` sono **condivisi/delicati**: segnalare la modifica prima di una PR. Non modificare il medesimo file in due PR concorrenti. Non eliminare i branch storici senza nuova decisione di Gianmarco.

**Rilascio:** per le sole PR editoriali giornaliere verificate e ammesse dal controllo della PR #85 vale l'autorizzazione permanente del 25/11/2026. Tutte le altre PR richiedono un'approvazione specifica del proprietario dopo controlli di fatti, diff, SHA, CI, gate e preview Netlify. Non modificare segreti, produzione, newsletter/Brevo, protezione branch o automazioni senza autorizzazione appropriata.

## 3. Flusso giornaliero: programma del 18 novembre

Le attività sono configurate **nel Progetto privato Claude**, non in GitHub. Il **primo ciclo del 18/11 è riuscito a produrre la PR #46**: segnale dichiarato `ricerca-2026-11-18T06:34-ali9`, 2 articoli pronti, 40 traduzioni in otto lingue, test/gate/preview verdi, approvazione esplicita del proprietario e merge effettuato da ChatGPT. **Restano non collaudati in prova ripetuta** il riuso dei segnali e le condizioni di guasto delle automazioni private; non proclamare collaudo completo o auto-merge.

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

**Aggiornamento auto-merge del 25/11/2026:** Gianmarco ha richiesto espressamente di pubblicare automaticamente le notizie *già pronte* per evitare ritardi come la PR #84 (The Witcher 4). La PR tecnica #85 introduce un workflow privilegiato su `main` che ricontrolla autonomamente ogni nuova PR `contenuti/AAAA-MM-GG` con gate sicuro, soli file Markdown nuovi, build, gate e Netlify Preview verdi sulla stessa SHA, e verifica della pubblicazione reale dopo il merge. **Finché #85 non è integrata, questa funzione NON è attiva.** Una volta integrata, riguarda esclusivamente le PR idonee: qualsiasi codice, bozza, intervista, indiscrezione, rettifica e progetto speciale resta a merge manuale. Kill switch `AUTO_PUBBLICAZIONE=off` nelle variabili Actions. [Procedura e limiti](AUTO-PUBBLICAZIONE-EDITORIALE.md). I requisiti di bot indipendente/protezione `main` restano miglioramenti di sicurezza da completare prima di estendere i casi automatici.

## 5. Registro PR — snapshot GitHub 17/11

**PR aperte: 0** al controllo successivo al merge #46. Ultimo `main` verificato `7ef4128`, CI `44386380609` verde. Il presente aggiornamento documentale genera un commit successivo.

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
| #45 | Stato di progetto aggiornato al termine del 17 novembre | Integrata |
| #47 | Articolo GTA 5 The Last Ride, evento fan | Integrata il 18/11, controllo fonti effettuato |
| #48 | Revisione del Last Ride: orari, raduno PS5, fonti e dettagli di partecipazione | Integrata il 18/11 |
| #49 | GTA 6: recensioni e uscita in Nuova Zelanda, articolo urgente | Integrata il 18/11 |
| #46 | 2 articoli (Sony PlayStation Store, Xbox Game Pass) e 40 traduzioni | **Integrata con approvazione di Gianmarco il 18/11**; commit `7ef4128`, CI success, deploy produzione da verificare |

**Conservare la distinzione storica:** nella PR #28 quattro bozze del 17/11 erano presenti nel ramo pubblico e poi rimosse dal diff prima del merge. In seguito **tre** di quelle notizie sono uscite con la #32; **Craig Houston** resta in revisione umana e non va pubblicato automaticamente. La cronologia pubblica della #28 potrebbe ancora esporre i vecchi contenuti: non ripetere l'errore con bozze future.

## 6. SEO, rilascio e misurazione

- **Search Console (18/10–14/11, dati verificati):** 60 clic e 3.492 impressioni, CTR circa 1,72%. Alcune lingue estere portano clic, specie Fortnite. Google ha scansionato ma **non indicizzato** vari articoli campionati; homepage indicizzata. Calo delle impressioni dal 12/11 da approfondire; **non è dimostrata alcuna penalizzazione**.
- **Audit OpenSEO 15/11, campione 50 pagine:** 4 titoli duplicati, 27 segnalazioni di pagine leggere, 37 meta-description brevi. Le correzioni mirate ai template e agli hub sono state integrate; non garantiscono indicizzazione.
- **Nuovo audit OpenSEO 18/11, campione 50 pagine:** 0 titoli duplicati, 8 pagine brevi, 28 meta-description brevi; 817 URL non scansionate per limite del crawl. Non confrontare campioni come se fossero l'intero sito. I dati GSC delle impressioni restano anomali dal 12/11, senza causa dimostrata. Dettagli in `SEO-INDICIZZAZIONE-AUDIT.md`.
- **News sitemap:** PR #25 generazione statica, PR #39 Edge Function che filtra le voci scadute anche senza rebuild. Test GitHub e anteprima Netlify verdi, **ma il comportamento live della funzione Edge e gli header di produzione non sono stati verificati** (ambiente di controllo non raggiunge il dominio). Non inventare una conferma di deploy pubblico.
- **Priorità:** verifica pubblica Netlify/sitemap e **resa reale della pagina Dragone7/Pirates**; primo ciclo 18/11 riuscito fino alla PR #46 e al merge autorizzato (40 traduzioni); verificare il comportamento delle automazioni in casi ripetuti e dopo dati GSC consolidati. Migliorare qualità, originalità, link interni e intenti dei lettori senza aumentare gli articoli indiscriminatamente.

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
| 25/11 | Autorizzata auto-pubblicazione delle sole notizie giornaliere verificate, con gate attendibile, build+preview verdi e kill switch (PR #85) | In attesa del merge della PR #85 |
| 16/11 | GitHub fonte persistente del progetto, PR per ogni cambiamento; `COLLABORAZIONE.md` documento principale, `STATO-PROGETTO.md` handoff | In vigore |
| 16/11 | Claude contenuti, ChatGPT SEO/tecnica/audit, Gianmarco responsabile approvazioni; assistenti possono eseguire merge autorizzati | In vigore |
| 16/11 | Una PR editoriale giornaliera; niente bozze private incomplete nel repository pubblico | In vigore |
| 16/11 | Conservare i branch storici fino a successiva decisione | In vigore |
| 17/11 | Avvio controllo editoriale diagnostico, **non auto-merge**. Automatizzare pubblicazione solo dopo requisiti di sicurezza, dry-run e ulteriore approvazione | Proposta non attiva |
| 17/11 | Claude dichiara aggiornato flusso 06:34 → 07:20; 07:47 da disattivare **solo dopo verifica** delle traduzioni nel primo ciclo | Configurato secondo Claude, **collaudo 18/11 pendente** |
| 17/11 | **Gianmarco autorizza l’avvio automatico dei video solo se muti**, con controlli manuali disponibili; nessuna deroga a XSS o avvio con audio | Approvato e integrato in PR #44; CI e preview verdi, browser live da verificare |

**Prossima azione:** il 18 novembre verificare evidenze del ciclo 06:34 → 07:20, classi editoriali, segnale unico, test/preview e traduzioni; poi valutare eventuale PR giornaliera con autorizzazione editoriale di Gianmarco. In parallelo controllare dal vivo sitemap News, risposte HTTP e indicizzazione con strumenti che possano accedere al dominio.

**Ripresa in una nuova chat:** «Riprendiamo Soffia Cartuccia 2.0. Controlla `COLLABORAZIONE.md` e `STATO-PROGETTO.md` in `gbrisiko91/premi-start`; verifica stato GitHub, PR, CI e Netlify prima di agire. Non riaprire attività completate. Prosegui dalla prima priorità aperta senza auto-merge non autorizzato.»


## Aggiornamento 20/11/2026 sera — Instagram e Search Console

**Stato GitHub verificato prima della PR #58:** `main` a `1e3c330c0ad73e0d2eca4b17036c0f9d3d91464a`, PR #55 e #57 integrate, nessuna PR aperta al momento di partenza. La homepage pubblica mostrava i tre articoli del 20/11 e `/sfondi/` mostrava il traguardo 2.500 follower. GitHub Actions sull'ultimo merge #57 era verde; l'endpoint `/api/statistiche-sfondi` non è stato convalidato con una richiesta HTTP diretta, quindi non dichiarare la dashboard collaudata in produzione.

**Nuova [PR #58](https://github.com/gbrisiko91/premi-start/pull/58):** landing `/instagram/` con il regalo dei 2.500 follower in primo piano, tre articoli GTA 6 realmente pubblicati senza doppioni, nuove uscite e rubriche, CSS per mobile e test automatici. Aggiunto un checkpoint SEO a `SEO-INDICIZZAZIONE-AUDIT.md` con dati Search Console verificati il 20/11. Nessun nuovo articolo, modifica a segreti o newsletter. **Il merge della PR #58 richiede autorizzazione del proprietario**; nuova build/preview da ricontrollare sull'ultimo commit, non confondere un job precedente con quello finale.

**SEO:** la Search Console conferma un crollo delle impressioni dal 12/11; la homepage è indicizzata, ma articoli selezionati GTA 6/Fortnite/Worlds sono scoperti o scansionati senza indicizzazione. Su diversi URL scansionati robots e canonical risultano corretti: **nessuna penalizzazione dimostrata**. Prima modificare contenuti e link solo dopo revisione mirata di pagine con domanda reale; vedi report tecnico aggiornato.

**Prossimo passo:** ottenere approvazione della #58 dopo CI/gate/Netlify e valutare in una PR successiva un intervento editoriale mirato sui contenuti con impressioni, coordinando Claude sulle traduzioni. Conservare separati indicatori GSC, clic sui wallpaper e potenziali dati analytics.

## Aggiornamento 22/11/2026 — hub Speciale GTA 6 (PR #61)

**Stato di partenza verificato:** `main` a `4e432eda3e25d9a598563d45bd57847627c14aa0` dopo la pubblicazione autorizzata della PR #60 (3 articoli del 22/11, 24 traduzioni); nessuna PR aperta prima dell'intervento. La homepage pubblica mostrava effettivamente i tre articoli del 22/11 e `/sfondi/` mostrava i download della Missione 5K. L'accesso web automatico a `/instagram/` e `/api/statistiche-sfondi` non è stato conclusivo: **non dichiarare guasti o funzionamento HTTP confermato** senza un controllo dal browser/Netlify.

**Nuova [PR #61](https://github.com/gbrisiko91/premi-start/pull/61):** pagina statica italiana `/speciale-gta-6/` che raccoglie **solo articoli GTA 6 pubblicati** e separa tre guide chiave dagli aggiornamenti, senza duplicati, link inventati o copie di bozze; introduzione editoriale con distinzione fra notizie ufficiali e rumor. Collega l'hub dalla homepage *dopo le ultime notizie*, dalla landing Instagram e dagli articoli italiani taggati GTA 6; include `CollectionPage` / `ItemList` JSON-LD, canonical, sitemap, CSS responsive e test dedicati. Altre lingue **non modificate** per evitare traduzioni mancanti o interfacce non localizzate. Nessuna modifica a contenuti di Claude, chiavi, newsletter, cookie o automazioni.

**Obiettivo:** navigazione più utile e collegamenti interni coerenti; **non** è una correzione dimostrata del calo Google e non garantisce l'indicizzazione. Dopo l'eventuale rilascio controllare HTTP della pagina, link, struttura mobile e Google Search Console. **No auto-merge:** ottenere approvazione esplicita di Gianmarco e controllare build, gate e preview sull'ultimo HEAD.

**Per Claude:** mantenere il tag `gta-6` soltanto sugli articoli pertinenti; la raccolta viene aggiornata automaticamente in fase di build. Non intervenire sul medesimo `build.mjs`/CSS condiviso in una PR concorrente senza coordinamento.


## Aggiornamento 22/11/2026 notte — verifica automatica del deploy (PR #63)

**Stato iniziale:** `main` a `a9a1cebbabf1cdb1e71c1f84038a1f2475c6f5f9` con PR #61 integrata e build riuscita; nessuna PR aperta. L'ispezione Google Search Console del 22/11 conferma 3.436 impressioni/60 clic dal 6 all'11/11 e solo 29 impressioni/1 clic dal 12 al 19/11. Il crollo è globale, la homepage italiana risulta indicizzata e varie pagine recenti non ancora; **causa non determinata, nessuna penalizzazione dimostrata**. Vedi `SEO-INDICIZZAZIONE-AUDIT.md`.

**PR #63:** nuovo manifest pubblico `/stato-deploy.json` (SHA commit e ultime tre URL italiane, senza dati personali); workflow GitHub `Verifica pubblicazione reale Netlify` che, **dopo ogni nuovo push su main**, controlla tramite HTTP il commit realmente distribuito, home, Instagram, sfondi, ultimi articoli, Speciale GTA 6, canonical, robots.txt e sitemap. Nuovi test nella suite; nessuna dipendenza, segreto o integrazione invasiva. Il workflow può risultare rosso in caso di deploy Netlify lento/non aggiornato: è una **diagnostica**, non un auto-rollback; se rosso controllare deploy Netlify e commit prima di cambiare file. Con merge successivo si attiva il workflow, quindi chiedere approvazione esplicita a Gianmarco prima di integrarla.

**Attività successive:** attendere CI/gate/preview sull'HEAD della PR #63; chiedere approvazione rilascio; usare la prima esecuzione post-merge per confermare il sito pubblico. Per il crollo Google verificare anche i rapporti completi *Indicizzazione*, *Statistiche di scansione*, *Azioni manuali* e *Sicurezza* in Search Console; non applicare `noindex`, modifiche canonical o riscritture editoriali indiscriminate. Coordinare Claude per revisioni mirate alle pagine Fortnite che avevano domanda effettiva.

## Aggiornamento 22/11/2026 — descrizioni SEO rubriche (PR successiva alla #65)

**Stato di partenza:** `main` a `33cc154536afa3c439cf5a23ebca54396103acdd`, PR #65 integrata; build e verifica HTTP del deploy entrambe verdi, nessuna PR aperta.

**Nuova PR tecnica:** metadati descrittivi localizzati per quiz, indie, sondaggio, autore e calendario uscite nelle **nove lingue**. Le 45 descrizioni riassumono funzionalità effettivamente presenti, sono distinte per pagina e non alterano H1, copy visibile, articoli o traduzioni di Claude. Test su lunghezza, canonical, robots, lingua e testo HTML; nessuna nuova dipendenza.

**Motivo verificato:** audit OpenSEO del 22/11/2026, limitato a 50 pagine, segnala **27 meta description brevi** prevalentemente su rubriche e profili; in un sottoinsieme segnala 8 pagine quiz/sondaggi come *thin content*. Questa PR risolve solo la descrizione del risultato, **non** aggiunge testo fittizio né cambia indicizzabilità delle pagine thin. Google può ignorare il meta description e formare lo snippet da altre sezioni.

**Attenzione:** il calo GSC dal 12/11 resta senza causa dimostrata. Le modifiche ai meta tag non sono presentate come soluzione al crollo, né garantiscono ranking/index. **Non eseguire merge prima di approvazione esplicita del proprietario**. Claude mantiene proprietà dei contenuti e delle traduzioni degli articoli.

## Aggiornamento 22/11/2026 — rubriche leggibili senza JavaScript (nuova PR)

**Stato iniziale:** PR #66 integrata su `main` commit `56e21dee96b9a70b2b00e5124be89f2083835ea5`; GitHub build e verifica reale HTTP su Netlify entrambe verdi. Nessuna PR aperta all'avvio dell'attività.

**Intervento:** il quiz mostra nell'HTML tre esempi reali dalla banca dati esistente, con risposta e spiegazione dietro elementi `<details>`, senza alterare la domanda quotidiana gestita da `public/quiz.js`. La pagina sondaggi mostra direttamente in HTML domande e opzioni delle settimane passate, già pubblicate e localizzate in nove lingue. `public/sondaggio.js` usa e aggiorna le schede preesistenti con **conteggi effettivi dal backend**, senza ripeterle, e gestisce il cambio della domanda corrente quando la data locale avanza rispetto all'ultima build. In assenza di JavaScript si leggono le scelte storiche, **non** vengono attribuiti numeri di voti inesistenti.

**Vincoli:** non modificare testi editoriali di Claude, dati reali del voto, `netlify/functions/sondaggio.mjs`, privacy, cookies o API. Test HTML delle nove lingue, canonical e robots invariati. L'audit OpenSEO del 22/11 ha segnalato alcune pagine quiz/sondaggi come `thin-content`, ma questo intervento mira all'utilità per i lettori; non costituisce garanzia di superamento delle soglie del crawler o di recupero delle impressioni. Verificare CI/gate/preview sull'ultimo HEAD e chiedere approvazione esplicita prima del merge.

## Revisione mirata 22/11/2026 — Fortnite SV e GTA 6 preload EN (PR editoriale)

**Partenza confermata:** `main` a `6197b8d265c1b5be79cfbd661511a52ca05c4246`, PR #67 integrata; build e verifica HTTP Netlify verdi; zero PR aperte prima dell'intervento. La issue #68 contiene il checkpoint operativo della chat; la issue #50 conserva l'indagine GSC.

**Intervento proposto, da controllare con Claude:** due sole traduzioni, **Fortnite Pirate Shop Token in svedese (SV)** e **GTA 6 preload in inglese (EN)**; nessuna modifica all'originale italiano, altre traduzioni, infrastruttura di deploy o API. Fortnite SV: nuovo angle SEO su probabilità e reperimento, FAQ che distinguono stima community (1/700.000 forzieri) da dati ufficiali **non disponibili**, divieto di compravendita account con fonte Epic. GTA 6 EN: corregge il presente/futuro di date ormai passate (preload 10/11, uscita 19/11), precisa **fino a 212 GB per il preload a seconda del dispositivo**, introduce fonti primarie Rockstar e corregge un link a The Duskbloods verso la versione EN.

**Verifiche primarie (22/11):**
- Rockstar Newswire 3/11: https://www.rockstargames.com/newswire/article/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10
- Rockstar Newswire 10/11: https://www.rockstargames.com/newswire/article/89834o94713o21/pre-load-grand-theft-auto-vi-now
- Rockstar Newswire 19/11: https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available
- Epic Games support: https://www.epicgames.com/help/c-34254770/c-Fortnite_BillingSupport/a14738255?lang=en-US (acquisto/vendita/condivisione di account non consentiti).

**Misurazioni storiche:** GSC 23/10–19/11: Fortnite SV 423 impressioni, 1 clic (CTR 0,24%; posizione media 7,7); GTA 6 preload EN 107 impressioni, 1 clic. Attuale URL Inspection: entrambe `Crawled - currently not indexed`, canonical auto-referenziale. **Non** equiparare il CTR storico con lo stato di indicizzazione attuale e non aspettarsi che cambiare meta tag garantisca il ritorno in Google.

**Processo:** questa PR è una **proposta editoriale per revisione Claude + ChatGPT**, non dà permesso a pubblicare da sola. Verificare correttezza idiomatica svedese/inglese, fonti, link e file; passare `npm test`, gate e Netlify preview. Il proprietario approva il merge **esplicitamente**; poi controllare CI e HTTP produzione. Non sovrapporre altra PR sugli stessi due file senza coordinamento.

## 22/11/2026 — QA collegamenti nelle traduzioni, issue #70

**Evidenza verificata sul repository dopo la PR #69:** due gruppi di articoli tradotti (Fortnite Pirate Shop Token dell'05/11 e GTA 6 preload del 04/11), 16 pagine tradotte complessive, contengono **15 link editoriali verso pagine italiane** nonostante la versione nella lingua del lettore sia già pubblicata. In GTA 6 EN il link era stato corretto nella PR #69; nelle altre sette lingue rimandava ancora a `/articoli/the-duskbloods-rinvio-2027/`. In tutte e otto le traduzioni Fortnite rimandava a `/articoli/itch-io-giochi-ia-eliminati/`. Le traduzioni di entrambi i documenti di destinazione esistono in tutte le otto lingue.

**Intervento tecnico, non riscrittura editoriale:** localizzare in fase di generazione i link `<a href>` del **solo corpo dell'articolo tradotto**, se e soltanto se l'URL italiano identifica una notizia pubblicata e la corrispondente traduzione nella lingua del lettore è anch'essa pubblicata. Se manca, mantenere il link italiano; non toccare gli URL esterni, la nota `tradotto da ...` che collega all'originale, i testi di Claude, gli attributi canonical/hreflang, sitemap o dati strutturati. Test unitari e su 16 pagine generate; evita di correggere manualmente quindici Markdown e previene lo stesso errore in futuri articoli.

**Sul sondaggio FI:** l'ultimo audit del 22/11 conta 132 parole su `/fi/kysely/`, HTTP 200, indicizzabile, presente in sitemap. La pagina mostra già istruzioni, natura non rappresentativa del voto e domande storiche in HTML; è un avvertimento quantitativo `thin-content`, NON una prova di contenuto scorretto o un invito ad aggiungere parole inutili. La prossima domanda prevista per lunedì 23/11 potrà ampliare naturalmente l'archivio statico al successivo build. Revisione linguistica umana del finlandese rimane utile ma non urgente rispetto all'intervento sui link.

**Processo:** nuova PR solo tecnica con build, test, gate e Deploy Preview; il merge richiede approvazione esplicita del proprietario. Claude continua a curare titoli e copy editoriali; segnalarci link in lingua impropria se una destinazione non ha traduzione.


## 26/11/2026 — Prima prova diretta GTA 6 e player YouTube leggero

Gianmarco Buono ha approvato **il 26/11 alle 23:15** il testo originale «GTA 6, le nostre prime impressioni su PS5», registrato su PS5. Pubblicazione in **due PR distinte**, senza interventi diretti a `main`:

- **[PR #87](https://github.com/gbrisiko91/premi-start/pull/87)**: articolo italiano `gta-6-prime-impressioni-ps5` e otto traduzioni (de, en, es, fi, ja, no, ru, sv); integrata in `main` con commit `01bf231f1864c9f7eb3192bd8a9e6ad03d3c1ca2`. Categoria usata: `console`, perché la categoria `recensioni` non è definita. I due video rimangono materiale originale dichiarato dal fondatore; il voto 8,5/10 è **provvisorio**, non una recensione conclusiva né una prova prestazionale misurata in laboratorio. I link interni puntano a notizie già pubblicate.
- **[PR #88](https://github.com/gbrisiko91/premi-start/pull/88)**: player cliccabile (miniatura + tasto play) in `src/video.js`, CSS in `src/stile.css`, mantenimento sicuro di `data-id` e `data-titolo` nella sanificazione, build che carica lo script solo sugli articoli con `.video-yt`, informativa privacy e test. La PR deve completare build/gate/preview **sull'ultimo HEAD** prima del merge.

**Contratto del componente video per futuri articoli:**
`<div class="video-yt" data-id="ID_DI_11_CARATTERI" data-titolo="Titolo"><a href="https://www.youtube.com/watch?v=ID_DI_11_CARATTERI" target="_blank" rel="noopener"><img src="https://i.ytimg.com/vi/ID_DI_11_CARATTERI/hqdefault.jpg" alt="Descrizione" width="480" height="360" loading="lazy"><span class="video-yt__play" aria-hidden="true"></span></a></div>`. Da mantenere nel corpo Markdown come HTML; **non** aggiungere iframe o script nei contenuti. Il filtro li elimina. Con JavaScript disponibile, il clic carica un iframe `youtube-nocookie.com`; senza JavaScript il link apre YouTube. Il sito **richiede ancora le miniature da i.ytimg.com prima del clic**: non dichiarare zero richieste a Google. La privacy spiega questa distinzione.

Il merge editoriale non autorizza pubblicazioni su Instagram né nuovi invii email agli ospiti di Premi Start. La PR #81 e la PR #83 restano indipendenti e sospese secondo le istruzioni del proprietario.
