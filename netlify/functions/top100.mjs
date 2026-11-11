// Voto per la top 100 dei videogiochi della community (Missione 2K), salvato in Netlify Blobs.
//   GET  /api/top100?votante=ID            → { stato, mie, votanti }
//   POST /api/top100 { votante, scelte, proposta } → { stato, mie, votanti }
//   GET  /api/top100?chiave=SEGRETO        → classifica completa e proposte (solo con la variabile TOP100_CHIAVE)
// Ogni persona è riconosciuta da un codice casuale salvato nel suo browser: può cambiare il voto finché il
// voto è aperto. Per limitare i furbi, da una stessa connessione si accettano al massimo
// TOP100.maxPerConnessione votanti diversi (non uno solo: in casa e sulle reti mobili molti condividono l'IP).
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
import { TOP100, statoVoto, pulisciVoto, contaVoti } from "../../top100.mjs";

const impronta = (ip) => createHash("sha256").update(`soffia-cartuccia-top100:${ip || "sconosciuto"}`).digest("hex").slice(0, 32);
const votanteValido = (v) => typeof v === "string" && /^[a-z0-9]{16,40}$/.test(v);


const json = (dati, stato = 200) =>
  new Response(JSON.stringify(dati), {
    status: stato,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

async function tuttiIVoti(store) {
  const { blobs } = await store.list({ prefix: "voti/" });
  const voti = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
  return voti.filter(Boolean);
}

export default async (req, context) => {
  const store = getStore({ name: "top100", consistency: "strong" });
  const url = new URL(req.url);
  const stato = statoVoto();

  if (req.method === "GET") {
    const chiave = url.searchParams.get("chiave");
    if (chiave !== null) {
      const segreto = process.env.TOP100_CHIAVE;
      if (!segreto || chiave !== segreto) return json({ errore: "Chiave non valida" }, 403);
      return json({ stato, apertura: TOP100.apertura, chiusura: TOP100.chiusura, ...contaVoti(await tuttiIVoti(store)) });
    }
    const votante = url.searchParams.get("votante");
    const mio = votanteValido(votante) ? await store.get(`voti/${votante}`, { type: "json" }) : null;
    const { blobs } = await store.list({ prefix: "voti/" });
    return json({ stato, mie: mio, votanti: blobs.length });
  }

  if (req.method !== "POST") return json({ errore: "Metodo non consentito" }, 405);
  if (stato !== "aperto") return json({ errore: stato === "prima" ? "Il voto non è ancora aperto" : "Il voto è chiuso", stato }, 409);
  let corpo;
  try { corpo = await req.json(); } catch { return json({ errore: "Richiesta non valida" }, 400); }
  if (!votanteValido(corpo?.votante)) return json({ errore: "Richiesta non valida" }, 400);
  const voto = pulisciVoto(corpo);
  if (!voto) return json({ errore: `Scegli da 1 a ${TOP100.maxScelte} giochi dell'elenco` }, 400);

  const chiaveVoto = `voti/${corpo.votante}`;
  const esistente = await store.get(chiaveVoto);
  if (esistente === null) {
    const chiaveIp = `connessioni/${impronta(context.ip)}`;
    const elenco = (await store.get(chiaveIp, { type: "json" })) || [];
    if (!elenco.includes(corpo.votante)) {
      if (elenco.length >= TOP100.maxPerConnessione) return json({ errore: "Troppi voti da questa connessione" }, 429);
      await store.setJSON(chiaveIp, [...elenco, corpo.votante]);
    }
  }
  await store.setJSON(chiaveVoto, { ...voto, ora: new Date().toISOString() });
  const { blobs } = await store.list({ prefix: "voti/" });
  return json({ stato, mie: voto, votanti: blobs.length });
};

export const config = { path: "/api/top100" };
