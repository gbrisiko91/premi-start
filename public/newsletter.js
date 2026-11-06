// Newsletter: invia l'iscrizione alla nostra funzione /api/newsletter (che la passa a Brevo),
// poi apre la pagina di ringraziamento. Se qualcosa va storto, resta sulla pagina con un messaggio.
(() => {
  for (const form of document.querySelectorAll("[data-newsletter-esterna]")) {
    const stato = document.createElement("p");
    stato.className = "newsletter-stato";
    stato.setAttribute("role", "status");
    stato.setAttribute("aria-live", "polite");
    form.appendChild(stato);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const bottone = form.querySelector("button");
      bottone.disabled = true;
      stato.textContent = "";
      const dati = new URLSearchParams();
      for (const [k, v] of new FormData(form)) dati.append(k, v);
      try {
        const r = await fetch(form.action, { method: "POST", body: dati, headers: { accept: "application/json" } });
        const esito = await r.json().catch(() => ({}));
        if (!r.ok || !esito.ok) throw new Error(esito.errore || String(r.status));
        location.href = form.dataset.grazie;
      } catch {
        bottone.disabled = false;
        stato.textContent = form.dataset.errore;
      }
    });
  }
})();
