// Newsletter: invia l'iscrizione al servizio esterno (Brevo) senza lasciare il sito,
// poi apre la nostra pagina di ringraziamento. Se l'invio non riesce, il visitatore resta
// sulla pagina e vede un messaggio di errore (niente pagine di errore del browser).
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
        await fetch(form.action, { method: "POST", mode: "no-cors", body: dati });
        location.href = form.dataset.grazie;
      } catch {
        bottone.disabled = false;
        stato.textContent = form.dataset.errore;
      }
    });
  }
})();
