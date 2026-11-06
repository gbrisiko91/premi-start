// Calendario delle uscite: nasconde i giochi già usciti, scrive "tra N giorni" e anima il conto alla rovescia.
(() => {
  const lingua = document.documentElement.lang || "it";
  const giorno = (iso) => { const [a, m, g] = iso.split("-").map(Number); return new Date(a, m - 1, g); };
  const oggi = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  let relativo;
  try { relativo = new Intl.RelativeTimeFormat(lingua, { numeric: "auto" }); } catch { relativo = null; }

  // Elenchi: "tra 13 giorni", via le uscite passate, al massimo N voci negli elenchi compatti
  const diff = (iso) => Math.round((giorno(iso) - oggi()) / 864e5);
  for (const voce of document.querySelectorAll("[data-uscita]")) {
    const d = diff(voce.dataset.uscita);
    if (d < 0) { voce.remove(); continue; }
    const testo = voce.querySelector("[data-mancano]");
    if (testo && relativo) testo.textContent = relativo.format(d, "day");
    if (d <= 7) voce.classList.add("uscita-vicina");
  }
  for (const gruppo of document.querySelectorAll("[data-mese]")) if (!gruppo.querySelector(".uscita")) gruppo.remove();
  for (const lista of document.querySelectorAll("[data-uscite-max]")) {
    [...lista.children].forEach((li, i) => { if (i >= Number(lista.dataset.usciteMax)) li.hidden = true; });
  }

  // Conto alla rovescia grande (fino alla mezzanotte locale del giorno di uscita)
  const unita = ["day", "hour", "minute", "second"];
  const formati = {};
  const formato = (u) => {
    if (!(u in formati)) {
      try { formati[u] = new Intl.NumberFormat(lingua, { style: "unit", unit: u, unitDisplay: "long" }); } catch { formati[u] = null; }
    }
    return formati[u];
  };
  for (const conto of document.querySelectorAll("[data-conto]")) {
    const arrivo = giorno(conto.dataset.conto).getTime();
    const celle = unita.map((u) => conto.querySelector(`[data-unita="${u}"]`));
    const aggiorna = () => {
      let resto = Math.max(0, Math.floor((arrivo - Date.now()) / 1000));
      if (resto === 0) {
        conto.classList.add("conto-finito");
        conto.querySelector("[data-conto-stato]").textContent = conto.dataset.uscito;
        clearInterval(timer);
      }
      const valori = [Math.floor(resto / 86400), Math.floor((resto % 86400) / 3600), Math.floor((resto % 3600) / 60), resto % 60];
      valori.forEach((v, i) => {
        const f = formato(unita[i]);
        const parti = f ? f.formatToParts(v) : [{ type: "integer", value: String(v) }];
        celle[i].querySelector("b").textContent = parti.filter((p) => p.type === "integer").map((p) => p.value).join("");
        celle[i].querySelector("small").textContent = parti.filter((p) => p.type === "unit").map((p) => p.value).join(" ");
      });
    };
    const timer = setInterval(aggiorna, 1000);
    aggiorna();
  }
})();
