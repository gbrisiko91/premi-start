# Video Pirates: riproduzione dopo la sanificazione HTML

La PR #31 sanifica il contenuto Markdown, eliminando l'attributo `autoplay` (non ammesso); i due video dell'articolo Pirates non avevano `controls`. La PR #41 ha già corretto le dimensioni delle immagini e dei media con classi CSS; questa PR completa l'accessibilità dei video.

In tutte le nove lingue, la PR #43 aveva sostituito `autoplay` con `controls` sui due video; il 17/11 Gianmarco ha autorizzato espressamente il ritorno dell’avvio automatico **solo se muto**. Dopo la PR #44 sono presenti **entrambi** `autoplay muted` e `controls`; `poster`, `src`, `muted`, `loop`, `playsinline` e `preload` restano invariati. Corregge inoltre la whitelist del sanitizer per ammettere **solo l'attributo `src` sui video** (con i protocolli sicuri già consentiti, HTTP/HTTPS e percorsi relativi); senza questo fix i filmati non avrebbero un file da caricare. Il resto delle protezioni resta invariato.

I nuovi test caricano i Markdown delle nove lingue, passano da Marked e dal sanitizer effettivo, poi verificano entrambi i video con controlli, poster e URL locale. Un test aggiuntivo verifica che il sanitizer rimuova `src` con protocolli `javascript:` e `data:`. Il risultato riguarda il markup, non prova che il browser mobile sia stato verificato in produzione. Nessun auto-merge.

## Decisione successiva (#44)

Autoplay è ammesso sul solo tag `<video>` e soltanto se l'attributo `muted` è presente; `playsinline` viene aggiunto per l'avvio mobile. I controlli manuali restano disponibili e gli URL `src` continuano ad essere sanitizzati. Non abilita script, stili inline o autoplay con audio. Test del contenuto nelle nove lingue e del caso video con audio impedito. La riproduzione reale sul sito va verificata separatamente.
