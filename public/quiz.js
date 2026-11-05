// Una domanda al giorno, scelta con la data locale del lettore. Nessun account,
// cookie, analitica o punteggio persistente.
(() => {
  "use strict";
  const root = document.querySelector("[data-quiz]");
  if (!root) return;
  const raw = document.querySelector("#quiz-dati");
  let quiz;
  try { quiz = JSON.parse(raw?.textContent || "null"); } catch { quiz = null; }
  if (!quiz || !Array.isArray(quiz.items) || !quiz.items.length) return;
  const oggi = new Date();
  const giorno = Math.floor(Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()) / 86400000);
  const domanda = quiz.items[((giorno % quiz.items.length) + quiz.items.length) % quiz.items.length];
  if (!Array.isArray(domanda) || domanda[1].length !== 4) return;
  // Rotazione deterministica, nessun risultato casuale e nessuna richiesta di rete.
  const offset = (giorno * 3 + 1) % 4;
  const ordine = [0,1,2,3].map((_,i)=>(i+offset)%4);
  const titolo = root.querySelector("[data-domanda]");
  const opzioni = root.querySelector("[data-opzioni]");
  const verifica = root.querySelector("[data-verifica]");
  const esito = root.querySelector("[data-esito]");
  const share = root.querySelector("[data-condividi]");
  const giornoTesto = root.querySelector("[data-giorno]");
  const fmt = new Intl.DateTimeFormat(document.documentElement.lang || "it", { year:"numeric",month:"long",day:"numeric" });
  giornoTesto.textContent = fmt.format(oggi);
  titolo.textContent = domanda[0];

  const form = document.createElement("fieldset");
  form.className = "quiz-risposte";
  const legend = document.createElement("legend");
  legend.textContent = quiz.scegli;
  form.appendChild(legend);
  for (const index of ordine) {
    const label = document.createElement("label");
    label.className = "quiz-opzione";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "risposta";
    input.value = String(index);
    input.required = true;
    const text = document.createElement("span");
    text.textContent = domanda[1][index];
    label.append(input,text);
    form.appendChild(label);
  }
  opzioni.replaceChildren(form);
  verifica.hidden = false;
  let risposto = false;
  verifica.addEventListener("click", () => {
    if (risposto) return;
    const selezione = form.querySelector("input:checked");
    if (!selezione) {
      form.querySelector("input")?.focus();
      return;
    }
    risposto = true;
    const ok = Number(selezione.value) === 0;
    for (const radio of form.querySelectorAll("input")) {
      radio.disabled = true;
      const label = radio.parentElement;
      if (radio.value === "0") label.classList.add("quiz-corretta");
      if (radio.checked && !ok) label.classList.add("quiz-errata");
    }
    const result = document.createElement("strong");
    result.textContent = ok ? quiz.giusto : quiz.sbagliato;
    const detail = document.createElement("p");
    detail.textContent = (!ok ? quiz.risposta + " " + domanda[1][0] + " — " : "") + domanda[2];
    const tomorrow = document.createElement("p");
    tomorrow.className = "quiz-domani";
    tomorrow.textContent = quiz.torna;
    esito.replaceChildren(result,detail,tomorrow);
    esito.hidden = false;
    verifica.hidden = true;
    share.hidden = false;
    esito.focus();
    share.addEventListener("click", async () => {
      const text = `${quiz.nome} · ${fmt.format(oggi)} · ${ok ? quiz.giusto : quiz.sbagliato} ${location.href}`;
      if (navigator.share) {
        try { await navigator.share({title:quiz.nome,text,url:location.href}); return; } catch {}
      }
      try { await navigator.clipboard.writeText(text); share.textContent = quiz.condiviso; } catch {}
    },{once:true});
  });
})();
