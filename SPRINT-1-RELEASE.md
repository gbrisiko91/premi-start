# Sprint 1 — Procedura di rilascio sicuro

Questa modifica NON deve essere unita a `main` finché non è stata convalidata in staging e la chiave Netlify non è stata configurata.

## Prima del merge

1. Vai in Netlify → **Project configuration → Environment variables**.
2. Crea **VOTE_HASH_SECRET**, una stringa casuale stabile di almeno 32 byte.
   Puoi generarne una nel tuo terminale con `openssl rand -hex 32`.
   **Non scriverla nel repository, in una pull request o in chat.** Conservala nel gestore segreti.
3. Assicurati che la variabile sia disponibile alle Netlify Functions nell'ambiente **production**. Un redeploy sarà necessario perché le Functions la leggano.
4. Per testare in una Deploy Preview, configura una **chiave diversa per l'ambiente deploy-preview**, così i nuovi record restano isolati. Le Functions usano `getDeployStore` fuori da `production`; in produzione usano i namespace storici condivisi.
5. Verifica i dati correnti nei namespace Netlify Blobs **mi-piace** e **sondaggi**, annotando prima del merge i conteggi di un articolo e del sondaggio attivo.
6. Verifica in anteprima: GET senza voto; like, unlike e relike; sondaggio con un voto e doppio invio; eventuale errore 503 se manca il segreto.
7. Verifica la suite GitHub Actions e la Deploy Preview prima di unire.
8. Dopo il merge, verifica i conteggi di produzione prima/dopo. Non ruotare `VOTE_HASH_SECRET` senza una migrazione: i nuovi ballot sono indicizzati da quel segreto.

## Strategia dati

- **I record originali restano intatti.** Le chiavi `conti/` dei record storici non vengono più scritte dai nuovi endpoint.
- I nuovi Mi piace memorizzano un delta per visitatore nella chiave `v2/<articolo>/<HMAC>`; il totale è base storica + somma dei delta.
- I nuovi sondaggi salvano una scelta per visitatore in `v2/<sondaggio>/<HMAC>`, creata con `onlyIfNew`; il totale è il conteggio storico più i nuovi ballot.
- Gli identificativi sono **pseudonimi**, non anonimi in senso assoluto.
- Questo approccio elimina i conflitti fra incrementi al contatore condiviso, ma ogni lettura deve enumerare ballot. **Non è adatto a traffico elevato:** per scalare usare un database transazionale con migrazione esplicita e test.
- Il modello resta approssimativo per visitatore in presenza di IP condivisi, VPN e proxy. I risultati non possono essere interpretati come una persona fisica unica per voto.

## Contenuti

- Le nuove pubblicazioni con commenti redazionali o segnaposto irrisolti falliscono la build.
- I file storici invariati sono tollerati con avviso, ma i commenti non compaiono nell'HTML generato.
- La prima modifica a un file storico obbliga a risolvere le note. Non cancellare le note senza verificare le informazioni riportate.
- Le informazioni negli articoli devono essere verificate editorialmente: questa suite non dimostra l'accuratezza di ogni notizia.

## Privacy

Le pagine privacy delle nove lingue sono state riviste, ma **prima del merge richiedono anche una revisione giuridica competente** delle basi legali, tempi di conservazione e pseudonimizzazione effettiva.
