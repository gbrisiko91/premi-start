# Protezione HTML dei contenuti editoriali

Questa PR sanifica **dopo** `marked.parse()` ogni corpo Markdown di articoli, traduzioni e pagine fisse. Il filtro è una allowlist di tag/attributi, con URL `http:`/`https:` e `mailto:` sui link; script, iframe, SVG, `onerror`, stili inline e protocolli attivi vengono esclusi.

La pagina `/sfondi/` aveva stili inline: sono stati trasferiti a `src/stile.css` per conservarne il layout senza aprire il sanitizer a CSS non attendibile.

**Compatibilità:** HTML multimediale non previsto dalla allowlist (per esempio iframe di terze parti) non apparirà più nel corpo degli articoli. Da revisionare prima del rilascio usando la Deploy Preview e il confronto con il sito. Le immagini generate dal renderer `marked` perdono intenzionalmente `onerror` inline; le immagini di interfaccia fuori dal Markdown non cambiano.

**Ambito:** non modifica automazioni, permessi di GitHub, pubblicazioni editoriali o configurazione Netlify. Si applica soltanto alla resa HTML da Markdown.

**Test:** casi XSS, attributi `on*`, URL codificati, stili, link, tabelle e galleria sfondi. Il pacchetto `sanitize-html` è fissato alla versione 2.18.2.

Fonti: https://marked.js.org/ (avvertenza sulla mancata sanitizzazione); https://www.npmjs.com/package/sanitize-html .
