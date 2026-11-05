// Strumenti per le traduzioni degli articoli.
//
//   node strumenti/traduzioni.mjs ordine <file-uscita>
//       Crea un "ordine di traduzione": un unico file con tutti gli articoli italiani pubblicati
//       a cui manca almeno una traduzione (senza le note per la redazione).
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
  console.log("Uso: node strumenti/traduzioni.mjs ordine <file> | importa <pacchetto>...");
}
