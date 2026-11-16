# Proposta: pubblicazione automatica controllata

**Stato: PROPOSTA, NON ATTIVA.** Nessuna automazione di merge è implementata. Fino all'approvazione resta in vigore il protocollo manuale di `COLLABORAZIONE.md` §3.

Autore: Claude, 16/11/2026. Revisione richiesta: ChatGPT (tecnica e sicurezza). Approvazione: Gianmarco.

---

## 0. Obiettivo

```
06:34 Claude trova e verifica le notizie
  → bozze con scheda di verifica (nel Progetto Claude, privato)
07:20 sincronizzazione: controllo editoriale (gate) + traduzioni + PR editoriale
  → CI verde + gate verde + Netlify preview ok
  → auto-merge solo per PR editoriali autorizzate
  → deploy Netlify → controllo post-pubblicazione
ChatGPT: audit tecnico periodico del sito
Gianmarco: solo decisioni strategiche, modifiche tecniche, casi bloccati
```

---

## 1. Verifica delle dipendenze tra le attività (situazione reale al 16/11)

| Attività | Cosa fa davvero | Dipende da | Problema rilevato |
|---|---|---|---|
| 06:34 Bozze | Ricerca, scrive `bozze/*.md` nel Progetto Claude con `bozza: true` | — | Di solito finisce in circa 8 minuti (il 16/11: 06:34 → 06:42). Non lascia nessun segnale di "lavoro concluso". |
| 07:20 Sincronizzazione | Copia le bozze nel repo, **traduce con assistenti paralleli** solo gli articoli **già pubblicati**, gestisce calendario, sondaggi, newsletter e Instagram | 06:34 | Se le bozze arrivano in ritardo vengono saltate fino al giorno dopo. Gli articoli pubblicati a mano durante il giorno vengono tradotti solo la mattina successiva (fino a 24 h di ritardo). |
| 07:47 Traduzioni | Traduce i documenti `ordini/` del Progetto in `traduzioni/` | Un "ordine" creato a mano | **Inattiva nei fatti**: l'unico ordine risale al 05/11 e l'esecuzione del 16/11 è durata 11 secondi. Le traduzioni vere le fa già la sincronizzazione delle 07:20. Sono due meccanismi paralleli, e quindi c'è rischio di doppioni se qualcuno crea un ordine. |

**Conclusione:** l'ordine attuale funziona solo per caso, perché il distacco di 46 minuti di solito basta. Le traduzioni sono legate alla pubblicazione manuale, quindi con la pubblicazione automatica arriverebbero sempre il giorno dopo.

### Sequenza proposta

| Ora | Fase | Note |
|---|---|---|
| 06:34 | **Ricerca e bozze** (Progetto Claude) | Alla fine scrive `bozze/_stato/AAAA-MM-GG.md` con l'elenco dei file e `completato: true`. È il segnale di "pronto". |
| 07:20 | **Sincronizzazione e pubblicazione** | 1) Aspetta il segnale delle 06:34: se manca, ricontrolla ogni 10 minuti fino alle 08:30, poi segnala e procede con ciò che c'è. 2) Gate editoriale. 3) Traduce **subito** gli articoli che passano il gate, prima di aprire la PR, così italiano e 8 lingue escono insieme. 4) Apre la PR editoriale. 5) Dopo il merge controlla la pubblicazione. |
| 07:47 | **Da disattivare** | La sostituisce il punto 3 della sincronizzazione. Si disattiva solo dopo l'approvazione di Gianmarco. |
| Facoltativa 13:20 | Seconda tornata (solo notizie del giorno) | Stesso flusso, bozze limitate alle notizie uscite dopo le 06:30. Da decidere in base al budget di build Netlify (§6). |
| Su evento | Notizia urgente | Stesso gate e stessa PR editoriale, branch `contenuti/AAAA-MM-GG-urgente-<parola>`. |

