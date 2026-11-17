# Video Pirates: riproduzione dopo la sanificazione HTML

La PR #31 sanifica il contenuto Markdown, eliminando l'attributo `autoplay` (non ammesso); i due video dell'articolo Pirates non avevano `controls`. La PR #41 ha già corretto le dimensioni delle immagini e dei media con classi CSS; questa PR completa l'accessibilità dei video.

In tutte le nove lingue, `autoplay` viene sostituito da `controls` sui due video; `poster`, `src`, `muted`, `loop`, `playsinline` e `preload` restano invariati. Corregge inoltre la whitelist del sanitizer per ammettere **solo l'attributo `src` sui video** (con i protocolli sicuri già consentiti, HTTP/HTTPS e percorsi relativi); senza questo fix i filmati non avrebbero un file da caricare. Il resto delle protezioni resta invariato.

I nuovi test caricano i Markdown delle nove lingue, passano da Marked e dal sanitizer effettivo, poi verificano entrambi i video con controlli, poster e URL locale. Un test aggiuntivo verifica che il sanitizer rimuova `src` con protocolli `javascript:` e `data:`. Il risultato riguarda il markup, non prova che il browser mobile sia stato verificato in produzione. Nessun auto-merge.
