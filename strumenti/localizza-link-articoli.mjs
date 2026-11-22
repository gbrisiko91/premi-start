// In un articolo tradotto, porta i link a notizie già tradotte nella stessa
// lingua del lettore. Opera solo sui link <a href> del corpo editoriale.
// Non cambia il Markdown di Claude, i canonical, gli hreflang, le fonti o
// i link verso pagine che non hanno una traduzione pubblicata.
export function localizzaLinkArticoli(html, lingua, urlItaliane, urlTradotte) {
  if (lingua === "it" || !html || !urlItaliane || !urlTradotte) return html;
  return html.replace(
    /(<a\b[^>]*?\bhref\s*=\s*)(["'])(\/articoli\/[^"'?#]+\/)([?#][^"']*)?\2/gi,
    (intero, prefisso, virgoletta, href, suffisso = "") => {
      const id = urlItaliane.get(href);
      const destinazione = id ? urlTradotte.get(id) : null;
      return destinazione
        ? `${prefisso}${virgoletta}${destinazione}${suffisso || ""}${virgoletta}`
        : intero;
    }
  );
}
