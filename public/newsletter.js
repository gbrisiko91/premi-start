// Newsletter: invia l'iscrizione al servizio esterno (Brevo) senza lasciare il sito,
// poi apre la nostra pagina di ringraziamento. Se l'invio in background non riesce, usa il modulo classico.
(() => {
  for (const form of document.querySelectorAll("[data-newsletter-esterna]")) {
    form.addEventListener("submit", async (e) => {
      if (!form.checkValidity()) return;
      e.preventDefault();
      const bottone = form.querySelector("button");
      bottone.disabled = true;
      const dati = new URLSearchParams();
      for (const [k, v] of new FormData(form)) dati.append(k, v);
      try {
        await fetch(form.action, { method: "POST", mode: "no-cors", body: dati });
        location.href = form.dataset.grazie;
      } catch {
        bottone.disabled = false;
        form.submit();
      }
    });
  }
})();
