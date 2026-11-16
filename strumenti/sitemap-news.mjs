// Sitemap separata per Google News, conforme al namespace News 0.9.
// Comprende soltanto articoli già pubblicati, datati oggi o ieri (Europe/Rome).
// Poiché i contenuti espongono solo la data e non l'ora di prima pubblicazione,
// il filtro a giorni di calendario è conservativo rispetto alla finestra di 48h.
const escXml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

function giornoPrecedente(oggi) {
  const d = new Date(`${oggi}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function generaSitemapNews({
  articoli, oggi, nomePubblicazione, baseUrl, lingue, massimo = 1000,
}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(oggi))
    throw new Error("Data corrente non valida: attesa YYYY-MM-DD");
  const ieri = giornoPrecedente(oggi);
  const root = String(baseUrl).replace(/\/$/, "");
  const voci = (Array.isArray(articoli) ? articoli : [])
    .filter(a => {
      if (!a || a.bozza || !a.url || !a.titolo || !lingue[a.lingua]) return false;
      const data = a.data instanceof Date ? a.data.toISOString().slice(0, 10)
        : String(a.data ?? "").slice(0, 10);
      return data === oggi || data === ieri;
    })
    .sort((a, b) => b.data - a.data)
    .slice(0, Math.min(1000, Math.max(0, massimo)))
    .map(a => {
      const data = a.data instanceof Date ? a.data.toISOString().slice(0, 10)
        : String(a.data).slice(0, 10);
      const lingua = lingue[a.lingua];
      return `<url><loc>${escXml(root + a.url)}</loc><news:news><news:publication><news:name>${escXml(nomePubblicazione)}</news:name><news:language>${escXml(lingua)}</news:language></news:publication><news:publication_date>${data}</news:publication_date><news:title>${escXml(a.titolo)}</news:title></news:news></url>`;
    });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${voci.join("")}</urlset>\n`;
}
