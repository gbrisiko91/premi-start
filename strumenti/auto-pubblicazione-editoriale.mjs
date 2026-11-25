// Workflow privilegiato: eseguito SOLO dal main attendibile. Mai eseguire codice delle PR.
import fs from "node:fs";
import { valutaCambiamenti } from "./gate-pubblicazione.mjs";

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const apiBase = process.env.GITHUB_API_URL || "https://api.github.com";
if (!repository || !token) throw Error("Repository o token mancanti");
const [owner] = repository.split("/");
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const run = event.workflow_run;
const branchPattern = /^contenuti\/(\d{4}-\d{2}-\d{2})$/;

function summary(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, message + "\n\n");
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function api(method, endpoint, body) {
  const res = await fetch(apiBase + "/repos/" + repository + endpoint, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + token,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error("GitHub " + method + " " + endpoint.split("?")[0] + ": HTTP " + res.status + " " + (await res.text()).slice(0, 500));
  return res.status === 204 ? null : res.json();
}
export function isCandidateBranch(ref) { return branchPattern.test(String(ref || "")); }
export function isAllowedFile(item) {
  return item.status === "added" && item.changes <= 60000 &&
    item.filename.length <= 230 &&
    (/^content\/articoli\/[^/]+\.md$/.test(item.filename) ||
      /^content\/traduzioni\/(?:en|de|es|no|sv|fi|ja|ru)\/[^/]+\.md$/.test(item.filename));
}
export function readyChecks(checkRuns, statuses, prNumber) {
  for (const name of ["build", "gate-editoriale-dry-run"]) {
    if (!checkRuns.some(c => c.name === name && c.status === "completed" && c.conclusion === "success" && c.app?.slug === "github-actions")) return false;
  }
  return statuses.some(s => s.state === "success" &&
    /^netlify\/[^/]+\/deploy-preview$/.test(s.context) &&
    String(s.target_url || "").includes("deploy-preview-" + prNumber + "--"));
}
export function isCurrentPR(pr, {mainSha, runSha}) {
  return pr.state === "open" && !pr.draft && pr.base?.ref === "main" &&
    pr.base?.repo?.full_name === repository && pr.head?.repo?.full_name === repository &&
    isCandidateBranch(pr.head.ref) && pr.head.sha === runSha &&
    pr.base.sha === mainSha && pr.mergeable !== false;
}
function todayRome() {
  return new Intl.DateTimeFormat("en-CA", {timeZone: "Europe/Rome",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()).replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
}
function previousDay(day) {
  const d = new Date(day + "T12:00:00Z"); d.setUTCDate(d.getUTCDate()-1); return d.toISOString().slice(0, 10);
}
async function getFileAtSha(path, sha) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const data = await api("GET", "/contents/" + encoded + "?ref=" + sha);
  if (data.encoding !== "base64" || data.size > 60000) throw Error("File troppo grande/non testuale: " + path);
  return Buffer.from(data.content, "base64").toString("utf8");
}
async function checkPR(pr, triggerSha) {
  const now = todayRome();
  const date = pr.head.ref.match(branchPattern)?.[1];
  if (!date || ![now,previousDay(now)].includes(date)) return summary("PR #" + pr.number + ": data del ramo scaduta, controllo manuale.");
  const main = await api("GET", "/git/ref/heads/main");
  const mainSha = main.object.sha;
  const latest = await api("GET", "/pulls/" + pr.number);
  if (!isCurrentPR(latest, { mainSha, runSha: triggerSha })) return summary("PR #" + pr.number + ": main, SHA o stato variati; fermo senza merge.");
  const compare = await api("GET", "/compare/" + mainSha + "..." + triggerSha);
  if (compare.behind_by !== 0 || compare.ahead_by < 1 || compare.status !== "ahead")
    return summary("PR #" + pr.number + ": ramo non aggiornato con main; richiede nuova PR/CI.");
  const files = await api("GET", "/pulls/" + pr.number + "/files?per_page=100");
  if (!files.length || files.length > 50 || files.some(f => !isAllowedFile(f)) || !files.some(f=>/^content\/articoli\//.test(f.filename)))
    return summary("PR #" + pr.number + ": file fuori whitelist, modificati, troppo grandi o nessun articolo italiano. Merge manuale.");
  const src = {};
  for (const file of files) src[file.filename] = await getFileAtSha(file.filename, triggerSha);
  const tree = await api("GET", "/git/trees/" + mainSha + "?recursive=1");
  if (tree.truncated) throw Error("Albero main incompleto: blocco precauzionale.");
  const existing = new Set(tree.tree.map(f => f.path));
  const check = valutaCambiamenti(files.map(f=>({stato:"A",file:f.filename})), {
    leggi: p => src[p], esiste: p => existing.has(p), oggi: now,
  });
  if (!check.candidata) return summary("PR #" + pr.number + ": BLOCCATA dal gate indipendente:\n" +
    check.problemi.map(p=>"- " + p.controllo + " " + p.file + ": " + p.testo).join("\n"));
  // Il job privilegiato NON esegue/checkout il codice della PR; usa solo lo script già su main.
  let ready = false;
  for (let i=0;i<36;i++) {
    const [checks, statuses] = await Promise.all([
      api("GET", "/commits/" + triggerSha + "/check-runs?per_page=100"),
      api("GET", "/commits/" + triggerSha + "/status"),
    ]);
    if (readyChecks(checks.check_runs, statuses.statuses, pr.number)) { ready=true; break; }
    if (i<35) await sleep(10000);
  }
  if (!ready) return summary("PR #" + pr.number + ": manca build, gate o Deploy Preview verde sullo SHA corrente. Nessun merge.");
  const [main2, pr2] = await Promise.all([
    api("GET", "/git/ref/heads/main"),
    api("GET", "/pulls/" + pr.number),
  ]);
  if (!isCurrentPR(pr2, {mainSha:main2.object.sha,runSha:triggerSha}) || main2.object.sha !== mainSha)
    return summary("PR #" + pr.number + ": repository cambiato durante i controlli; nessun merge.");
  const merge = await api("PUT", "/pulls/" + pr.number + "/merge", {
    sha: triggerSha, merge_method: "merge",
    commit_title: "Auto-pubblicazione verificata: " + pr2.title,
  });
  if (!merge.merged) throw Error("GitHub non ha confermato il merge della PR #" + pr.number);
  summary("✅ PR #" + pr.number + " UNITA automaticamente — commit " + merge.sha + ". Verifica Netlify avviata.");
  // Il GITHUB_TOKEN non genera push workflow: dispatch esplicito del controllo produzione.
  await api("POST", "/actions/workflows/verifica-produzione.yml/dispatches", { ref:"main" });
}
if (run) {
  if (run.event !== "pull_request" || run.conclusion !== "success" || !isCandidateBranch(run.head_branch)) {
    summary("Evento non idoneo: nessuna operazione."); process.exit(0);
  }
  const candidates = await api("GET", "/pulls?state=open&head=" + encodeURIComponent(owner + ":" + run.head_branch) + "&per_page=30");
  for (const pr of candidates) await checkPR(pr, run.head_sha);
} else {
  summary("Avvio manuale/schedulato: controllo soltanto PR editoriali di oggi/ieri.");
  const candidates = await api("GET", "/pulls?state=open&per_page=100");
  for (const pr of candidates.filter(p=>isCandidateBranch(p.head?.ref) && p.head?.repo?.full_name===repository))
    await checkPR(pr, pr.head.sha);
}