Il build tratta le traduzioni di una bozza come bozze (`build.mjs`, eredità dello stato dall'originale): tradurre prima del merge non espone nulla in anticipo.

---

## 2. Criteri editoriali per la pubblicazione automatica

Un articolo è **pubblicabile in automatico** solo se soddisfa **tutti** i criteri. Se ne manca anche uno va in revisione manuale e **resta nel Progetto Claude** (privato), senza arrivare su GitHub.

### 2.1 Scheda di verifica obbligatoria nell'intestazione YAML

```yaml
verifica:
  stato: verificata            # verificata | da_rivedere
  natura: ufficiale            # ufficiale | dichiarazione | report | indiscrezione
  fonti_primarie: 1            # comunicati, blog/siti ufficiali, store ufficiali, documenti
  fonti_indipendenti: 2        # testate attendibili diverse dalla fonte primaria
  controllata_il: 2026-11-17T07:25+01:00
  dubbi: []                    # deve essere vuoto
```

### 2.2 Regole controllabili da script (gate)

| # | Regola |
|---|---|
| G1 | `verifica.stato: verificata` e `verifica.dubbi` vuoto |
| G2 | `fonti_primarie ≥ 1` **oppure** `fonti_indipendenti ≥ 2`, e altrettanti URL in `fonti` (https, domini diversi) |
| G3 | `natura` diversa da `indiscrezione` (le indiscrezioni vanno sempre a revisione manuale, vedi 2.3) |
| G4 | Nessuna nota interna o marcatore (`NOTE PER LA REDAZIONE`, `DA VERIFICARE`, `TODO`…): si riusa `validaArticolo` con `bozza: false` |
| G5 | Metadati SEO completi: `titolo`, `titolo_seo` ≤ 60, `sommario` 120-160, `parola_chiave`, `categoria` valida, data di oggi o di ieri |
| G6 | Immagine con `alt_immagine` e `crediti_immagine`, URL da dominio consentito (press kit, store ufficiali, siti degli editori) |
| G7 | **Niente doppioni**: nessun articolo con stesso slug, stessa `parola_chiave` o titolo molto simile negli ultimi 7 giorni; nessuna sovrapposizione con PR aperte (es. GTA 6 finché la #23 è aperta) |
| G8 | **Contenuto sicuro**: nessun `<script`, `<iframe`, `<style`, attributi `on*=`, link `javascript:` o `data:`. Il Markdown passa da `marked`, che lascia passare l'HTML grezzo, quindi questo controllo previene XSS sul sito pubblico |
| G9 | Limiti: al massimo 5 articoli italiani e 45 traduzioni per PR, ogni file sotto 60 KB |
| G10 | Ogni traduzione corrisponde a un articolo italiano presente nella stessa PR o già pubblicato, con link e numeri identici all'originale (controllo già presente in `strumenti/traduzioni.mjs`) |

### 2.3 Sempre revisione manuale (mai automatica)

- Indiscrezioni, leak e rumor (G3).
- Interviste, recensioni, prove dirette o qualsiasi testo in prima persona di Gianmarco.
- Notizie su persone reali in contesti delicati: licenziamenti con nomi, accuse, cause legali, decessi, salute.
- Modifiche ad articoli **già pubblicati**, comprese le rettifiche (procedura urgente manuale).
- Articoli in cui il controllo umanizzatore ha cambiato fatti, numeri o link.
- Qualsiasi modifica a `rubriche.mjs` (calendario e sondaggi): è codice eseguito dal build, quindi va in una PR separata `contenuti/AAAA-MM-GG-rubriche` con merge manuale.

---

## 3. Sicurezza GitHub: auto-merge solo per PR editoriali autorizzate

### 3.1 Condizioni (tutte obbligatorie)

| # | Condizione |
|---|---|
| S1 | Branch sorgente `contenuti/AAAA-MM-GG` o `contenuti/AAAA-MM-GG-urgente-*`, base `main` |
| S2 | Etichetta `editoriale-auto` messa dalla sincronizzazione |
| S3 | **Elenco di percorsi consentiti**: solo `content/articoli/*.md` **nuovi** (stato `added`) e `content/traduzioni/{en,de,es,no,sv,fi,ja,ru}/*.md` **nuovi**. Basta un file modificato, rinominato, cancellato o fuori elenco per bloccare l'auto-merge |
| S4 | CI `build` verde (`npm test`) |
| S5 | Nuovo job `gate-editoriale` verde (§2.2), eseguito sulla PR |
| S6 | Anteprima Netlify (deploy preview) riuscita |
| S7 | PR aggiornata con `main`. Se `main` è avanzato: rebase, nuovi controlli, nessun merge su controlli vecchi |
| S8 | Interruttore generale: variabile del repository `AUTO_PUBBLICAZIONE` = `on`. Con `off` l'auto-merge è sospeso e tutto torna manuale |
| S9 | Una sola PR editoriale automatica alla volta (concurrency group nel workflow) |

### 3.2 Implementazione proposta (da fare dopo l'approvazione)

1. **Protezione di `main`** (impostazione GitHub, la fa Gianmarco): PR obbligatoria, check `build` + `gate-editoriale` obbligatori, niente push diretti, niente force push. Attivare "Allow auto-merge".
2. **`strumenti/gate-pubblicazione.mjs`** con i test in `tests/gate-pubblicazione.mjs`: implementa G1-G10 e S3. Legge l'elenco dei file cambiati dalla API della PR. Lo scrive Claude, lo revisiona ChatGPT.
3. **`.github/workflows/gate-editoriale.yml`**: esegue il gate su ogni PR verso `main`. Sulle PR non editoriali dà sempre esito positivo (non applicabile), così non le blocca. Lo scrive o revisiona ChatGPT, perché è la sua area.
4. **`.github/workflows/auto-merge-editoriale.yml`**: se S1-S9 sono soddisfatte attiva l'auto-merge nativo di GitHub (squash). Permessi minimi: `contents: write`, `pull-requests: write`, solo su questo job. L'interruttore `AUTO_PUBBLICAZIONE` si controlla subito prima del merge.
5. **Codeowners** (`.github/CODEOWNERS`): tutto ciò che è fuori da `content/` richiede l'approvazione di Gianmarco.

Il deploy di produzione lo fa l'integrazione GitHub di Netlify quando cambia `main`, non GitHub Actions. Un merge eseguito con `GITHUB_TOKEN` quindi fa comunque partire il deploy Netlify. Da confermare in revisione.

### 3.3 Limite di identità da conoscere

Oggi Claude, ChatGPT e Gianmarco scrivono tutti con l'account `gbrisiko91`, quindi GitHub non distingue chi ha aperto una PR. La sicurezza poggia per questo su S1-S3 (percorsi e tipo di modifica), non sull'autore. Miglioramento consigliato: un account bot o una GitHub App dedicata alla sincronizzazione, con permessi limitati, e una condizione in più "autore = bot".

### 3.4 Quando un controllo fallisce

- La PR resta aperta e prende l'etichetta `blocco-editoriale`. Il motivo viene scritto in un commento della PR e nel riepilogo che Claude manda a Gianmarco (notifica push).
- Gli articoli che non passano il gate **non vengono caricati su GitHub**: restano nel Progetto Claude con l'elenco dei criteri non soddisfatti.
- Se fallisce solo un articolo, Claude lo toglie dalla PR e pubblica gli altri. Nessun articolo bloccato blocca tutti.

---

## 4. Bozze private

Il repository `gbrisiko91/premi-start` è **pubblico**. Le bozze con `bozza: true` non appaiono sul sito, ma chiunque le legge su GitHub. Proposta:

- **Su GitHub arrivano solo articoli che hanno passato il gate e sono pronti** (`bozza: false`). Le bozze restano nel Progetto Claude, che è privato.
- Facoltativo, decide Gianmarco: rendere il repository privato. Netlify funziona anche con repository privati.

---

## 5. Prevenzione di doppioni e conflitti

- **Lock per argomento**: prima di scrivere, Claude legge i titoli e i file delle PR aperte. Se una PR di ChatGPT o di Gianmarco tocca lo stesso gioco o tag, la notizia va in revisione manuale (G7).
- **Una PR editoriale al giorno** (più eventuali urgenti), sempre partendo da `main` aggiornato. Le PR editoriali aggiungono solo file nuovi (S3), quindi non possono entrare in conflitto con modifiche al codice.
- **Slug univoci** verificati su tutte le 9 lingue.
- **07:47 disattivata**, così le traduzioni hanno un solo canale.
- **Idempotenza**: se la sincronizzazione riparte (per errore o per un secondo giro), riprende il branch del giorno e non ricrea file già presenti.

---

## 6. Rischi per Netlify e per il sito pubblico

| Rischio | Mitigazione |
|---|---|
| Notizia sbagliata pubblicata | Gate e soglie di fonti, indiscrezioni escluse, controllo dopo la pubblicazione, ritiro rapido (§7) |
| XSS o HTML malevolo da Markdown | G8 e percorsi limitati (S3) |
| Build di produzione rotto | CI e anteprima Netlify obbligatorie prima del merge. Netlify pubblica in modo atomico: se un deploy fallisce, resta online la versione precedente |
| Consumo dei minuti di build Netlify | Una PR al giorno con pochi push (anteprima + produzione = 2 build/giorno). La tornata delle 13:20 raddoppia il consumo. Controllare il piano Netlify in uso |
| Newsletter domenicale con un articolo sbagliato | La sincronizzazione della domenica controlla l'anteprima prima delle 10:00 e, in caso di dubbio, chiede a Gianmarco di mettere `NEWSLETTER_AUTOMATICA=no` |
| Diritti delle immagini | G6 (domini consentiti, crediti obbligatori) |
| Sitemap News con URL ritirati | Il ritiro passa da `bozza: true` o dalla rimozione, la sitemap si rigenera a ogni build. Da verificare con ChatGPT |
| Automazione bloccata in silenzio | Ogni esecuzione invia un riepilogo. Se manca la PR del giorno, ChatGPT o Gianmarco lo vedono nel registro di `COLLABORAZIONE.md` |

---

## 7. Ritiro e rettifiche

- **Ritiro urgente**: PR di revert della PR editoriale. Siccome rimuove solo file aggiunti dall'automazione, può essere ammessa all'auto-merge, ma solo se il revert è esatto. Da decidere in revisione.
- **Rettifica**: sempre manuale (§2.3), procedura urgente di `COLLABORAZIONE.md` §6.

---

## 8. Attivazione per fasi

| Fase | Cosa | Chi | Merge |
|---|---|---|---|
| 0 | Questa proposta, revisione | ChatGPT → Gianmarco | Manuale |
| 1 | Scheda `verifica` nelle bozze delle 06:34, segnale di completamento, traduzioni prima della PR, bozze non pronte trattenute nel Progetto | Claude | Manuale |
| 2 | Script del gate, test, workflow `gate-editoriale`, CODEOWNERS | Claude (script e test) + ChatGPT (workflow e revisione) | Manuale |
| 3 | **Prova a secco per 5 giorni**: il gate gira ed etichetta le PR come "sarebbe stata pubblicata", ma il merge lo fa ancora Gianmarco. Si confrontano gli esiti | Tutti | Manuale |
| 4 | Protezione di `main`, interruttore `AUTO_PUBBLICAZIONE=on`, workflow di auto-merge, disattivazione della 07:47 | Gianmarco (impostazioni) + ChatGPT (workflow) | **Automatico solo per le PR editoriali** |
| 5 | Audit settimanale di ChatGPT: qualità tecnica, Core Web Vitals, sitemap, errori 404, esiti del gate | ChatGPT | — |

## 9. Decisioni richieste a Gianmarco

1. Indiscrezioni: sempre manuali, come proposto, oppure ammesse in automatico con etichetta "Indiscrezione" e almeno 2 fonti indipendenti?
2. Limite giornaliero di articoli automatici (proposta: 5).
3. Seconda tornata delle 13:20: sì o no.
4. Repository privato: sì o no.
5. Account bot dedicato per la sincronizzazione: sì o no.
