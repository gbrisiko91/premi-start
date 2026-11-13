// Mi piace: lettura compatibile con la base storica, scritture su ballot
// indipendenti firmati. Richiede VOTE_HASH_SECRET (>=32 byte) su Netlify.
// Senza segreto: letture legacy possibili, scritture disabilitate (503).
import { getStore, getDeployStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import articoli from "../dati/articoli.mjs";
import { secretValid, tokenVoter, deltaLike, effectiveLike, sumDeltas } from "../voti-sicuri.mjs";

const valido = new Set(articoli);
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
const legacyHash = (ip, id) => createHash("sha256")
  .update(`premi-start:${id}:${ip || "sconosciuto"}`).digest("hex").slice(0,32);
const legacyTotal = async (store, id) =>
  Math.max(0, Number((await store.get(`conti/${id}`, { type: "json" }))?.conto) || 0);

export default async (req, context) => {
  let id, azione;
  if (req.method === "GET") id = new URL(req.url).searchParams.get("id");
  else if (req.method === "POST") {
    try { ({ id, azione } = await req.json()); }
    catch { return json({ errore: "Richiesta non valida" }, 400); }
  } else return json({ errore: "Metodo non consentito" }, 405);
  if (typeof id !== "string" || !valido.has(id)) return json({ errore: "Articolo sconosciuto" }, 404);
  if (req.method === "POST" && azione !== "like" && azione !== "unlike") return json({ errore: "Azione non valida" }, 400);
  const store = process.env.CONTEXT === "production"
    ? getStore({ name: "mi-piace", consistency: "strong" })
    : getDeployStore({ name: "mi-piace", consistency: "strong" });
  try {
    const legacyKey = `voti/${id}/${legacyHash(context.ip, id)}`;
    const previouslyLiked = (await store.get(legacyKey)) !== null;
    const baseline = await legacyTotal(store, id);
    const secret = process.env.VOTE_HASH_SECRET;
    if (!secretValid(secret)) {
      if (req.method === "POST") return json({ errore: "Sistema voti in manutenzione" }, 503);
      return json({ conto: baseline, piaciuto: previouslyLiked });
    }
    const key = `v2/${id}/${tokenVoter(secret, "like", id, context.ip)}`;
    const prefix = `v2/${id}/`;
    const saved = await store.get(key);
    let piaciuto = effectiveLike(previouslyLiked, saved);
    if (req.method === "POST") {
      const desired = azione === "like";
      // Salviamo sempre uno stato per visitatore, mai un contatore condiviso.
      // Ogni stato rappresenta il delta rispetto al voto storico originale.
      await store.set(key, String(deltaLike(previouslyLiked, desired)));
      piaciuto = desired;
    }
    const conto = Math.max(0, baseline + await sumDeltas(store, prefix));
    return json({ conto, piaciuto });
  } catch (err) {
    console.error("Errore archivio like", err?.message);
    return json({ errore: "Sistema voti non disponibile" }, 503);
  }
};
export const config = { path: "/api/like" };
