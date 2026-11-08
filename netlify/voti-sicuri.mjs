// Registro dei voti indipendente per visitatore, compatibile con i conteggi legacy.
// I contatori storici (conti/<id>) restano immutati: i nuovi voti sono delta
// pseudonimi su chiavi distinte, evitando il read-modify-write concorrente.
// IMPORTANTE: scansione dei ballot a ogni lettura. A grande scala usare un DB
// transazionale per contatori e voti, non Netlify Blobs.
import { createHmac } from "node:crypto";

export function secretValid(secret) {
  return typeof secret === "string" && Buffer.byteLength(secret, "utf8") >= 32;
}
export function tokenVoter(secret, scope, id, ip) {
  if (!secretValid(secret)) throw new Error("VOTE_HASH_SECRET non configurato");
  return createHmac("sha256", secret).update(JSON.stringify(["soffiacartuccia-v2", scope, id, ip || "sconosciuto"])).digest("hex").slice(0, 40);
}
export const deltaLike = (previouslyLiked, desired) => Number(Boolean(desired)) - Number(Boolean(previouslyLiked));
export const effectiveLike = (previouslyLiked, savedDelta) =>
  savedDelta === null ? Boolean(previouslyLiked) : Boolean(Number(Boolean(previouslyLiked)) + Number(savedDelta));

export async function sumDeltas(store, prefix) {
  const { blobs } = await store.list({ prefix });
  let sum = 0;
  for (let i = 0; i < blobs.length; i += 40) {
    const batch = await Promise.all(blobs.slice(i, i + 40).map(b => store.get(b.key)));
    for (const value of batch) {
      const n = Number(value);
      if (value !== null && Number.isInteger(n) && n >= -1 && n <= 1) sum += n;
    }
  }
  return sum;
}
export async function countBallots(store, prefix, nChoices) {
  const counts = Array(nChoices).fill(0);
  const { blobs } = await store.list({ prefix });
  for (let i = 0; i < blobs.length; i += 40) {
    const batch = await Promise.all(blobs.slice(i, i + 40).map(b => store.get(b.key)));
    for (const v of batch) {
      if (v === null) continue;
      const n = Number(v);
      if (Number.isInteger(n) && n >= 0 && n < nChoices) counts[n]++;
    }
  }
  return counts;
}
