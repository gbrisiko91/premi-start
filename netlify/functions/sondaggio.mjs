// Sondaggi: base storica immutata, nuovi voti come ballot separati.
// Le impronte nuove sono pseudonime HMAC e richiedono VOTE_HASH_SECRET su Netlify.
import { getStore, getDeployStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import { SONDAGGI } from "../../rubriche.mjs";
import { secretValid, tokenVoter, countBallots } from "../voti-sicuri.mjs";

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
const legacyHash = (ip, id) => createHash("sha256")
  .update(`soffia-cartuccia-sondaggio:${id}:${ip || "sconosciuto"}`).digest("hex").slice(0,32);
function inCorso(now = new Date()) {
  const day = new Intl.DateTimeFormat("en-CA",{ timeZone:"Europe/Rome" }).format(now);
  return SONDAGGI.filter(s => s.dal <= day).at(-1)?.id;
}
export default async (req, context) => {
  let id, scelta;
  if (req.method === "GET") id = new URL(req.url).searchParams.get("id");
  else if (req.method === "POST") {
    try { ({ id, scelta } = await req.json()); }
    catch { return json({ errore: "Richiesta non valida" }, 400); }
  } else return json({ errore: "Metodo non consentito" }, 405);

  const poll = SONDAGGI.find(s => s.id === id);
  if (!poll) return json({ errore: "Sondaggio sconosciuto" }, 404);
  const n = poll.testi.it[1].length;
  if (req.method === "POST" && (!Number.isInteger(scelta) || scelta < 0 || scelta >= n))
    return json({ errore: "Risposta non valida" }, 400);
  const store = process.env.CONTEXT === "production"
    ? getStore({ name: "sondaggi", consistency: "strong" })
    : getDeployStore({ name: "sondaggi", consistency: "strong" });
  try {
    const legacy = await store.get(`voti/${id}/${legacyHash(context.ip,id)}`);
    const oldChoice = legacy === null ? null : Number(legacy);
    const base = (await store.get(`conti/${id}`, {type:"json"})) || [];
    const conti = Array.from({length:n}, (_,i)=>Math.max(0,Number(base[i])||0));
    const secret = process.env.VOTE_HASH_SECRET;
    if (!secretValid(secret)) {
      if (req.method === "POST") return json({errore:"Sondaggio temporaneamente non disponibile"},503);
      return json({conti,scelta:oldChoice});
    }
    const prefix = `v2/${id}/`;
    const key = prefix + tokenVoter(secret,"poll",id,context.ip);
    let newer = await store.get(key);
    if (req.method === "POST") {
      if (id !== inCorso()) return json({errore:"Sondaggio chiuso",conti,scelta:oldChoice ?? (newer===null ? null : Number(newer))},409);
      if (legacy === null && newer === null) {
        // Create-only garantisce un solo ballot per visitatore anche con POST concorrenti.
        await store.set(key,String(scelta),{onlyIfNew:true});
        newer = await store.get(key);
      }
    }
    const extra = await countBallots(store,prefix,n);
    extra.forEach((v,i)=>{conti[i]+=v;});
    return json({conti,scelta:oldChoice ?? (newer===null ? null : Number(newer))});
  } catch (err) {
    console.error("Errore archivio sondaggio",err?.message);
    return json({errore:"Sondaggio non disponibile"},503);
  }
};
export const config = { path: "/api/sondaggio" };
