// Carosello di apertura della homepage (issue #92). Nessuna dipendenza e nessuna chiamata di rete.
// Senza JavaScript resta una fila di notizie scorrevole con la prima in evidenza e tutti i link attivi.
(function (globale) {
  "use strict";

  // ---------- regole pure (collaudate direttamente da tests/carosello-home.mjs) ----------
  function giornoPrima(g) {
    var p = String(g).split("-");
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] - 1)).toISOString().slice(0, 10);
  }
  // AAAA-MM-GG a Roma da formatToParts: il formato della stringa di format() non è garantito.
  function giornoRoma(istante, formatter) {
    try {
      var f = formatter || new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" });
      var p = {};
      f.formatToParts(istante).forEach(function (x) { p[x.type] = x.value; });
      var g = p.year + "-" + p.month + "-" + p.day;
      return /^\d{4}-\d{2}-\d{2}$/.test(g) ? g : "";
    } catch (e) { return ""; }
  }
  // giorni: data-giorno delle slide, già nell'ordine del sito. Riferimento = il più recente fra
  // giorno del lettore e giorno del build: un orologio del lettore indietro non svuota né riordina il carosello.
  function regola(giorni, oggiLettore, oggiBuild, ripiego) {
    var valido = /^\d{4}-\d{2}-\d{2}$/;
    var oggi = valido.test(oggiLettore || "") && (!valido.test(oggiBuild || "") || oggiLettore > oggiBuild) ? oggiLettore : oggiBuild;
    var ieri = giornoPrima(oggi);
    var indici = [];
    giorni.forEach(function (g, i) { if (g >= ieri && g <= oggi) indici.push(i); });
    if (indici.length) return { indici: indici, recenti: true, oggi: oggi };
    var n = Math.min(giorni.length, Math.max(1, ripiego || 5));
    for (var i = 0; i < n; i++) indici.push(i);
    return { indici: indici, recenti: false, oggi: oggi };
  }
  globale.SoffiaCarosello = { giornoPrima: giornoPrima, giornoRoma: giornoRoma, regola: regola };

  // ---------- interfaccia ----------
  if (typeof document === "undefined") return;
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
  var conInert = "inert" in HTMLElement.prototype;
  var formatter = null;
  try { formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }); } catch (e) { formatter = null; }
  var visibili = [];
  var indice = 0;
  var fermo = menoMoto.matches; // fermato dall'utente (o preferenza di movimento ridotto)
  var sospeso = false; // sospensione temporanea: puntatore sopra
  var timer = 0;
  var giornoMostrato = "";
  var scorriProgrammato = 0;

  function testo(modello, n, tot) { return String(modello || "").replace("{n}", n).replace("{tot}", tot); }
  function daTastiera(el) { try { return el.matches(":focus-visible"); } catch (e) { return true; } }

  // Solo la slide attiva è raggiungibile da tastiera e lettori di schermo; le altre sono inerti.
  // Lo scorrimento (swipe, rotella, frecce) resta sulla pista, che non è mai inerte.
  function aggiornaAttiva() {
    visibili.forEach(function (s, i) {
      var attiva = i === indice;
      if (conInert) s.inert = !attiva;
      if (attiva) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
      if (!conInert) {
        Array.prototype.forEach.call(s.querySelectorAll("a[href], button"), function (el) {
          if (el.classList.contains("carosello-media")) return; // già fuori dal tab order
          if (attiva) el.removeAttribute("tabindex"); else el.setAttribute("tabindex", "-1");
        });
      }
    });
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
    aggiornaAttiva();
  }

  // Stessa regola del build (strumenti/carosello-home.mjs), riapplicata al cambio di data senza nuovo deploy.
  function filtra() {
    var esito = regola(slide.map(function (s) { return s.dataset.giorno; }), formatter ? giornoRoma(new Date(), formatter) : "", d.oggi, ripiego);
    if (esito.oggi === giornoMostrato) return;
    giornoMostrato = esito.oggi;
    var fuoco = document.activeElement;
    var fuocoDentro = fuoco && radice.contains(fuoco) && fuoco !== radice;
    var fuocoSuPunto = fuocoDentro && punti.contains(fuoco);
    var corrente = visibili[indice];
    visibili = esito.indici.map(function (i) { return slide[i]; });
    slide.forEach(function (s) { s.hidden = visibili.indexOf(s) === -1; if (s.hidden) { s.inert = false; s.removeAttribute("aria-hidden"); } });
    radice.setAttribute("aria-label", esito.recenti ? d.testoRecenti : d.testoUltime);
    var etichetta = radice.querySelector("[data-carosello-etichetta]");
    if (etichetta) etichetta.textContent = esito.recenti ? d.testoRecenti : d.testoUltime;
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
    var resta = visibili.indexOf(corrente);
    indice = resta >= 0 ? resta : 0;
    vai(indice, false);
    // Il fuoco non va perso se il suo elemento è stato rimosso o nascosto dal cambio di data.
    if (fuocoDentro && (fuocoSuPunto || !document.contains(fuoco) || fuoco.closest("[hidden]"))) {
      var destinazione = multiple ? punti.children[indice] : visibili[0] && visibili[0].querySelector(".carosello-titolo a");
      (destinazione || radice).focus();
    }
    programma();
  }

  function vai(i, utente) {
    if (!visibili.length) return;
    indice = (i + visibili.length) % visibili.length;
    var bersaglio = visibili[indice];
    scorriProgrammato = Date.now();
    pista.scrollTo({ left: bersaglio.offsetLeft - pista.offsetLeft, behavior: menoMoto.matches || (!utente && document.hidden) ? "auto" : "smooth" });
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

  // Fuoco da tastiera su qualsiasi elemento del carosello, tasto pausa compreso: la rotazione si ferma
  // e riparte solo attivando il tasto. Il fuoco dato dal clic del mouse non conta, così il clic sulla
  // pausa non si annulla da solo (fuoco = stop, clic = riavvio).
  radice.addEventListener("focusin", function (e) { if (daTastiera(e.target)) ferma(); });
  radice.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("[data-carosello-punti], [data-carosello-prec], [data-carosello-succ]")) {
      var verso = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
      if (!verso) return;
      e.preventDefault();
      ferma();
      vai(indice + verso, true);
      if (punti.contains(e.target) && punti.children[indice]) punti.children[indice].focus();
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

  radice.setAttribute("tabindex", "-1"); // destinazione del fuoco se l'elemento attivo sparisce
  radice.classList.add("carosello-attivo");
  filtra();
})(typeof window !== "undefined" ? window : globalThis);
