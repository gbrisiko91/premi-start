// Tasto "Mi piace": legge e aggiorna il contatore tramite /api/like.
(() => {
  const tasti = [...document.querySelectorAll("[data-like]")];
  if (!tasti.length) return;
  const id = tasti[0].dataset.like;
  const formato = new Intl.NumberFormat(document.documentElement.lang || "it", { notation: "compact" });
  let stato = { conto: null, piaciuto: false };
  let inCorso = false;

  function mostra() {
    for (const t of tasti) {
      t.setAttribute("aria-pressed", String(stato.piaciuto));
      t.querySelector(".like-testo").textContent = stato.piaciuto ? t.dataset.si : t.dataset.no;
      t.querySelector(".like-conto").textContent = stato.conto === null ? "" : formato.format(stato.conto);
    }
  }

  async function chiama(opzioni) {
    const risposta = await fetch(`/api/like${opzioni ? "" : `?id=${encodeURIComponent(id)}`}`, opzioni);
    if (!risposta.ok) throw new Error(String(risposta.status));
    return risposta.json();
  }

  function scoppio(tasto) {
    const p = document.createElement("span");
    p.className = "like-scoppio";
    p.textContent = "+1";
    p.setAttribute("aria-hidden", "true");
    tasto.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }

  async function clic(evento) {
    if (inCorso) return;
    inCorso = true;
    const tasto = evento.currentTarget;
    const prima = { ...stato };
    stato = { piaciuto: !prima.piaciuto, conto: prima.conto === null ? null : Math.max(0, prima.conto + (prima.piaciuto ? -1 : 1)) };
    mostra();
    if (stato.piaciuto) scoppio(tasto);
    try {
      stato = await chiama({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, azione: stato.piaciuto ? "like" : "unlike" }),
      });
    } catch {
      stato = prima;
      for (const t of tasti) t.classList.add("like-errore");
      setTimeout(() => tasti.forEach((t) => t.classList.remove("like-errore")), 1500);
    }
    mostra();
    inCorso = false;
  }

  tasti.forEach((t) => t.addEventListener("click", clic));
  chiama()
    .then((dati) => { stato = dati; mostra(); })
    .catch(() => { /* in anteprima locale la funzione non c'è: il tasto resta senza numero */ });
})();
