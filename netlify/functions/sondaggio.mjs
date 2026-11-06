// Voti del sondaggio della settimana, salvati in Netlify Blobs.
//   GET  /api/sondaggio?id=gta-6-day-one     → { conti: [..], scelta: indice | null }
//   POST /api/sondaggio { "id": "...", "scelta": 0 }  → { conti: [..], scelta }
// Ogni visitatore (riconosciuto da un'impronta anonima del suo indirizzo IP) vota una volta sola per sondaggio.
// Si vota solo nel sondaggio in corso; i risultati dei precedenti restano consultabili.
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import { SONDAGGI } from "../../rubriche.mjs";

const json = (dati, stato = 200) =>
  new Response(JSON.stringify(dati), {
    status: stato,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const impronta = (ip, id) =>
  createHash("sha256").update(`soffia-cartuccia-sondaggio:${id}:${ip || "sconosciuto"}`).digest("hex").slice(0, 32);

// Il sondaggio in corso è l'ultimo già iniziato (ora italiana).
function inCorso(adesso = new Date()) {
  const oggi = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(adesso);
  return SONDAGGI.filter((s) => s.dal <= oggi).at(-1)?.id;
}

export default async (req, context) => {
  const store = getStore({ name: "sondaggi", consistency: "strong" });
  let id, scelta;
  if (req.method === "GET") {
    id = new URL(req.url).searchParams.get("id");
  } else if (req.method === "POST") {
    try {
      ({ id, scelta } = await req.json());
    } catch {
      return json({ errore: "Richiesta non valida" }, 400);
    }
  } else {
    return json({ errore: "Metodo non consentito" }, 405);
  }

  const sondaggio = SONDAGGI.find((s) => s.id === id);
  if (!sondaggio) return json({ errore: "Sondaggio sconosciuto" }, 404);
  const nOpzioni = sondaggio.testi.it[1].length;
  const chiaveVoto = `voti/${id}/${impronta(context.ip, id)}`;
  const giaVotato = await store.get(chiaveVoto);
  const letti = (await store.get(`conti/${id}`, { type: "json" })) || [];
  const conti = Array.from({ length: nOpzioni }, (_, i) => Math.max(0, Number(letti[i]) || 0));

  if (req.method === "POST") {
    if (id !== inCorso()) return json({ errore: "Sondaggio chiuso", conti, scelta: giaVotato === null ? null : Number(giaVotato) }, 409);
    if (!Number.isInteger(scelta) || scelta < 0 || scelta >= nOpzioni) return json({ errore: "Risposta non valida" }, 400);
    if (giaVotato === null) {
      await store.set(chiaveVoto, String(scelta));
      conti[scelta] += 1;
      await store.setJSON(`conti/${id}`, conti);
      return json({ conti, scelta });
    }
  }
  return json({ conti, scelta: giaVotato === null ? null : Number(giaVotato) });
};

export const config = { path: "/api/sondaggio" };
