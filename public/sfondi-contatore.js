/* Solo nella pagina /sfondi/: registra il clic senza interrompere il download.
 * Nessun cookie, fingerprint o identificatore. Nessuna libreria esterna.
 */
(() => {
  const percorsi = {
    "/sfondi/soffiacartuccia-sfondo-01-cartuccia.png": "cartuccia",
    "/sfondi/soffiacartuccia-sfondo-02-mappa.png": "mappa",
    "/sfondi/soffiacartuccia-sfondo-03-press-start.png": "press-start",
  };
  document.addEventListener("click", (event) => {
    const link = event.target?.closest?.("a[href]");
    if (!link || !link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    const id = percorsi[url.pathname];
    if (!id) return;
    // Il link originale resta invariato: se il conteggio fallisce, lo sfondo si scarica comunque.
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/statistiche-sfondi", id);
      } else {
        fetch("/api/statistiche-sfondi", {
          method: "POST", body: id, headers: { "content-type": "text/plain" },
          credentials: "omit", keepalive: true
        }).catch(() => {});
      }
    } catch {
      // Nessun blocco o messaggio al visitatore: il download ha sempre la precedenza.
    }
  }, { passive: true });
})();
