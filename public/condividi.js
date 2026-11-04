// Condivisione: tasto nativo del telefono (se disponibile) e "Copia link".
(() => {
  const box = document.querySelector(".condividi");
  if (!box) return;
  const url = box.dataset.url;
  const titolo = box.dataset.titolo;

  const nativo = box.querySelector(".nativo");
  const scorciatoia = document.querySelector(".tasto-vai-condividi");
  if (navigator.share) {
    nativo.hidden = false;
    const condividi = (e) => {
      e.preventDefault();
      navigator.share({ title: titolo, url }).catch(() => {});
    };
    nativo.addEventListener("click", condividi);
    if (scorciatoia) scorciatoia.addEventListener("click", condividi);
  }

  const copia = box.querySelector(".copia");
  const etichetta = copia.querySelector(".copia-testo");
  copia.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const campo = document.createElement("textarea");
      campo.value = url;
      campo.setAttribute("readonly", "");
      campo.style.position = "absolute";
      campo.style.left = "-9999px";
      document.body.appendChild(campo);
      campo.select();
      try { document.execCommand("copy"); } catch { /* niente */ }
      campo.remove();
    }
    copia.classList.add("copiato");
    etichetta.textContent = "Link copiato";
    setTimeout(() => { copia.classList.remove("copiato"); etichetta.textContent = "Copia link"; }, 2000);
  });
})();
