# Video Pirates: riproduzione dopo la sanificazione HTML

La PR #31 sanifica il contenuto Markdown, eliminando l'attributo `autoplay` (non ammesso); i due video dell'articolo Pirates non avevano `controls`. La PR #41 ha già corretto le dimensioni delle immagini e dei media con classi CSS; questa PR completa l'accessibilità dei video.

In tutte le nove lingue, `autoplay` viene sostituito da `controls` sui due video; `poster`, `src`, `muted`, `loop`, `playsinline` e `preload` restano invariati. Il sanitizer e gli articoli editoriali non cambiano.

I nuovi test caricano i Markdown delle nove lingue, passano da Marked e dal sanitizer effettivo, poi verificano entrambi i video con controlli, poster e URL locale. Il risultato riguarda il markup, non prova che il browser mobile sia stato verificato in produzione. Nessun auto-merge.
