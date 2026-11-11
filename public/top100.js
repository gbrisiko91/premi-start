// Top 100 della community (Missione 2K): scelta dei giochi, invio a /api/top100 e, con ?chiave=, la classifica.
(() => {
  const fonte = document.querySelector("[data-top100-dati]");
  const radice = document.querySelector("[data-top100]");
  if (!fonte || !radice) return;
  const D = JSON.parse(fonte.textContent);
  const $ = (s, r = radice) => r.querySelector(s);
  const el = (tag, attr = {}, ...figli) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attr)) k === "text" ? (e.textContent = v) : e.setAttribute(k, v);
    figli.forEach((f) => f && e.append(f));
    return e;
  };
  const giorno = (s) => new Date(`${s}T12:00:00`).toLocaleDateString("it-IT", { day: "numeric", month: "long" });
  const nomi = new Map(D.candidati.map((c) => [c.id, c]));
  const stato = $("[data-stato]");
  const scrivi = (t) => { stato.textContent = t; };

  // ----- classifica riservata: /top-100/?chiave=... -----
  const chiave = new URLSearchParams(location.search).get("chiave");
  if (chiave) {
    radice.replaceChildren(el("p", { class: "top100-nota", text: "Carico la classifica…" }));
    fetch(`/api/top100?chiave=${encodeURIComponent(chiave)}`).then((r) => r.json().then((d) => ({ ok: r.ok, d }))).then(({ ok, d }) => {
      if (!ok) { radice.replaceChildren(el("p", { class: "top100-nota", text: "Chiave non valida o variabile TOP100_CHIAVE non impostata su Netlify." })); return; }
      const righe = d.classifica.map((r) => el("tr", { class: r.posizione <= 100 ? "" : "top100-fuori" },
        el("td", { class: "top100-pos", text: `${r.posizione}°` }), el("td", { text: `${r.nome} (${r.anno})` }), el("td", { class: "top100-num", text: String(r.voti) })));
      const testo = d.classifica.filter((r) => r.posizione <= 100).map((r) => `${r.posizione}. ${r.nome} – ${r.voti} voti`).join("\n");
      const copia = el("button", { class: "tasto-start", type: "button", text: "Copia la top 100" });
      copia.onclick = () => navigator.clipboard?.writeText(testo).then(() => { copia.textContent = "Copiata ✓"; }, () => { copia.textContent = "Copia non riuscita"; });
      radice.replaceChildren(
        el("p", { class: "top100-nota", text: `${d.votanti} votanti · voto ${d.stato === "aperto" ? "aperto" : d.stato === "prima" ? "non ancora aperto" : "chiuso"} (${giorno(d.apertura)} – ${giorno(d.chiusura)}). Le righe grigie sono oltre il 100° posto.` }),
        copia,
        el("table", { class: "top100-tabella" }, el("thead", {}, el("tr", {}, el("th", { text: "Pos." }), el("th", { text: "Gioco" }), el("th", { class: "top100-num", text: "Voti" }))), el("tbody", {}, ...righe)),
        el("h2", { text: "Giochi proposti fuori elenco" }),
        d.proposte.length ? el("ul", { class: "top100-proposte" }, ...d.proposte.map((p) => el("li", { text: `${p.testo} – ${p.n}` }))) : el("p", { class: "top100-nota", text: "Nessuna proposta." }),
      );
    }).catch(() => radice.replaceChildren(el("p", { class: "top100-nota", text: "Classifica non raggiungibile: riprova tra poco." })));
    return;
  }

  // ----- voto -----
  const memoria = {
    leggi(k) { try { return localStorage.getItem(k); } catch { return null; } },
    scrivi(k, v) { try { localStorage.setItem(k, v); } catch { /* memoria non disponibile */ } },
  };
  let votante = memoria.leggi("top100:votante");
  if (!/^[a-z0-9]{16,40}$/.test(votante || "")) {
    votante = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
    memoria.scrivi("top100:votante", votante);
  }
  const scelti = new Set();
  const lista = $("[data-lista]");
  const cerca = $("[data-cerca]");
  const contatore = $("[data-contatore]");
  const chip = $("[data-scelti]");
  const proposta = $("[data-proposta]");
  const bottone = $("[data-invia]");
  const avviso = $("[data-avviso]");
  const votanti = $("[data-votanti]");
  let statoVoto = "aperto";

  const ordinati = [...D.candidati].sort((a, b) => a.nome.localeCompare(b.nome, "it"));
  lista.replaceChildren(...ordinati.map((c) => {
    const input = el("input", { type: "checkbox", value: c.id });
    input.addEventListener("change", () => {
      if (input.checked && scelti.size >= D.max) { input.checked = false; scrivi(`Puoi scegliere al massimo ${D.max} giochi: togline uno per aggiungerne un altro.`); return; }
      input.checked ? scelti.add(c.id) : scelti.delete(c.id);
      aggiorna();
    });
    return el("li", { "data-nome": `${c.nome} ${c.anno}`.toLowerCase() }, el("label", { class: "top100-gioco" }, input, el("span", { class: "top100-titolo", text: c.nome }), el("span", { class: "top100-anno", text: String(c.anno) })));
  }));

  cerca.addEventListener("input", () => {
    const q = cerca.value.trim().toLowerCase();
    let visibili = 0;
    for (const li of lista.children) { const ok = !q || li.dataset.nome.includes(q); li.hidden = !ok; visibili += ok; }
    $("[data-nessuno]").hidden = visibili > 0;
  });

  function aggiorna() {
    contatore.textContent = `${scelti.size}/${D.max}`;
    chip.replaceChildren(...[...scelti].map((id) => {
      const b = el("button", { type: "button", class: "top100-chip", "aria-label": `Togli ${nomi.get(id).nome}`, text: `${nomi.get(id).nome} ✕` });
      b.onclick = () => { scelti.delete(id); const i = lista.querySelector(`input[value="${CSS.escape(id)}"]`); if (i) i.checked = false; aggiorna(); };
      return b;
    }));
    bottone.disabled = statoVoto !== "aperto";
  }

  function imposta(mie) {
    scelti.clear();
    for (const i of lista.querySelectorAll("input")) i.checked = false;
    for (const id of mie?.scelte || []) {
      if (!nomi.has(id)) continue;
      scelti.add(id);
      const i = lista.querySelector(`input[value="${CSS.escape(id)}"]`);
      if (i) i.checked = true;
    }
    proposta.value = mie?.proposta || "";
    aggiorna();
  }

  function mostraStato(s, n) {
    statoVoto = s;
    if (typeof n === "number") votanti.textContent = n === 1 ? "1 player ha già votato" : `${n.toLocaleString("it-IT")} player hanno già votato`;
    avviso.textContent = s === "prima"
      ? `Il voto apre il ${giorno(D.apertura)}: intanto dai un'occhiata all'elenco.`
      : s === "chiuso"
        ? "Il voto è chiuso: grazie a tutti! La classifica arriva a puntate sul nostro Instagram e poi qui sul blog."
        : `Il voto è aperto fino al ${giorno(D.chiusura)} compreso. Puoi cambiare le tue scelte quando vuoi.`;
    radice.dataset.fase = s;
    aggiorna();
  }

  // Lo stato locale vale finché la funzione non risponde (in anteprima locale non c'è)
  const oggi = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
  mostraStato(oggi < D.apertura ? "prima" : oggi > D.chiusura ? "chiuso" : "aperto");
  fetch(`/api/top100?votante=${votante}`).then((r) => r.json()).then((d) => {
    mostraStato(d.stato, d.votanti);
    if (d.mie) { imposta(d.mie); scrivi("Hai già votato: queste sono le tue scelte. Puoi modificarle e salvare di nuovo."); }
  }).catch(() => { /* funzione non raggiungibile: si può comunque provare a votare */ });

  $("form", radice).addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!scelti.size && !proposta.value.trim()) { scrivi("Scegli almeno un gioco."); return; }
    bottone.disabled = true;
    scrivi("Salvo il tuo voto…");
    try {
      const r = await fetch("/api/top100", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ votante, scelte: [...scelti], proposta: proposta.value }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { scrivi(d.errore || "Il voto non è riuscito: riprova tra poco."); if (d.stato) mostraStato(d.stato); else bottone.disabled = false; return; }
      imposta(d.mie);
      mostraStato(d.stato, d.votanti);
      scrivi("Voto salvato! 🎮 Ora invita un amico a votare: più siamo, più la classifica è nostra.");
      $("[data-condividi]").hidden = false;
    } catch {
      bottone.disabled = false;
      scrivi("Il voto non è riuscito: controlla la connessione e riprova.");
    }
  });

  const condividi = $("[data-condividi]");
  condividi.addEventListener("click", async () => {
    const dati = { title: "Top 100 di Soffia Cartuccia", text: "Sto votando la top 100 dei videogiochi di Soffia Cartuccia: vota anche tu!", url: location.origin + location.pathname };
    try { if (navigator.share) await navigator.share(dati); else { await navigator.clipboard.writeText(dati.url); condividi.textContent = "Link copiato ✓"; } } catch { /* condivisione annullata */ }
  });
})();
