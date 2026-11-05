/* Ricerca, Checkpoint e preferiti: dati nel browser, nessun account o tracker. */
(() => {
  "use strict";
  const lang = document.documentElement.lang || "it";
  const indiceUrl = `/indice-${lang}.json`;
  const chiaveSalvati = "sc:salvati:v1";
  const chiaveVisita = `sc:visita:${lang}:v2`;
  const chiaveAttivo = `sc:checkpoint:${lang}:v1`;
  let indicePromise = null;

  function leggi(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch { return fallback; }
  }
  function scrivi(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  }
  function salvati() {
    const stored = leggi(chiaveSalvati, []);
    return Array.isArray(stored) ? stored.filter((s) => typeof s === "string").slice(0, 200) : [];
  }
  function caricaIndice() {
    if (!indicePromise) {
      indicePromise = fetch(indiceUrl)
        .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then((items) => {
          if (!Array.isArray(items)) throw new Error("Indice non valido");
          return items.filter((a) => a && typeof a.url === "string" && a.url.startsWith("/") && typeof a.titolo === "string");
        })
        .catch((err) => { indicePromise = null; throw err; });
    }
    return indicePromise;
  }

  // Ricerca accessibile senza nuove pagine o servizi server.
  const apri = document.querySelector("[data-ricerca-apri]");
  const dialog = document.querySelector("[data-ricerca-dialog]");
  if (apri && dialog && typeof dialog.showModal === "function") {
    const input = dialog.querySelector("[data-ricerca-input]");
    const close = dialog.querySelector("[data-ricerca-chiudi]");
    const lista = dialog.querySelector("[data-ricerca-risultati]");
    const status = dialog.querySelector("[data-ricerca-stato]");
    const messaggi = dialog.dataset;
    let richiesta = 0;

    function normalizza(s) {
      return String(s || "").toLocaleLowerCase(lang).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    function mostraRisultato(a) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = a.url;
      link.textContent = a.titolo;
      const meta = document.createElement("small");
      meta.textContent = [a.categoria, a.dataBreve].filter(Boolean).join(" · ");
      link.appendChild(meta);
      li.appendChild(link);
      lista.appendChild(li);
    }
    async function cerca() {
      const valore = input.value.trim();
      const corrente = ++richiesta;
      lista.replaceChildren();
      if (valore.length < 2) {
        status.textContent = messaggi.scrivi || "";
        return;
      }
      status.textContent = "…";
      try {
        const articoli = await caricaIndice();
        if (corrente !== richiesta) return;
        const termini = normalizza(valore).split(/\s+/).filter(Boolean);
        const punteggio = (a) => {
          const title = normalizza(a.titolo);
          const other = normalizza([a.sommario, a.categoria, ...(Array.isArray(a.tag) ? a.tag : [])].join(" "));
          if (!termini.every((term) => title.includes(term) || other.includes(term))) return -1;
          return termini.reduce((n, term) => n + (title.includes(term) ? 3 : 1), 0);
        };
        const trovati = articoli.map((a) => ({ a, score: punteggio(a) }))
          .filter((x) => x.score >= 0)
          .sort((a, b) => b.score - a.score || (b.a.data || "").localeCompare(a.a.data || ""))
          .slice(0, 15);
        for (const r of trovati) mostraRisultato(r.a);
        status.textContent = trovati.length ? String(trovati.length) : (messaggi.vuoto || "");
      } catch {
        if (corrente === richiesta) status.textContent = messaggi.errore || "";
      }
    }
    apri.hidden = false;
    apri.addEventListener("click", () => {
      dialog.showModal();
      input.focus();
    });
    close.addEventListener("click", () => dialog.close());
    input.addEventListener("input", cerca);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "/" || event.altKey || event.ctrlKey || event.metaKey || dialog.open) return;
      if (event.target.closest("input,textarea,select,[contenteditable='true']")) return;
      event.preventDefault();
      dialog.showModal();
      input.focus();
    });
  }

  // Preferiti salvati solo nel localStorage del dispositivo.
  const bottoni = [...document.querySelectorAll("[data-salva-articolo]")];
  function aggiornaBottoni() {
    const attivi = new Set(salvati());
    bottoni.forEach((b) => {
      const selezionato = attivi.has(b.dataset.salvaArticolo);
      b.setAttribute("aria-pressed", String(selezionato));
      b.textContent = selezionato ? "★ " + b.dataset.salvato : "☆ " + b.dataset.salva;
    });
  }
  bottoni.forEach((b) => {
    b.hidden = false;
    b.addEventListener("click", () => {
      const id = b.dataset.salvaArticolo;
      const elenco = salvati();
      const prossimo = elenco.includes(id) ? elenco.filter((x) => x !== id) : [...elenco, id].slice(-200);
      scrivi(chiaveSalvati, prossimo);
      aggiornaBottoni();
    });
  });
  aggiornaBottoni();

  // Checkpoint attivato volontariamente: confronta gli ID, anche per notizie pubblicate lo stesso giorno.
  const checkpoint = document.querySelector("[data-checkpoint]");
  function rigaArticolo(a) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = a.url;
    link.textContent = a.titolo;
    const meta = document.createElement("small");
    meta.textContent = [a.categoria, a.dataBreve].filter(Boolean).join(" · ");
    link.appendChild(meta);
    li.appendChild(link);
    return li;
  }
  function mostraLista(ul, items, empty) {
    ul.replaceChildren();
    if (!items.length) {
      const li = document.createElement("li");
      li.className = "checkpoint-stato";
      li.textContent = empty;
      ul.appendChild(li);
    } else items.forEach((a) => ul.appendChild(rigaArticolo(a)));
  }
  async function aggiornaCheckpoint() {
    if (!checkpoint) return;
    const news = checkpoint.querySelector("[data-checkpoint-news]");
    const saves = checkpoint.querySelector("[data-checkpoint-salvati]");
    const stato = checkpoint.querySelector("[data-checkpoint-stato]");
    try {
      const articoli = await caricaIndice();
      const attivo = leggi(chiaveAttivo, false) === true;
      const toggle = checkpoint.querySelector("[data-checkpoint-toggle]");
      toggle.textContent = attivo ? checkpoint.dataset.disattiva : checkpoint.dataset.attiva;
      toggle.setAttribute("aria-pressed", String(attivo));
      const precedente = attivo ? leggi(chiaveVisita, null) : null;
      const visti = Array.isArray(precedente) ? new Set(precedente.filter((x) => typeof x === "string")) : null;
      const nuovi = visti ? articoli.filter((a) => !visti.has(a.id)).slice(0, 3) : articoli.slice(0, 3);
      mostraLista(news, nuovi.length ? nuovi : articoli.slice(0, 3), checkpoint.dataset.vuoto);
      stato.textContent = !attivo ? checkpoint.dataset.spento : !visti ? checkpoint.dataset.prima : nuovi.length ? checkpoint.dataset.nuovi : checkpoint.dataset.aggiornato;
      const preferiti = new Set(salvati());
      mostraLista(saves, articoli.filter((a) => preferiti.has(a.id)).slice(0, 6), checkpoint.dataset.nessunSalvato);
      if (attivo) scrivi(chiaveVisita, articoli.map((a) => a.id));
    } catch {
      stato.textContent = checkpoint.dataset.errore || "";
    }
  }
  if (checkpoint) {
    const toggle = checkpoint.querySelector("[data-checkpoint-toggle]");
    toggle.addEventListener("click", () => {
      const attivo = leggi(chiaveAttivo, false) === true;
      if (attivo) {
        scrivi(chiaveAttivo, false);
        try { localStorage.removeItem(chiaveVisita); } catch { /* browser senza storage */ }
      } else {
        scrivi(chiaveAttivo, true);
      }
      aggiornaCheckpoint();
    });
    aggiornaCheckpoint();
  }
  window.addEventListener("storage", (ev) => {
    if (ev.key === chiaveSalvati) {
      aggiornaBottoni();
      if (checkpoint) aggiornaCheckpoint();
    }
  });

  // Indicatore discreto della lettura, senza cambiare gli articoli.
  const progresso = document.querySelector("[data-lettura-progresso]");
  const articolo = document.querySelector("article.articolo:not(.pagina-fissa)");
  if (progresso && articolo) {
    let programmato = false;
    const misura = () => {
      programmato = false;
      const top = articolo.getBoundingClientRect().top + window.scrollY;
      const totale = Math.max(1, articolo.offsetHeight - window.innerHeight * .5);
      const percent = Math.max(0, Math.min(100, ((window.scrollY - top) / totale) * 100));
      progresso.style.width = percent.toFixed(1) + "%";
    };
    window.addEventListener("scroll", () => {
      if (!programmato) {
        programmato = true;
        requestAnimationFrame(misura);
      }
    }, { passive: true });
    window.addEventListener("resize", misura);
    misura();
  }
})();
