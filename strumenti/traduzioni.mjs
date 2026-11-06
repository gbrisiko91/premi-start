// Strumenti per le traduzioni degli articoli.
//
//   node strumenti/traduzioni.mjs ordine <file-uscita>
//       Crea un "ordine di traduzione": un unico file con tutti gli articoli italiani pubblicati
//       a cui manca almeno una traduzione (senza le note per la redazione).
//
//   node strumenti/traduzioni.mjs mancanti
//       Elenca, lingua per lingua, gli articoli italiani pubblicati che non hanno ancora la traduzione.
//
//   node strumenti/traduzioni.mjs istruzioni <lingua> <cartella-di-lavoro>
//       Stampa le istruzioni complete per un assistente traduttore, con l'elenco degli articoli
//       mancanti in quella lingua (usato ogni mattina dalla sincronizzazione).
//
//   node strumenti/traduzioni.mjs importa <file-pacchetto> [<file-pacchetto> ...]
//       Divide un pacchetto di traduzioni e salva ogni articolo in content/traduzioni/<lingua>/<file>.
//
// Formato del pacchetto (scritto da chi traduce):
//   <<<LINGUA: en>>>
//   <<<FILE: 2026-11-05-nome-articolo.md>>>
//   ---
//   titolo: "..."
//   ...
//   ---
//   Testo tradotto...
//   <<<FILE: ...>>>
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LINGUE, PRINCIPALE } from "../lingue.mjs";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const ARTICOLI = path.join(ROOT, "content", "articoli");
const TRADUZIONI = path.join(ROOT, "content", "traduzioni");
const ALTRE = Object.keys(LINGUE).filter((l) => l !== PRINCIPALE);
const [comando, ...argomenti] = process.argv.slice(2);

const DETTAGLI = {
  en: { nome: "English (British spelling is fine)", faq: "Frequently Asked Questions" },
  de: { nome: "German", faq: "Häufig gestellte Fragen" },
  es: { nome: "Spanish (Spain)", faq: "Preguntas frecuentes" },
  no: { nome: "Norwegian Bokmål", faq: "Ofte stilte spørsmål" },
  sv: { nome: "Swedish", faq: "Vanliga frågor" },
  fi: { nome: "Finnish", faq: "Usein kysytyt kysymykset" },
  ja: { nome: "Japanese", faq: "よくある質問", sommario: " (for Japanese: 60-90 characters)", slug: "keywords in English",
        nomi: " (keep game and company names in Latin script, as Japanese gaming press usually does; Japanese creators may use their usual Japanese names, e.g. 宮崎英高)" },
  ru: { nome: "Russian", faq: "Часто задаваемые вопросы", slug: "keywords transliterated to Latin letters or in English" },
};

function mancanti() {
  const per = Object.fromEntries(ALTRE.map((l) => [l, []]));
  for (const file of fs.readdirSync(ARTICOLI).filter((f) => f.endsWith(".md")).sort()) {
    if (matter(fs.readFileSync(path.join(ARTICOLI, file), "utf8")).data.bozza === true) continue;
    for (const l of ALTRE) if (!fs.existsSync(path.join(TRADUZIONI, l, file))) per[l].push(file);
  }
  return per;
}

function istruzioni(l, cartella, files) {
  const d = DETTAGLI[l];
  return `You are translating Italian video game news articles into ${d.nome} (language code: ${l}) for the site "Soffia Cartuccia". Repository on disk: ${ROOT}. Do NOT git commit or push; the coordinator will. Scratch folder: ${cartella} (create it). Other helpers are translating other languages in parallel; only create the files listed below.

Translate these Italian articles (source files in ${ARTICOLI}/):
${files.map((f) => "- " + f).join("\n")}

Output format for each article (front matter fields ONLY these):
\`\`\`
---
titolo: "..."            # translated headline, natural news style in the target language
titolo_seo: "..."        # max 60 characters, main search keyword first
sommario: "..."          # 140-155 characters${d.sommario || ""} (meta description)
slug: "..."              # URL slug: lowercase Latin letters, digits and hyphens only, ${d.slug || "keywords in the target language without accents (or English keywords)"}, e.g. "god-of-war-laufey-delay"; must be unique (check existing slugs with: grep -h '^slug:' ${TRADUZIONI}/${l}/*.md)
alt_immagine: "..."      # only if the Italian original has a non-empty \`immagine\`
crediti_immagine: "..."  # only if the Italian original has a non-empty \`immagine\`
---
<translated Markdown body>
\`\`\`
Rules:
- Translate faithfully and fluently for readers in that language; do not add or remove facts. Keep names of games, studios and people as in the original${d.nomi || ""}.
- Keep all Markdown structure: headings, lists, bold, italics. Translate the "Domande frequenti" heading as "${d.faq}" and translate its questions/answers.
- Keep every link URL exactly unchanged (internal links like /articoli/... stay as they are; the site rewrites them per language). Translate only the link text.
- Raw HTML blocks (<figure>, <video>, <img>) must stay exactly as they are; translate only alt, aria-label and figcaption texts inside them.
- Remove any \`<!-- NOTE PER LA REDAZIONE ... -->\` comment completely.
- YAML: wrap values in double quotes and escape any double quote inside a value as \\" (or use typographic quotes instead).
- Amounts and dates: adapt formats naturally, but never change the numbers.

Put all ${files.length} translations in ONE bundle file <scratch>/bundle.md that starts with the line \`<<<LINGUA: ${l}>>>\` and has a line \`<<<FILE: same-italian-file-name.md>>>\` before each article. Then run \`cd ${ROOT} && node strumenti/traduzioni.mjs importa <scratch>/bundle.md\`. If it prints a warning for a file, fix that article in your bundle and re-run. Finally check that all ${files.length} files exist in ${TRADUZIONI}/${l}/ and reply with a one-paragraph report (files imported, any problem).`;
}

