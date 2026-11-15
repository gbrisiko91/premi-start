// Seleziona articoli realmente attinenti, anziché soltanto gli ultimi della categoria.
// Non espone bozze e non mescola versioni linguistiche dello stesso contenuto.
export function selezionaCorrelati(articolo, candidati, limite = 3) {
  if (!articolo || !Array.isArray(candidati) || limite <= 0) return [];

  const normalizzaTag = (tags) => new Set(
    (Array.isArray(tags) ? tags : [])
      .map((tag) => String(tag).trim().toLowerCase())
      .filter(Boolean)
  );
  const tagOriginale = normalizzaTag(articolo.tag);

  return candidati
    .filter((altro) => altro && altro !== articolo
      && altro.id !== articolo.id && !altro.bozza
      && altro.lingua === articolo.lingua)
    .map((altro, posizione) => {
      const tagInComune = [...normalizzaTag(altro.tag)]
        .filter((tag) => tagOriginale.has(tag)).length;

      return {
        altro,
        posizione,
        // I tag del gioco/franchise pesano più della categoria generica.
        punteggio: tagInComune * 10 + (altro.categoria === articolo.categoria ? 2 : 0),
      };
    })
    .filter(({ punteggio }) => punteggio > 0)
    .sort((a, b) => b.punteggio - a.punteggio
      || b.altro.data - a.altro.data || a.posizione - b.posizione)
    .slice(0, Math.floor(limite))
    .map(({ altro }) => altro);
}
