// Report di controllo editoriale: segnala verifiche da fare, NON stabilisce se una notizia è vera.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT=path.dirname(fileURLToPath(import.meta.url));
const ARTICOLI=path.join(ROOT,"..","content","articoli");
const COMMENTI= /<!--([\s\S]*?)-->/g;
const PENDING= /(?:NOTE PER LA REDAZIONE|DA COMPLETARE|DA VERIFICARE|TODO|FIXME|TBD)/i;
const CRITICAL= /(?:DA COMPLETARE|DA VERIFICARE|TODO|FIXME|TBD)/i;

export function analizzaArticolo(nome,sorgente) {
  const { data, content }=matter(sorgente);
  const note=[...content.matchAll(COMMENTI)].map(m=>m[1].trim());
  const daRivedere=note.filter(n=>PENDING.test(n));
  const fonti=Array.isArray(data.fonti)?data.fonti.filter(f=>f && typeof f.url==="string" && f.url.trim()):[];
  const flag=[];
  if (daRivedere.length) flag.push(CRITICAL.test(daRivedere.join(" "))?"note con verifiche esplicite da chiudere":"note interne da riesaminare");
  else if (note.length) flag.push("commenti HTML da controllare");
  if (!fonti.length) flag.push("nessuna fonte URL nei metadati: verificare eventuali fonti dirette o materiali originali");
  if (!data.immagine) flag.push("copertina non indicata: valutare materiale con diritti verificati");
  if (data.aggiornato && new Date(data.aggiornato).getTime()<new Date(data.data).getTime()) flag.push("data aggiornamento anteriore alla pubblicazione");
  return {
    file:nome,
    titolo:String(data.titolo||nome),
    data:data.data instanceof Date?data.data.toISOString().slice(0,10):String(data.data||""),
    bozza:data.bozza===true,
    fonti:fonti.length,
    notePendenti:daRivedere.length,
    priorita:daRivedere.length?2:flag.length?1:0,
    flag,
  };
}

export function analizzaCartella(cartella=ARTICOLI) {
  return fs.readdirSync(cartella).filter(f=>f.endsWith(".md"))
    .map(f=>analizzaArticolo(f,fs.readFileSync(path.join(cartella,f),"utf8")))
    .filter(x=>!x.bozza)
    .sort((a,b)=>b.priorita-a.priorita||b.data.localeCompare(a.data)||a.file.localeCompare(b.file));
}

const escapeTab=(v)=>String(v).replaceAll("|","\\|").replace(/\s+/g," ").trim();
export function inMarkdown(voci) {
  const critici=voci.filter(x=>x.notePendenti).length;
  const segnalati=voci.filter(x=>x.flag.length).length;
  const oggi=new Date().toISOString().slice(0,10);
  const rows=voci.filter(x=>x.flag.length).map(a=>`| ${escapeTab(a.data)} | ${escapeTab(a.file)} | ${a.fonti} | ${escapeTab(a.flag.join("; "))} |`).join("\n");
  return `# Report redazionale (generato il ${oggi})\n\n`+
    `**Articoli pubblicati esaminati:** ${voci.length}. **Con segnalazioni:** ${segnalati}. **Con note da riesaminare:** ${critici}.\n\n`+
    "Questo report fotografa il contenuto Markdown, non verifica l'esattezza dei fatti. Le fonti dirette possono essere valide anche senza URL; non cancellare note senza risolverle.\n\n"+
    "| Data | File | Fonti URL | Segnalazioni |\n|---|---|---:|---|\n"+
    (rows||"| — | Nessuna segnalazione | — | — |")+"\n";
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const voci=analizzaCartella();
  if (process.argv.includes("--json")) process.stdout.write(JSON.stringify(voci,null,2)+"\n");
  else process.stdout.write(inMarkdown(voci));
}
