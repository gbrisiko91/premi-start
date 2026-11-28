// Carosello di apertura della homepage (issue #92).
// Selezione pura e testabile: nessun accesso a rete, file o orologio implicito.
// I giorni sono sempre giorni di calendario di Europe/Rome (non finestre mobili di 48 ore).

export const FUSO_REDAZIONE = "Europe/Rome";
export const FALLBACK_CAROSELLO = 5;
export const ROTAZIONE_MS = 6000;

const formatoGiorno = new Intl.DateTimeFormat("en-US", { timeZone: FUSO_REDAZIONE, year: "numeric", month: "2-digit", day: "2-digit" });

// AAAA-MM-GG dell'istante a Roma, costruito con formatToParts (il formato della stringa non è garantito da ECMA-402).
export function giornoIstanteRoma(istante = new Date()) {
  const data = istante instanceof Date ? istante : new Date(istante);
  if (Number.isNaN(data.getTime())) return "";
  const p = Object.fromEntries(formatoGiorno.formatToParts(data).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

// Giorno AAAA-MM-GG di pubblicazione secondo la redazione.
// Le date del front matter senza orario (AAAA-MM-GG) arrivano come mezzanotte UTC:
// in quel caso vale la data scritta, così un articolo del 28 resta del 28 anche fra 00:00 e 02:00 a Roma.
export function giornoRoma(d) {
  const data = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(data.getTime())) return "";
  const iso = data.toISOString();
  if (iso.endsWith("T00:00:00.000Z")) return iso.slice(0, 10);
  return giornoIstanteRoma(data);
}

// Giorno di calendario precedente: aritmetica sulla data, quindi indifferente all'ora legale.
export function giornoPrima(giorno) {
  const [a, m, g] = giorno.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, g - 1)).toISOString().slice(0, 10);
}

// articoli: già nell'ordine del sito (data decrescente, poi hype, poi ordine di lettura) e della sola lingua corrente.
// Restituisce { voci, recenti, candidati }:
// - voci: quelle mostrate al build (oggi + ieri; se nessuna, le ultime 5 pubblicate);
// - recenti: true se le voci sono di oggi/ieri, false se è il ripiego;
// - candidati: voci + eventuali ripieghi da tenere nascosti nell'HTML per il riallineamento lato client.
export function selezionaCarosello(articoli, { oggi, fallback = FALLBACK_CAROSELLO } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(oggi || ""))) throw new Error("selezionaCarosello: 'oggi' deve essere AAAA-MM-GG");
  const ieri = giornoPrima(oggi);
  const pubblicati = articoli
    .filter((a) => a && !a.bozza && a.url && a.titolo)
    .map((a) => ({ a, giorno: giornoRoma(a.data) }))
    .filter((x) => x.giorno && x.giorno <= oggi); // niente articoli futuri
  const recenti = pubblicati.filter((x) => x.giorno >= ieri);
  const voci = recenti.length ? recenti : pubblicati.slice(0, fallback);
  // I recenti sono un prefisso dell'elenco ordinato: i candidati sono il prefisso più lungo fra voci e ripiego.
  const candidati = pubblicati.slice(0, Math.max(voci.length, Math.min(fallback, pubblicati.length)));
  return { voci, recenti: recenti.length > 0, candidati, oggi, ieri };
}

// Solo immagini HTTPS o percorsi locali dello stesso sito; altrimenti copertina di categoria.
// Rifiuta spazi, caratteri di controllo e backslash (i browser trattano "/\\host" come "//host"),
// e verifica l'origine con il parser URL.
const BASE_LOCALE = "https://soffiacartuccia.invalid";
export const urlImmagineSicuro = (u) => {
  const s = String(u ?? "");
  if (!s || /[\s\\\u0000-\u001f\u007f"'<>`]/.test(s)) return "";
  let url;
  try { url = new URL(s, BASE_LOCALE); } catch { return ""; }
  if (s.startsWith("/")) return !s.startsWith("//") && url.origin === BASE_LOCALE ? s : "";
  return /^https:\/\//i.test(s) && url.protocol === "https:" && !url.username && !url.password && url.hostname ? s : "";
};

// Testi dell'interfaccia nelle nove lingue del sito.
export const TESTI_CAROSELLO = Object.freeze({
  it: { recenti: "Notizie di oggi e di ieri", ultime: "Ultime notizie", prec: "Notizia precedente", succ: "Notizia successiva", pausa: "Ferma lo scorrimento automatico", avvia: "Avvia lo scorrimento automatico", posizione: "{n} di {tot}", vai: "Vai alla notizia {n}", carosello: "carosello", slide: "notizia" },
  en: { recenti: "Today's and yesterday's news", ultime: "Latest news", prec: "Previous story", succ: "Next story", pausa: "Stop automatic slideshow", avvia: "Start automatic slideshow", posizione: "{n} of {tot}", vai: "Go to story {n}", carosello: "carousel", slide: "story" },
  de: { recenti: "Nachrichten von heute und gestern", ultime: "Neueste Nachrichten", prec: "Vorherige Meldung", succ: "Nächste Meldung", pausa: "Automatischen Wechsel stoppen", avvia: "Automatischen Wechsel starten", posizione: "{n} von {tot}", vai: "Zur Meldung {n}", carosello: "Karussell", slide: "Meldung" },
  es: { recenti: "Noticias de hoy y de ayer", ultime: "Últimas noticias", prec: "Noticia anterior", succ: "Noticia siguiente", pausa: "Detener el pase automático", avvia: "Iniciar el pase automático", posizione: "{n} de {tot}", vai: "Ir a la noticia {n}", carosello: "carrusel", slide: "noticia" },
  no: { recenti: "Nyheter fra i dag og i går", ultime: "Siste nytt", prec: "Forrige sak", succ: "Neste sak", pausa: "Stopp automatisk visning", avvia: "Start automatisk visning", posizione: "{n} av {tot}", vai: "Gå til sak {n}", carosello: "karusell", slide: "sak" },
  sv: { recenti: "Nyheter från i dag och i går", ultime: "Senaste nytt", prec: "Föregående nyhet", succ: "Nästa nyhet", pausa: "Stoppa automatisk visning", avvia: "Starta automatisk visning", posizione: "{n} av {tot}", vai: "Gå till nyhet {n}", carosello: "karusell", slide: "nyhet" },
  fi: { recenti: "Tämän päivän ja eilisen uutiset", ultime: "Uusimmat uutiset", prec: "Edellinen uutinen", succ: "Seuraava uutinen", pausa: "Pysäytä automaattinen vaihto", avvia: "Käynnistä automaattinen vaihto", posizione: "{n}/{tot}", vai: "Siirry uutiseen {n}", carosello: "karuselli", slide: "uutinen" },
  ja: { recenti: "今日と昨日のニュース", ultime: "最新ニュース", prec: "前のニュース", succ: "次のニュース", pausa: "自動切り替えを停止", avvia: "自動切り替えを開始", posizione: "{tot}件中{n}件目", vai: "ニュース{n}へ移動", carosello: "カルーセル", slide: "ニュース" },
  ru: { recenti: "Новости за сегодня и вчера", ultime: "Последние новости", prec: "Предыдущая новость", succ: "Следующая новость", pausa: "Остановить автопрокрутку", avvia: "Включить автопрокрутку", posizione: "{n} из {tot}", vai: "Перейти к новости {n}", carosello: "карусель", slide: "новость" },
});
