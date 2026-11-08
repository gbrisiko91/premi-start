// Invio automatico della newsletter "Il Soffio della settimana", ogni domenica alle 9:00 UTC
// (le 10:00 in Italia con l'ora solare, le 11:00 con l'ora legale).
// Compone la newsletter con gli articoli pubblicati negli ultimi 7 giorni, la crea come campagna
// su Brevo e la spedisce alla lista della newsletter.
//
// Per attivarla servono:
//   - in sito.config.mjs: newsletter.invioAutomatico = true
//   - su Netlify la variabile BREVO_API_KEY, con una chiave che abbia anche il permesso "Campagne email"
// Per saltare una settimana senza toccare il codice: variabile Netlify NEWSLETTER_AUTOMATICA = "no".
// Si può far partire a mano da Netlify (Functions → newsletter-domenica → Run now): non spedisce mai due volte la stessa settimana.
import { getStore } from "@netlify/blobs";
import sito from "../../sito.config.mjs";
import ARTICOLI from "../dati/newsletter.mjs";
import { componi, oggiRoma } from "../../strumenti/newsletter-componi.mjs";

const API = "https://api.brevo.com/v3";

export default async () => {
  const nl = sito.newsletter || {};
  if (!nl.invioAutomatico) return console.log("Invio automatico disattivato in sito.config.mjs");
  if ((process.env.NEWSLETTER_AUTOMATICA || "").toLowerCase() === "no") return console.log("Invio saltato: NEWSLETTER_AUTOMATICA = no");
  const chiave = process.env.BREVO_API_KEY;
  const lista = Number(nl.brevo?.lista);
  if (!chiave || !lista) return console.error("Manca la chiave BREVO_API_KEY o il numero della lista");

  const fine = oggiRoma();
  const n = componi(ARTICOLI, fine);
  if (!n) return console.log(`Nessun articolo pubblicato nella settimana che finisce il ${fine}: newsletter non spedita`);

  const store = getStore({ name: "newsletter", consistency: "strong" });
  const giaFatta = await store.get(`inviata/${fine}`);
  if (giaFatta) return console.log(`Newsletter del ${fine} già spedita (${giaFatta}): niente da fare`);

  const brevo = async (percorso, corpo) => {
    const r = await fetch(`${API}${percorso}`, {
      method: "POST",
      headers: { "api-key": chiave, "content-type": "application/json", accept: "application/json" },
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: AbortSignal.timeout(12000),
    });
    const testo = await r.text().catch(() => "");
    if (!r.ok) throw new Error(`${percorso}: stato ${r.status} ${testo.slice(0, 300)}`);
    return testo ? JSON.parse(testo) : {};
  };

  try {
    const { id } = await brevo("/emailCampaigns", {
      name: `Soffio della settimana ${fine}`,
      subject: n.oggetto,
      previewText: n.anteprima,
      sender: { name: nl.nomeMittente || sito.nome, email: nl.mittente || "newsletter@soffiacartuccia.it" },
      htmlContent: n.html,
      recipients: { listIds: [lista] },
    });
    console.log(`Campagna creata su Brevo: ${id} ("${n.oggetto}", ${n.notizie.length} notizie)`);
    await brevo(`/emailCampaigns/${id}/sendNow`);
    await store.set(`inviata/${fine}`, `campagna ${id}`);
    console.log(`Newsletter del ${fine} spedita (campagna ${id})`);
  } catch (e) {
    console.error(`Newsletter del ${fine} NON spedita: ${e.message}`);
  }
};

export const config = { schedule: "0 9 * * 0" };
