// Carosello di apertura della homepage (issue #92). Nessuna dipendenza e nessuna chiamata di rete.
// Senza JavaScript resta una fila di notizie scorrevole con la prima in evidenza e tutti i link attivi.
(function () {
  "use strict";
  var radice = document.querySelector("[data-carosello]");
  if (!radice) return;
  var pista = radice.querySelector("[data-carosello-pista]");
  var slide = Array.prototype.slice.call(radice.querySelectorAll("[data-giorno]"));
  var controlli = radice.querySelector("[data-carosello-controlli]");
  var punti = radice.querySelector("[data-carosello-punti]");
  var tastoPrec = radice.querySelector("[data-carosello-prec]");
  var tastoSucc = radice.querySelector("[data-carosello-succ]");
  var tastoPausa = radice.querySelector("[data-carosello-pausa]");
  if (!pista || !slide.length || !controlli || !punti || !tastoPrec || !tastoSucc || !tastoPausa) return;

  var d = radice.dataset;
  var rotazione = Math.max(3000, Number(d.rotazione) || 6000);
  var ripiego = Math.max(1, Number(d.fallback) || 5);
  var menoMoto = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var visibili = [];
  var indice = 0;
  var fermo = menoMoto.matches; // fermato dall'utente (o preferenza di movimento ridotto)
  var sospeso = false; // sospensione temporanea: puntatore sopra, scheda nascosta
  var timer = 0;
  var giornoMostrato = "";
  var scorriProgrammato = 0;

  var fmt;
  try { fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }); } catch (e) { fmt = null; }
  function oggiRoma() {
    var g = fmt ? fmt.format(new Date()) : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(g) ? g : d.oggi;
  }
  function giornoPrima(g) {
    var p = g.split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] - 1)).toISOString().slice(0, 10);
  }
  function testo(modello, n, tot) { return String(modello || "").replace("{n}", n).replace("{tot}", tot); }

  // Stessa regola del build (strumenti/carosello-home.mjs): oggi + ieri a Roma, altrimenti le ultime pubblicate.
  function filtra() {
    var oggi = oggiRoma();
    if (oggi === giornoMostrato) return;
    giornoMostrato = oggi;
    var ieri = giornoPrima(oggi);
    var recenti = slide.filter(function (s) { return s.dataset.giorno >= ieri; });
    var recente = recenti.length > 0;
    visibili = recente ? recenti : slide.slice(0, ripiego);
    slide.forEach(function (s) { s.hidden = visibili.indexOf(s) === -1; });
    radice.setAttribute("aria-label", recente ? d.testoRecenti : d.testoUltime);
    var etichetta = radice.querySelector("[data-carosello-etichetta]");
    if (etichetta) etichetta.textContent = recente ? d.testoRecenti : d.testoUltime;
    visibili.forEach(function (s, i) { s.setAttribute("aria-label", testo(d.posizione, i + 1, visibili.length)); });
    punti.textContent = "";
    visibili.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carosello-punto";
      b.setAttribute("aria-label", testo(d.vai, i + 1, visibili.length));
      b.addEventListener("click", function () { ferma(); vai(i, true); });
      punti.appendChild(b);
    });
    var multiple = visibili.length > 1;
    controlli.hidden = !multiple;
    radice.classList.toggle("carosello-singolo", !multiple);
    indice = Math.min(indice, visibili.length - 1);
    vai(indice, false);
    programma();
  }

  function aggiornaStato() {
    Array.prototype.forEach.call(punti.children, function (b, i) {
      if (i === indice) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    var attivo = !fermo && visibili.length > 1;
    tastoPausa.setAttribute("aria-label", attivo ? d.pausa : d.avvia);
    tastoPausa.setAttribute("aria-pressed", attivo ? "false" : "true");
    tastoPausa.dataset.stato = attivo ? "gira" : "fermo";
    // Annunci solo quando l'utente comanda: durante la rotazione automatica nessuna regione live.
    pista.setAttribute("aria-live", attivo ? "off" : "polite");
  }

  function vai(i, utente) {
    if (!visibili.length) return;
    indice = (i + visibili.length) % visibili.length;
    var bersaglio = visibili[indice];
    scorriProgrammato = Date.now();
    pista.scrollTo({ left: bersaglio.offsetLeft - pista.offsetLeft, behavior: menoMoto.matches || !utente && document.hidden ? "auto" : "smooth" });
    aggiornaStato();
  }

  function programma() {
    clearTimeout(timer);
    if (fermo || sospeso || visibili.length < 2 || document.hidden) return;
    timer = setTimeout(function () { vai(indice + 1, false); programma(); }, rotazione);
  }
  function ferma() { fermo = true; clearTimeout(timer); aggiornaStato(); }

  tastoPrec.addEventListener("click", function () { ferma(); vai(indice - 1, true); });
  tastoSucc.addEventListener("click", function () { ferma(); vai(indice + 1, true); });
  tastoPausa.addEventListener("click", function () {
    fermo = !fermo;
    aggiornaStato();
    programma();
  });

  // Fuoco da tastiera dentro il carosello (link, punti, frecce): la rotazione si ferma e riparte solo col tasto.
  radice.addEventListener("focusin", function (e) { if (e.target !== tastoPausa) ferma(); });
  radice.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("[data-carosello-punti], [data-carosello-prec], [data-carosello-succ]")) {
      if (e.key === "ArrowLeft") { e.preventDefault(); ferma(); vai(indice - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); ferma(); vai(indice + 1, true); }
    }
  });
  // Puntatore sopra: pausa temporanea. Tocco o trascinamento: interazione, la rotazione si ferma.
  radice.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { sospeso = true; clearTimeout(timer); } });
  radice.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { sospeso = false; programma(); } });
  pista.addEventListener("touchstart", ferma, { passive: true });
  pista.addEventListener("wheel", function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) ferma(); }, { passive: true });

  // Lo swipe è lo scorrimento nativo (orizzontale): il gesto verticale resta alla pagina.
  var attesa = 0;
  pista.addEventListener("scroll", function () {
    clearTimeout(attesa);
    attesa = setTimeout(function () {
      if (Date.now() - scorriProgrammato < 700) return;
      var sinistra = pista.scrollLeft, migliore = 0, distanza = Infinity;
      visibili.forEach(function (s, i) {
        var dx = Math.abs(s.offsetLeft - pista.offsetLeft - sinistra);
        if (dx < distanza) { distanza = dx; migliore = i; }
      });
      if (migliore !== indice) { indice = migliore; aggiornaStato(); }
    }, 120);
  }, { passive: true });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { clearTimeout(timer); return; }
    filtra(); // cambio di data mentre la scheda era chiusa o in secondo piano
    programma();
  });
  window.addEventListener("pageshow", function () { filtra(); programma(); });
  setInterval(function () { if (!document.hidden) filtra(); }, 60000);
  if (menoMoto.addEventListener) menoMoto.addEventListener("change", function () { if (menoMoto.matches) ferma(); });
  window.addEventListener("resize", function () { vai(indice, false); }, { passive: true });

  radice.classList.add("carosello-attivo");
  filtra();
})();