if (comando === "ordine") {
  const uscita = argomenti[0];
  if (!uscita) throw new Error("Indica il file di uscita");
  const pezzi = [];
  for (const file of fs.readdirSync(ARTICOLI).filter((f) => f.endsWith(".md")).sort()) {
    const grezzo = fs.readFileSync(path.join(ARTICOLI, file), "utf8");
    const { data } = matter(grezzo);
    if (data.bozza === true) continue;
    const mancanti = ALTRE.filter((l) => !fs.existsSync(path.join(TRADUZIONI, l, file)));
    if (!mancanti.length) continue;
    pezzi.push(`<<<FILE: ${file}>>>\n${grezzo.replace(/<!--[\s\S]*?-->/g, "").trim()}\n`);
  }
  if (!pezzi.length) { console.log("Nessun articolo da tradurre."); process.exit(0); }
  fs.writeFileSync(uscita, `# Ordine di traduzione: ${pezzi.length} articoli\n\n${pezzi.join("\n")}`);
  console.log(`Ordine creato: ${pezzi.length} articoli → ${uscita}`);
} else if (comando === "mancanti") {
  const per = mancanti();
  let totale = 0;
  for (const [l, files] of Object.entries(per)) { totale += files.length; if (files.length) console.log(`${l}: ${files.join(" ")}`); }
  if (!totale) console.log("Tutte le traduzioni sono presenti.");
} else if (comando === "istruzioni") {
  const [l, cartella] = argomenti;
  if (!DETTAGLI[l] || !cartella) throw new Error("Uso: istruzioni <lingua> <cartella-di-lavoro>");
  const files = mancanti()[l];
  if (!files.length) { console.log(`Nessun articolo da tradurre in ${l}.`); process.exit(0); }
  console.log(istruzioni(l, path.resolve(cartella), files));
} else if (comando === "importa") {
  let totale = 0;
  for (const pacchetto of argomenti) {
    const testo = fs.readFileSync(pacchetto, "utf8");
    const lingua = testo.match(/<<<LINGUA:\s*([a-z]{2})\s*>>>/)?.[1];
    if (!lingua || !ALTRE.includes(lingua)) { console.error(`${pacchetto}: lingua mancante o non valida`); process.exitCode = 1; continue; }
    const blocchi = testo.split(/^<<<FILE:\s*(.+?\.md)\s*>>>\s*$/m).slice(1);
    for (let i = 0; i < blocchi.length; i += 2) {
      const file = path.basename(blocchi[i].trim());
      const contenuto = blocchi[i + 1].trim() + "\n";
      if (!fs.existsSync(path.join(ARTICOLI, file))) { console.warn(`  ${lingua}/${file}: manca l'originale italiano, saltato`); continue; }
      try {
        const { data, content } = matter(contenuto);
        if (!data.titolo || !content.trim()) throw new Error("titolo o testo mancante");
      } catch (e) { console.warn(`  ${lingua}/${file}: intestazione non valida (${e.message}), saltato`); process.exitCode = 1; continue; }
      fs.mkdirSync(path.join(TRADUZIONI, lingua), { recursive: true });
      fs.writeFileSync(path.join(TRADUZIONI, lingua, file), contenuto);
      totale++;
    }
  }
  console.log(`Traduzioni importate: ${totale}`);
} else {
  console.log("Uso: node strumenti/traduzioni.mjs ordine <file> | mancanti | istruzioni <lingua> <cartella> | importa <pacchetto>...");
}
