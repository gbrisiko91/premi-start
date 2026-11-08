// Compone la newsletter "Il Soffio della settimana" (testo e HTML) a partire dagli articoli pubblicati.
// Usato da strumenti/newsletter.mjs (a mano) e da netlify/functions/newsletter-domenica.mjs (invio automatico).
// Non legge file: riceve l'elenco degli articoli già pronto.
import config from "../sito.config.mjs";
import { USCITE, SONDAGGI, NEWSLETTER } from "../rubriche.mjs";

const url = (p) => config.url.replace(/\/$/, "") + p;
const elide = (prep, testo) => (/^(8|11)\b/.test(testo) ? `${prep}ll'${testo}` : `${prep}l ${testo}`);
const giorno = (d) => new Intl.DateTimeFormat("it-IT", { timeZone: "UTC", day: "numeric", month: "long" }).format(new Date(`${d}T00:00:00Z`));
const e = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const breve = (a) => (a.titolo_seo || a.titolo).split(/[:,]/)[0].trim();

export const oggiRoma = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());

// articoli: [{ titolo, titolo_seo, sommario, slug, giorno: "AAAA-MM-GG", viralita, bozza }]
// fine: ultimo giorno della settimana ("AAAA-MM-GG", di solito la domenica)
export function componi(articoli, fine = oggiRoma()) {
  const inizio = new Date(new Date(`${fine}T00:00:00Z`).getTime() - 6 * 864e5).toISOString().slice(0, 10);
  const notizie = articoli
    .filter((a) => a.bozza === false && a.giorno >= inizio && a.giorno <= fine)
    .sort((a, b) => (b.viralita || 0) - (a.viralita || 0))
    .slice(0, 5);
  if (!notizie.length) return null;

  const uscite = USCITE.filter((u) => u.data && u.data > fine).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);
  const sondaggio = SONDAGGI.filter((s) => s.dal <= fine).at(-1);
  const altre = notizie.length - 1;
  const oggetto = altre ? `${breve(notizie[0])} e le altre ${altre} notizie della settimana` : `${breve(notizie[0])}: la notizia della settimana`;
  const anteprima = [...new Set(notizie.slice(1, 4).map(breve))].join(", ") + (uscite.length ? " e cosa esce questa settimana" : "");
  const periodo = `${elide("da", giorno(inizio))} ${elide("a", giorno(fine))}`;
  const nomeBreve = NEWSLETTER.nome.replace(/^Il /, "");

  const blocchi = notizie.map((a, i) => `<tr><td style="padding:0 0 22px;"><p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#8b6cff;">${i + 1} / ${notizie.length}</p><h2 style="margin:0 0 8px;font-size:19px;line-height:1.3;color:#1c1838;">${e(a.titolo)}</h2><p style="margin:0 0 10px;font-size:15px;line-height:1.55;color:#4a4760;">${e(a.sommario)}</p><a href="${url(`/articoli/${a.slug}/`)}" style="font-size:15px;font-weight:bold;color:#ff3b4e;text-decoration:none;">Leggi la notizia →</a></td></tr>`).join("");
  const prossime = uscite.map((u) => `<li style="margin:0 0 6px;"><b>${e(u.gioco)}</b>: ${giorno(u.data)} <span style="color:#8a8799;">(${e(u.piattaforme.join(", "))})</span></li>`).join("");
  const html = `<div style="margin:0;padding:32px 16px;background:#f4f2fb;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px 28px;">
    <p style="margin:0 0 6px;font-size:13px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#8b6cff;">Soffia Cartuccia</p>
    <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2;color:#1c1838;">${e(NEWSLETTER.nome)}</h1>
    <p style="margin:0 0 26px;font-size:15px;line-height:1.6;color:#4a4760;">Ciao! Ecco ${notizie.length === 5 ? "le 5 notizie" : notizie.length === 1 ? "la notizia" : `le ${notizie.length} notizie`} gaming più importanti della settimana, ${periodo}.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${blocchi}</table>
    ${uscite.length ? `<div style="margin:6px 0 24px;padding:18px 20px;background:#f4f2fb;border-radius:12px;"><h2 style="margin:0 0 10px;font-size:17px;color:#1c1838;">In arrivo</h2><ul style="margin:0 0 10px;padding-left:18px;font-size:14px;line-height:1.5;color:#4a4760;">${prossime}</ul><a href="${url("/uscite/")}" style="font-size:14px;font-weight:bold;color:#ff3b4e;text-decoration:none;">Tutto il calendario delle uscite →</a></div>` : ""}
    ${sondaggio ? `<div style="text-align:center;padding:4px 0 6px;"><p style="margin:0 0 6px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#8b6cff;">Il sondaggio della settimana</p><p style="margin:0 0 16px;font-size:18px;font-weight:bold;color:#1c1838;">${e(sondaggio.testi.it[0])}</p><a href="${url("/sondaggio/")}" style="display:inline-block;background:#ff3b4e;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:12px 26px;border-radius:999px;">Vota sul sito</a></div>` : ""}
  </div>
  <p style="margin:20px auto 0;max-width:560px;text-align:center;font-size:12px;line-height:1.6;color:#8a8799;">Ricevi questa email perché ti sei iscritto al ${e(nomeBreve)} di Soffia Cartuccia.<br><a href="{{ unsubscribe }}" style="color:#8a8799;">Cancella l'iscrizione</a> · <a href="${config.url}" style="color:#8a8799;">soffiacartuccia.it</a></p>
</div>`;

  const testo = `# ${NEWSLETTER.nome}

Ciao! Ecco le notizie gaming più importanti della settimana, ${periodo}.

${notizie.map((a, i) => `## ${i + 1}. ${a.titolo}

${a.sommario}

[Leggi su ${config.nome}](${url(`/articoli/${a.slug}/`)})`).join("\n\n")}
${uscite.length ? `
## In arrivo

${uscite.map((u) => `- **${u.gioco}**: ${giorno(u.data)} (${u.piattaforme.join(", ")})`).join("\n")}

[Tutto il calendario delle uscite](${url("/uscite/")})
` : ""}${sondaggio ? `
## Il sondaggio della settimana

**${sondaggio.testi.it[0]}** [Vota sul sito](${url("/sondaggio/")})
` : ""}
---

Ricevi questa email perché ti sei iscritto al ${nomeBreve} di ${config.nome}. Per cancellarti usa il link qui sotto oppure rispondi a questa email.`;

  return { inizio, fine, notizie, oggetto, anteprima, html, testo };
}
