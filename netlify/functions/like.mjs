// Contatore dei "Mi piace" degli articoli, salvato in Netlify Blobs.
//   GET  /api/like?id=slug-articolo                 → { conto, piaciuto }
//   POST /api/like  { "id": "slug", "azione": "like" | "unlike" }  → { conto, piaciuto }
// Ogni visitatore (riconosciuto da un'impronta anonima del suo indirizzo IP) conta una volta sola per articolo.
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import articoli from "../dati/articoli.mjs";

const valido = new Set(articoli);
const json = (dati, stato = 200) =>
  new Response(JSON.stringify(dati), {
    status: stato,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const impronta = (ip, id) =>
  createHash("sha256").update(`premi-start:${id}:${ip || "sconosciuto"}`).digest("hex").slice(0, 32);

async function leggiConto(store, id) {
  const dati = await store.get(`conti/${id}`, { type: "json" });
  return Math.max(0, Number(dati?.conto) || 0);
}

export default async (req, context) => {
  const store = getStore({ name: "mi-piace", consistency: "strong" });

  let id, azione;
  if (req.method === "GET") {
    id = new URL(req.url).searchParams.get("id");
  } else if (req.method === "POST") {
    try {
      ({ id, azione } = await req.json());
    } catch {
      return json({ errore: "Richiesta non valida" }, 400);
    }
  } else {
    return json({ errore: "Metodo non consentito" }, 405);
  }

  if (typeof id !== "string" || !valido.has(id)) return json({ errore: "Articolo sconosciuto" }, 404);

  const chiaveVoto = `voti/${id}/${impronta(context.ip, id)}`;
  const giaVotato = (await store.get(chiaveVoto)) !== null;
  let conto = await leggiConto(store, id);

  if (req.method === "POST") {
    if (azione === "like" && !giaVotato) {
      await store.set(chiaveVoto, "1");
      conto += 1;
      await store.setJSON(`conti/${id}`, { conto });
      return json({ conto, piaciuto: true });
    }
    if (azione === "unlike" && giaVotato) {
      await store.delete(chiaveVoto);
      conto = Math.max(0, conto - 1);
      await store.setJSON(`conti/${id}`, { conto });
      return json({ conto, piaciuto: false });
    }
    if (azione !== "like" && azione !== "unlike") return json({ errore: "Azione non valida" }, 400);
  }

  return json({ conto, piaciuto: giaVotato });
};

export const config = { path: "/api/like" };
