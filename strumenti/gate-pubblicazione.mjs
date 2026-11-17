// Gate editoriale diagnostico (dry-run): NON autorizza merge, NON pubblica e non modifica file.
// I controlli meccanici non certificano mai la verità dei contenuti.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LINGUE = new Set(["en", "de", "es", "no", "sv", "fi", "ja", "ru"]);
const CATEGORIE = new Set(["console", "pc", "retro", "industria"]);
const PENDENTI = /\b(?:DA VERIFICARE|NOTE PER LA REDAZIONE|TODO|FIXME|TBD)\b/i;
const HTML = /<!--[\s\S]*?-->|<\/?[a-z][^>]*>/i;
const SENSIBILI = /licenziat|accusat|denunciat|decedut|morto|arrestat|salute|malattia|suicid|molest/i;
const NATURA_REVISIONE_UMANA = new Set(["indiscrezione", "rumor", "intervista", "recensione"]);

export function leggiCambiamenti(testo) {
  return String(testo).split(/\r?\n/).filter(Boolean).map(line => {
    const [stato, ...files] = line.split("\t");
    return { stato, file: files.at(-1) || "" };
  });
}
const messaggio = (file, controllo, testo) => ({ file, controllo, testo });
function frontMatter(source) {
  try { return matter(source); }
  catch { return null; }
}
export function valutaCambiamenti(cambiamenti, { leggi, esiste, oggi = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date()) }) {
  const problemi = [], articoli = [], traduzioni = [];
  const aggiungi = (file, controllo, testo) => problemi.push(messaggio(file, controllo, testo));
  const italianiInPR = new Set(cambiamenti.filter(c => c.stato === "A" && /^content\/articoli\/[^/]+\.md$/.test(c.file)).map(c => path.posix.basename(c.file)));
  const keySet = new Set();
  for (const { stato, file } of cambiamenti) {
    if (stato !== "A") { aggiungi(file, "S3", "Sono ammessi soltanto file nuovi; modifica/rimozione/rinomina richiede revisione manuale"); continue; }
    const isArticolo = /^content\/articoli\/[^/]+\.md$/.test(file);
    const matchT = file.match(/^content\/traduzioni\/(en|de|es|no|sv|fi|ja|ru)\/([^/]+\.md)$/);
    if (!isArticolo && !matchT) { aggiungi(file, "S3", "Percorso fuori dalla whitelist editoriale"); continue; }
    let source = "";
    try { source = leggi(file); } catch { aggiungi(file, "G0", "File non leggibile"); continue; }
    const parsed = frontMatter(source);
    if (!parsed || !parsed.content.trim()) { aggiungi(file, "G0", "Front matter o corpo mancante/non valido"); continue; }
    const m = parsed.data;
    if (matchT) {
      traduzioni.push(file);
      const original = "content/articoli/" + matchT[2];
      if (!italianiInPR.has(matchT[2]) && !esiste(original)) aggiungi(file, "G10", "Traduzione senza originale italiano");
      if (!m.titolo || !m.slug || !parsed.content.trim()) aggiungi(file, "G10", "Titolo, slug o corpo traduzione mancante");
      continue;
    }
    articoli.push(file);
    if (m.bozza !== false) aggiungi(file, "G1", "Non pubblicare bozze o stato bozza non esplicito");
    if (!m.titolo || !m.titolo_seo || !m.sommario || !m.parola_chiave) aggiungi(file, "G5", "Metadati SEO incompleti");
    if (m.titolo_seo && String(m.titolo_seo).length > 60) aggiungi(file, "G5", "Titolo SEO oltre 60 caratteri");
    if (m.sommario && (String(m.sommario).length < 120 || String(m.sommario).length > 160)) aggiungi(file, "G5", "Sommario fuori dalla fascia 120–160 caratteri");
    if (!CATEGORIE.has(m.categoria)) aggiungi(file, "G5", "Categoria non riconosciuta");
    const d = m.data instanceof Date ? m.data.toISOString().slice(0, 10) : String(m.data || "").slice(0, 10);
    const yesterday = new Date(oggi + "T00:00:00Z");
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    if (d !== oggi && d !== yesterday.toISOString().slice(0, 10)) aggiungi(file, "G5", "Data non odierna/di ieri");
    const verifica = m.verifica;
    if (!verifica || verifica.stato !== "verificata" || !Array.isArray(verifica.dubbi) || verifica.dubbi.length) aggiungi(file, "G1", "Scheda verifica assente/incompleta o dubbi ancora aperti");
    if (NATURA_REVISIONE_UMANA.has(String(verifica?.natura || "").toLowerCase().trim()) || verifica?.natura === "report" && SENSIBILI.test(m.titolo || "")) aggiungi(file, "G3", "Indiscrezioni, interviste e recensioni: revisione umana obbligatoria");
    if (SENSIBILI.test(String(m.titolo || "") + " " + String(m.sommario || ""))) aggiungi(file, "G3", "Tema sensibile: controllo umano obbligatorio");
    if (!Array.isArray(m.fonti) || !m.fonti.length) aggiungi(file, "G2", "Nessuna fonte");
    else {
      const urls = m.fonti.map(f => { try { const u = new URL(f.url); return u.protocol === "https:" ? u : null; } catch { return null; } });
      if (urls.some(u => !u)) aggiungi(file, "G2", "Fonte non HTTPS o URL non valido");
      if (new Set(urls.filter(Boolean).map(u => u.hostname)).size < 2 && !Number(verifica?.fonti_primarie)) aggiungi(file, "G2", "Una sola origine senza fonte primaria dichiarata");
    }
    // Senza permessi di riutilizzo immagini chiari è ammesso il fallback di categoria.
    // Il gate controlla solo i metadati; non certifica la licenza del materiale.
    const immagine = String(m.immagine ?? "").trim();
    const riserva = String(m.immagine_riserva ?? "").trim();
    const alt = String(m.alt_immagine ?? "").trim();
    const crediti = String(m.crediti_immagine ?? "").trim();
    const https = value => { try { const u = new URL(value); return u.protocol === "https:" && Boolean(u.hostname); } catch { return false; } };
    if (immagine) {
      if (!https(immagine) || !alt || !crediti) aggiungi(file, "G6", "Immagine presente: URL HTTPS valido, alt e crediti richiesti");
      if (riserva && !https(riserva)) aggiungi(file, "G6", "Immagine di riserva non HTTPS o non valida");
    } else if (riserva || alt || crediti) {
      aggiungi(file, "G6", "Immagine assente: rimuovere alt, crediti e URL di riserva residui");
    }
    if (PENDENTI.test(source)) aggiungi(file, "G4", "Note o marcatori editoriali ancora presenti");
    if (HTML.test(parsed.content) || /\b(?:javascript|data):/i.test(parsed.content)) aggiungi(file, "G8", "HTML grezzo o protocollo potenzialmente non sicuro: sanitizer mancante, revisione manuale");
    const key = String(m.parola_chiave || "").toLocaleLowerCase("it").trim();
    if (key && keySet.has(key)) aggiungi(file, "G7", "Parola chiave duplicata nella PR");
    if (key) keySet.add(key);
  }
  if (articoli.length > 5 || traduzioni.length > 45) aggiungi("(PR)", "G9", "Limite di cinque articoli/45 traduzioni superato");
  if (!cambiamenti.length) aggiungi("(PR)", "S3", "Nessun file modificato");
  return { modalita: "DRY_RUN", autoMergeAbilitato: false, candidata: problemi.length === 0, articoli: articoli.length, traduzioni: traduzioni.length, problemi,
    avvertenza: "Gate meccanico: non verifica la veridicità delle fonti e NON autorizza alcun merge o pubblicazione." };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) { console.error("Uso: node strumenti/gate-pubblicazione.mjs <file-git-diff-name-status>"); process.exit(2); }
  const changes = leggiCambiamenti(fs.readFileSync(file, "utf8"));
  const result = valutaCambiamenti(changes, {
    leggi: rel => fs.readFileSync(path.join(ROOT, rel), "utf8"),
    esiste: rel => fs.existsSync(path.join(ROOT, rel)),
  });
  console.log(JSON.stringify(result, null, 2));
  // Deliberatamente 0 anche per contenuti non candidati: la fase di prova è diagnostica.
}
