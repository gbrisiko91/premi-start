// Sondaggio della settimana: sceglie la domanda in corso, invia il voto a /api/sondaggio e mostra i risultati.
(() => {
  const fonte = document.querySelector("[data-sondaggi-dati]");
  const form = document.querySelector("[data-sondaggio]");
  if (!fonte || !form) return;
  const D = JSON.parse(fonte.textContent);
  const regole = new Intl.PluralRules(D.lingua);
  const perc = new Intl.NumberFormat(D.lingua, { style: "percent", maximumFractionDigits: 0 });
  const numero = new Intl.NumberFormat(D.lingua);
  const testoVoti = (n) => (D.voti[regole.select(n)] || D.voti.other).replace("{n}", numero.format(n));
  const memoria = {
    leggi(id) { try { const v = localStorage.getItem(`sondaggio:${id}`); return v === null ? null : Number(v); } catch { return null; } },
    scrivi(id, v) { try { localStorage.setItem(`sondaggio:${id}`, String(v)); } catch { /* memoria non disponibile */ } },
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const d = new Date();
  const oggi = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const iniziati = D.lista.filter((s) => s.dal <= oggi);
  const corrente = iniziati.at(-1) || D.lista[0];

  async function chiama(id, scelta) {
    const opzioni = scelta === undefined ? undefined : { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, scelta }) };
    const r = await fetch(scelta === undefined ? `/api/sondaggio?id=${encodeURIComponent(id)}` : "/api/sondaggio", opzioni);
    const dati = await r.json().catch(() => ({}));
    if (!r.ok && !Array.isArray(dati.conti)) throw new Error(String(r.status));
    return dati;
  }

  function risultati(s, conti, mia) {
    const totale = conti.reduce((a, b) => a + b, 0);
    const max = Math.max(...conti);
    return `<ul class="sondaggio-risultati">${s.opzioni.map((o, i) => {
      const quota = totale ? conti[i] / totale : 0;
      return `<li class="risultato${i === mia ? " risultato-mio" : ""}${conti[i] === max && totale ? " risultato-top" : ""}" style="--p:${(quota * 100).toFixed(1)}%"><span class="risultato-testo">${esc(o)}${i === mia ? " ✓" : ""}</span><span class="risultato-perc">${perc.format(quota)}</span></li>`;
    }).join("")}</ul><p class="sondaggio-totale">${esc(testoVoti(totale))}</p>`;
  }

  // Se la domanda è cambiata dopo la pubblicazione della pagina, aggiorna il modulo
  if (form.dataset.id !== corrente.id) {
    form.dataset.id = corrente.id;
    form.querySelector("legend").textContent = corrente.domanda;
    form.querySelector(".sondaggio-opzioni").innerHTML = corrente.opzioni
      .map((o, i) => `<label class="sondaggio-opzione"><input type="radio" name="scelta" value="${i}" required><span>${esc(o)}</span></label>`).join("");
  }
  const stato = form.querySelector("[data-stato]");
  const mostraRisultati = (conti, mia, messaggio) => {
    form.querySelector("fieldset").insertAdjacentHTML("afterend", `<div class="sondaggio-esito">${risultati(corrente, conti, mia)}</div>`);
    form.querySelector(".sondaggio-opzioni").remove();
    form.querySelector("button").remove();
    stato.textContent = messaggio;
  };

  const salvata = memoria.leggi(corrente.id);
  chiama(corrente.id)
    .then((dati) => {
      const mia = dati.scelta ?? salvata;
      if (mia !== null && mia !== undefined) mostraRisultati(dati.conti, mia, D.testi.gia);
    })
    .catch(() => { /* in anteprima locale la funzione non c'è: si può comunque scegliere */ });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const scelta = form.querySelector("input[name=scelta]:checked");
    if (!scelta) { stato.textContent = D.testi.scegli; return; }
    const bottone = form.querySelector("button");
    bottone.disabled = true;
    stato.textContent = D.testi.caricamento;
    try {
      const dati = await chiama(corrente.id, Number(scelta.value));
      const mia = dati.scelta ?? Number(scelta.value);
      memoria.scrivi(corrente.id, mia);
      mostraRisultati(dati.conti, mia, D.testi.grazie);
    } catch {
      bottone.disabled = false;
      stato.textContent = D.testi.errore;
    }
  });

  // Pagina del sondaggio: risultati delle settimane precedenti
  const passati = document.querySelector("[data-sondaggi-passati]");
  if (passati) {
    const lista = passati.querySelector("[data-passati-lista]");
    const vecchi = iniziati.filter((s) => s.id !== corrente.id).reverse();
    if (vecchi.length) {
      passati.hidden = false;
      for (const s of vecchi) {
        const box = document.createElement("article");
        box.className = "sondaggio-passato";
        box.innerHTML = `<h3>${esc(s.domanda)}</h3><p class="sondaggio-stato">${esc(D.testi.caricamento)}</p>`;
        lista.appendChild(box);
        chiama(s.id)
          .then((dati) => { box.querySelector(".sondaggio-stato").outerHTML = risultati(s, dati.conti, dati.scelta ?? memoria.leggi(s.id)); })
          .catch(() => { box.querySelector(".sondaggio-stato").textContent = D.testi.errore; });
      }
    }
  }
})();
