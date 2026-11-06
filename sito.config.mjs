// Impostazioni del sito: cambia qui nome, indirizzo e categorie.
export default {
  nome: "Soffia Cartuccia",
  motto: "Le notizie di videogiochi di cui si parla oggi",
  // Indirizzo definitivo del sito (serve per RSS e sitemap). Cambialo quando hai il dominio.
  url: "https://soffiacartuccia.it",
  lingua: "it",
  // Per la pagina privacy: nome e cognome (o ragione sociale) di chi gestisce il sito, e un'email di contatto.
  titolare: "Gianmarco Buono",
  emailContatto: "redazione@soffiacartuccia.it",
  privacyAggiornata: "2026-11-06",
  // Newsletter "Il Soffio della settimana".
  // Se "azione" è vuoto, le iscrizioni arrivano nel pannello di Netlify (Forms → newsletter).
  // Se usi un servizio di newsletter (es. Brevo), incolla qui l'indirizzo del suo modulo di iscrizione
  // e il nome del campo email che richiede, e scrivi il nome del servizio in "fornitore" (finisce nella privacy).
  newsletter: { azione: "", campo: "email", fornitore: "" },
  // Codice di verifica di Google Search Console (solo se scegli il metodo "tag HTML"), es. "abc123..."
  googleVerifica: "",
  articoliPerPagina: 12,
  categorie: {
    console: { nome: "Console", colore: "rosso", descrizione: "PlayStation, Xbox, Nintendo e tutto ciò che si collega alla TV." },
    pc: { nome: "PC", colore: "blu", descrizione: "Uscite, hardware e aggiornamenti dal mondo PC." },
    retro: { nome: "Retro", colore: "giallo", descrizione: "Remake, collezionismo, console d'epoca e giochi che non invecchiano." },
    industria: { nome: "Industria", colore: "verde", descrizione: "Studi, acquisizioni, vendite e le persone dietro ai giochi." }
  }
};
