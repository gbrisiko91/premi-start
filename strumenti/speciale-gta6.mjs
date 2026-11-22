// Hub GTA 6: selezione esclusivamente di contenuti già pubblicati.
// Non pubblica bozze e non inventa URL, date o articoli.
export const ID_GUIDE_GTA6 = Object.freeze([
  "gta-6-guida-lancio",
  "gta-6-disponibile-italia",
  "gta-6-vendite-record",
]);

export function raccogliSpecialeGta6(articoli, limiteNotizie = 24) {
  if (!Array.isArray(articoli)) throw new TypeError("Elenco articoli non valido");
  const tutti = articoli
    .filter((a) => a && !a.bozza && typeof a.url === "string"
      && /^\/[a-z0-9/\-]+\/$/.test(a.url)
      && Array.isArray(a.tag) && a.tag.some((t) => String(t).toLowerCase() === "gta-6"))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      || String(a.id).localeCompare(String(b.id)));
  const visti = new Set();
  const senzaDuplicati = tutti.filter((a) => {
    if (!a.id || visti.has(a.id)) return false;
    visti.add(a.id);
    return true;
  });
  const guide = ID_GUIDE_GTA6
    .map((id) => senzaDuplicati.find((a) => a.id === id))
    .filter(Boolean);
  const inEvidenza = new Set(guide.map((a) => a.id));
  return {
    totale: senzaDuplicati.length,
    guide,
    notizie: senzaDuplicati.filter((a) => !inEvidenza.has(a.id))
      .slice(0, Math.max(0, Math.min(60, limiteNotizie))),
    ultimoAggiornamento: senzaDuplicati[0]?.data || null,
  };
}
