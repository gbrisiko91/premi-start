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

  // La build pubblica già le domande storiche in HTML accessibile.
  // Qui completiamo le schede con i conteggi reali, senza duplicarle. Se la
  // data locale è cambiata dal deploy, aggiorniamo l'elenco senza incoerenze.
  const passati = document.querySelector("[data-sondaggi-passati]");
  if (passati) {
    const lista = passati.querySelector("[data-passati-lista]");
    const vecchi = iniziati.filter((s) => s.id !== corrente.id).reverse();
    const ids = new Set(vecchi.map((s) => s.id));
    for (const box of lista.querySelectorAll("[data-sondaggio-passato]")) {
      if (!ids.has(box.dataset.sondaggioPassato)) box.remove();
    }
    passati.hidden = vecchi.length === 0;
    for (const s of vecchi) {
      let box = [...lista.querySelectorAll("[data-sondaggio-passato]")]
        .find((node) => node.dataset.sondaggioPassato === s.id);
      if (!box) {
        box = document.createElement("article");
        box.className = "sondaggio-passato";
        box.dataset.sondaggioPassato = s.id;
        const titolo = document.createElement("h3");
        titolo.textContent = s.domanda;
        const opzioni = document.createElement("ul");
        opzioni.className = "sondaggio-passato-opzioni";
        for (const risposta of s.opzioni) {
          const li = document.createElement("li");
          li.textContent = risposta;
          opzioni.appendChild(li);
        }
        const stato = document.createElement("p");
        stato.className = "sondaggio-stato";
        stato.dataset.statoPassato = "";
        stato.hidden = true;
        box.append(titolo,opzioni,stato);
        lista.appendChild(box);
      }
      const stato = box.querySelector("[data-stato-passato]");
      stato.hidden = false;
      stato.textContent = D.testi.caricamento;
      chiama(s.id)
        .then((dati) => {
          if (!box.isConnected) return;
          box.querySelector(".sondaggio-passato-opzioni")?.remove();
          stato.outerHTML = risultati(s, dati.conti, dati.scelta ?? memoria.leggi(s.id));
        })
        .catch(() => { if (stato.isConnected) stato.textContent = D.testi.errore; });
    }
  }

})();
